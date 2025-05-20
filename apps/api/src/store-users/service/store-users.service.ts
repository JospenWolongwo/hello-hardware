/* eslint-disable max-lines */
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, In, IsNull, Not, Repository } from 'typeorm';
import { EmailService } from '../../email/services/email.service';
import type { Store } from '../../store/entities/store.entity';
import type { UserEntity } from '../../user-management/entities/user.entity';
import { UserPermissionsService } from '../../user-permissions/service/user-permissions.service';
import type { ToggleUserDto } from '../dto/toggle-user.dto';
import { StoreUser } from '../entity/store-user.entity';
import { SerializedStoreUser } from '../types/serialized-store-user';

@Injectable()
export class StoreUsersService {
  // eslint-disable-next-line max-params
  constructor(
    @InjectRepository(StoreUser) private readonly storeUsersRepository: Repository<StoreUser>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly userPermissionService: UserPermissionsService
  ) {}

  private readonly logger = new Logger(StoreUsersService.name);

  async create(user: UserEntity, store: Store, inviter: UserEntity | null = null) {
    const storeUserExist = await this.storeUsersRepository.exist({
      where: {
        user: { id: user.id },
        store: { id: store.id },
      },
    });

    if (!storeUserExist) {
      const newStoreUser = this.storeUsersRepository.create();

      newStoreUser.store = store;

      newStoreUser.user = user;

      if (inviter?.id) {
        const isStoreUser = await this.isActiveByUserIdAndStoreId(inviter.id, store.id);

        if (isStoreUser) {
          newStoreUser.inviter = inviter;
        } else {
          const error = new HttpException(
            `You are not an active store user to the store with name: ${store.name}.`,
            HttpStatus.BAD_REQUEST
          );

          this.logger.error(
            {
              function: this.create.name,
              input: { user: user, store: store, inviter: inviter },
              error: error,
            },
            `The user with id: '${user.id}' is not an active store user to the store with id: ${store.id}.`
          );

          throw error;
        }
      }

      await this.userPermissionService.addPermissions(user.id, {
        permissions: ['ViewStore', 'ViewOrderItems', 'ViewStock', 'ViewProducts'],
      });

      await this.storeUsersRepository.save(newStoreUser).catch((error) => {
        this.logger.error(
          { function: 'create', input: { user: user, store: store, inviter: inviter }, error: error },
          `Failed to save new store user`
        );

        throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
      });

      return;
    }

    const error = new HttpException(
      `The store user with email ${user.auth.email} belonging to the store ${store.name}, already exist.`,
      HttpStatus.CONFLICT
    );
    this.logger.error(
      { function: 'create', input: { user: user, store: store, inviter: inviter }, error: error },
      `The store user with email ${user.auth.email} belonging to the store ${store.name}, already exist.`
    );

    throw error;
  }

  async sendInvitationEmail(inviterUid: string, storeId: string, email: string) {
    const isStoreUser = await this.isActiveByUserIdAndStoreId(inviterUid, storeId);

    if (isStoreUser) {
      const existingUser = await this.storeUsersRepository.exist({
        relations: { user: { auth: true }, store: true },
        where: {
          user: { auth: { email: email } },
          store: { id: storeId },
        },
      });

      if (existingUser) {
        this.logger.error(
          {
            function: 'sendInvitationEmail',
            input: { inviterUid: inviterUid, storeId: storeId, email: email },
          },
          `User with that email: '${email}', is already a store user to this store.`
        );

        throw new HttpException(
          `User with that email: '${email}', is already a store user to this store.`,
          HttpStatus.CONFLICT
        );
      }

      const invitationToStoreToken = await this.jwtService.signAsync(
        {
          inviter: inviterUid,
          userEmail: email,
          store: storeId,
        },
        { secret: process.env.INVITATION_TO_STORE_SECRET, expiresIn: process.env.INVITATION_TO_STORE_EXPIRATION }
      );

      await this.emailService.actionMail(email, invitationToStoreToken, 'invitationToStore').catch((error) => {
        this.logger.error(
          {
            function: 'sendInvitationEmail',
            input: { inviterUid: inviterUid, storeId: storeId, email: email },
            error: error,
          },
          `Failed to send invitation to store email.`
        );

        throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
      });

      return true;
    } else {
      const error = new HttpException(`You are not an active store user to the store.`, HttpStatus.BAD_REQUEST);

      this.logger.error(
        {
          function: this.sendInvitationEmail.name,
          input: { inviterUid: inviterUid, storeId: storeId, email: email },
          error: error,
        },
        `The user with id: '${inviterUid}' is not an active store user to the store with id: ${storeId}.`
      );

      throw error;
    }
  }

  async findAllByStore(storeUserId: string, storeNames: string[] = []) {
    let isStoreUser = true;

    if (storeNames.length < 1) {
      const userStores = await this.storeUsersRepository.find({
        where: {
          user: { id: storeUserId },
        },
      });

      if (userStores.length < 1) {
        return [];
      }

      storeNames = userStores.map((storeUser) => storeUser.store?.name ?? null);
    } else {
      isStoreUser = await this.storeUsersRepository.exist({
        relations: { user: true },
        where: { store: { name: Any(storeNames) }, user: { id: storeUserId } },
      });
    }

    if (isStoreUser) {
      const storeUsers = await this.storeUsersRepository.find({
        relations: { user: { auth: true }, inviter: true },
        where: { store: { name: Any(storeNames) }, inviter: Not(IsNull()), user: { id: Not(storeUserId) } },
      });

      return storeUsers.map((storeUser) => new SerializedStoreUser(storeUser));
    }

    const error = new HttpException(
      `You are not a user to a store to all these stores: ${storeNames.toString()}.`,
      HttpStatus.BAD_REQUEST
    );

    this.logger.error(
      { function: this.findAllByStore.name, input: { storeUserId: storeUserId, storeNames: storeNames }, error: error },
      `The user with id: '${storeUserId}' is not a user to all these stores: ${storeNames.toString()}.`
    );

    throw error;
  }

  async existByEmail(userEmail: string, storeId: string) {
    return await this.storeUsersRepository.exist({
      relations: { user: { auth: true }, store: true },
      where: { user: { auth: { email: userEmail } }, store: { id: storeId } },
    });
  }

  async findByUserId(uid: string) {
    const isStoreUser = await this.isActiveByUserId(uid);

    if (isStoreUser) {
      return await this.storeUsersRepository.find({
        relations: { user: true, store: true },
        where: { user: { id: uid }, enabled: true },
      });
    } else {
      const error = new HttpException(`You are not an active store user.`, HttpStatus.UNAUTHORIZED);

      this.logger.error(
        {
          function: this.findByUserId.name,
          input: { uid: uid },
          error: error,
        },
        `The user with id: '${uid}' is not an active store user.".`
      );

      throw error;
    }
  }

  async isActiveByUserId(uid: string) {
    return await this.storeUsersRepository.exist({
      relations: { user: true, store: true },
      where: { user: { id: uid }, enabled: true },
    });
  }

  async isActiveByUserIdAndStoreName(uid: string, store: string) {
    return await this.storeUsersRepository.exist({
      relations: { user: true, store: true },
      where: { user: { id: uid }, store: { name: store }, enabled: true },
    });
  }

  async isActiveByUserIdAndStoreId(uid: string, store: string) {
    return await this.storeUsersRepository.exist({
      relations: { user: true, store: true },
      where: { user: { id: uid }, store: { id: store }, enabled: true },
    });
  }

  async toggle(storeUserId: string, toggleUserDto: ToggleUserDto, enabled: boolean) {
    const { storeName, users } = toggleUserDto;

    const isStoreUser = await this.isActiveByUserIdAndStoreName(storeUserId, storeName);

    if (isStoreUser) {
      await this.storeUsersRepository
        .update({ user: { id: In(users) }, store: { name: storeName } }, { enabled: enabled })
        .catch((error) => {
          this.logger.error(
            {
              error: error,
              input: { storeUserId: storeUserId, toggleUserDto: toggleUserDto, enabled: enabled },
            },
            `Failed to toggle store users.`
          );

          throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
        });

      return true;
    }

    const error = new HttpException(`You are not an active store user to this store.`, HttpStatus.UNAUTHORIZED);

    this.logger.error(
      {
        function: this.toggle.name,
        input: { storeUserId: storeUserId, toggleUserDto: toggleUserDto, enabled: enabled },
        error: error,
      },
      `The user with id: '${storeUserId}' is not an active store user to the store with name:${storeName}.".`
    );

    throw error;
  }
}
