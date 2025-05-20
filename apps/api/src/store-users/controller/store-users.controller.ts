import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import type { AccountInfo } from '../../auth/types';
import { RequirePermissions } from '../../common/decorators/requirePermissions.decorator';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { FindByStoreDto } from '../dto/find-by-store.dto';
import { ToggleUserDto } from '../dto/toggle-user.dto';
import { StoreUsersService } from '../service/store-users.service';
import { ApiActivate, ApiDeactivate, ApiFindAllByStore } from '../swagger';

@ApiTags('Store-users')
@ApiBearerAuth()
@Controller('store-users')
@UseInterceptors(ClassSerializerInterceptor)
export class StoreUsersController {
  constructor(private readonly storeUsersService: StoreUsersService) {}

  @Get('')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewStoreUsers'])
  @ApiFindAllByStore()
  async findAllByStore(@Req() req: Request, @Body() findByStoreDto: FindByStoreDto) {
    try {
      const { uid } = <AccountInfo>req.user;

      if (findByStoreDto?.store) {
        return await this.storeUsersService.findAllByStore(uid, findByStoreDto.store);
      } else {
        return await this.storeUsersService.findAllByStore(uid);
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw new InternalServerErrorException('Error occurred while getting store users.');
    }
  }

  @Patch('/enable')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ActivateStoreUser'])
  @ApiActivate()
  async enableStoreUser(@Req() req: Request, @Body() toggleUserDto: ToggleUserDto) {
    try {
      const { uid } = <AccountInfo>req.user;

      await this.storeUsersService.toggle(uid, toggleUserDto, true);

      return { message: 'Store user(s) activated successfully', statusCode: HttpStatus.OK };
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw new InternalServerErrorException('Error occurred while activating store users.');
    }
  }

  @Patch('/disable')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['DeactivateStoreUser'])
  @ApiDeactivate()
  async disableStoreUser(@Req() req: Request, @Body() toggleUserDto: ToggleUserDto) {
    try {
      const { uid } = <AccountInfo>req.user;

      await this.storeUsersService.toggle(uid, toggleUserDto, false);

      return { message: 'Store user(s) deactivated successfully', statusCode: HttpStatus.OK };
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw new InternalServerErrorException('Error occurred while deactivating store users.');
    }
  }
}
