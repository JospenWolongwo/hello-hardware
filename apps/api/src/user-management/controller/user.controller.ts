import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import type { AccountInfo } from '../../auth/types';
import { RequirePermissions } from '../../common/decorators/requirePermissions.decorator';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { ValidateNotEmptyPipe } from '../../common/utils/validateNotEmpty.pipe';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { UserService } from '../service/user.service';
import { ApiFindAll } from '../swagger/find-all.swagger';
import { ApiFindOne } from '../swagger/find-one.swagger';
import { ApiGetFavouriteProducts } from '../swagger/get-favourite-products.swagger';
import { ApiGetMe } from '../swagger/get-me.swagger';
import { ApiGetMyFavouriteProducts } from '../swagger/get-my-favourite-products.swagger';
import { ApiUpdate } from '../swagger/update.swagger';
import { Express } from 'express';

@ApiTags('Users')
@ApiBearerAuth()
@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ReadUsers'])
  @ApiFindAll()
  async findAll() {
    try {
      return await this.userService.findAll();
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get('users/me')
  @UseGuards(AuthGuard('accessToken'))
  @ApiGetMe()
  async getMe(@Req() req: Request) {
    const { uid } = <AccountInfo>req.user;
    try {
      return await this.userService.findById(uid);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get('users/:id')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ReadUsers'])
  @ApiFindOne()
  async findOne(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.userService.findById(id);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get('users/:id/favourite-products')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ReadUsers'])
  @ApiGetFavouriteProducts()
  async getUserFavouriteProducts(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.userService.getFavouriteProducts(id);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get('users/me/favourite-products')
  @UseGuards(AuthGuard('accessToken'))
  @ApiGetMyFavouriteProducts()
  async getMyFavouriteProducts(@Req() req: Request) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.userService.getFavouriteProducts(uid);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Patch('users/me')
  @UseGuards(AuthGuard('accessToken'))
  @ApiGetFavouriteProducts()
  async getFavouriteProducts(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const { uid } = <AccountInfo>req.user;
      if (uid === id) {
        return await this.userService.getFavouriteProducts(uid);
      }
      throw new HttpException('You cannot access this user', HttpStatus.UNAUTHORIZED);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  // eslint-disable-next-line max-params
  @Patch('users/:id')
  @UseGuards(AuthGuard('accessToken'))
  @ApiUpdate()
  @UseInterceptors(FileInterceptor('profilePicture'))
  async update(
    @Req() req: Request,
    @Body(new ValidateNotEmptyPipe()) updateUserDto: UpdateUserDto,
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() profilePicture?: Express.Multer['File']
  ) {
    try {
      const { uid } = <AccountInfo>req.user;
      if (uid === id) {
        return await this.userService.update(uid, updateUserDto, profilePicture);
      }
      throw new HttpException('You cannot access this user', HttpStatus.UNAUTHORIZED);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
