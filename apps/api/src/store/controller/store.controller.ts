/* eslint-disable max-params */
/* eslint-disable max-lines */
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  ParseUUIDPipe,
  Post,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { Delete, Get, Param, Patch, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import type { AccountInfo } from '../../auth/types';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import {
  ApiCreateCategory,
  ApiCreateSubCategory,
  ApiDeleteCategory,
  ApiFindAllCategories,
  ApiFindOneCategory,
  ApiUpdateCategory,
} from '../../category/swagger';
import { RequirePermissions } from '../../common/decorators/requirePermissions.decorator';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { ValidateNotEmptyPipe } from '../../common/utils/validateNotEmpty.pipe';
import { ApiFindAllInStore, ApiFindAllInStoreByCategory, ApiFindOneInStore } from '../../product/swagger';
import { UserService } from '../../user-management/service/user.service';
import { CreateStoreDto } from '../dto/create-store.dto';
import { SendInvitationDto } from '../dto/sendInvitation.dto';
import { StoreService } from '../service/store.service';
import {
  ApiCreate,
  ApiCreateBranch,
  ApiFindAll,
  ApiFindBranches,
  ApiFindOne,
  ApiInviteUser,
  ApiUpdate,
} from '../swagger/index';

@ApiTags('Stores')
@ApiBearerAuth()
@Controller('stores')
@UseInterceptors(ClassSerializerInterceptor)
export class StoreController {
  constructor(private readonly storeService: StoreService, private readonly userService: UserService) {}

  @UseGuards(AuthGuard('accessToken'))
  @Post('')
  @ApiCreate()
  async create(@Req() req: Request, @Body() createStoreDto: CreateStoreDto) {
    const accountInfo = <AccountInfo>req.user;

    try {
      const user = await this.userService.findById(accountInfo.uid);

      return await this.storeService.create(user, createStoreDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Post(':id/branches')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['CreateBranch'])
  @ApiCreateBranch()
  async createBranch(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createStoreDto: CreateStoreDto
  ) {
    const accountInfo = <AccountInfo>req.user;

    try {
      const user = await this.userService.findById(accountInfo.uid);

      return await this.storeService.createBranch(id, user, createStoreDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Post(':id/categories')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['CreateCategory'])
  @ApiCreateCategory()
  async addNewCategory(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    const accountInfo = <AccountInfo>req.user;

    try {
      const user = await this.userService.findById(accountInfo.uid);

      return await this.storeService.addNewCategory(user.id, id, createCategoryDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  // eslint-disable-next-line max-params
  @Post(':id/categories/:categoryId/sub-categories')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['CreateCategory', 'CreateSubCategory'])
  @ApiCreateSubCategory()
  async addNewSubCategory(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Body() createCategoryDto: CreateCategoryDto
  ) {
    const accountInfo = <AccountInfo>req.user;

    try {
      const user = await this.userService.findById(accountInfo.uid);

      return await this.storeService.addNewSubCategory(user.id, id, categoryId, createCategoryDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @HttpCode(HttpStatus.ACCEPTED)
  @Post('invite-user')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['InviteUserToStore'])
  @ApiInviteUser()
  async sendInvitationToStoreEmail(@Req() req: Request, @Body() sendInvitationDto: SendInvitationDto) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.storeService.inviteUserToStore(uid, sendInvitationDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw new InternalServerErrorException('Error occur on sending mail.');
    }
  }

  @Get('')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewStore'])
  @ApiFindAll()
  async findAll(@Req() req: Request) {
    try {
      const accountInfo = <AccountInfo>req.user;

      const user = await this.userService.findById(accountInfo.uid);

      if (user) {
        return await this.storeService.findAll(accountInfo.uid);
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewStore'])
  @ApiFindOne()
  async findOne(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.storeService.findOne(uid, id);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get(':id/branches')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['ViewBranch'])
  @ApiFindBranches()
  async findOneWithBranches(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.storeService.findOneWithBranches(uid, id);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get(':id/categories')
  @ApiFindAllCategories()
  async findAllCategories(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return await this.storeService.getAllCategories(id);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get(':id/categories/:categoryId')
  @ApiFindOneCategory()
  async findOneCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string
  ) {
    try {
      return await this.storeService.getOneCategory(id, categoryId);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get(':id/products')
  @ApiFindAllInStore()
  async getStoreProducts(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.storeService.getStoreProducts(id);
  }

  @Get(':id/products/:pid')
  @ApiFindOneInStore()
  async getOneStoreProduct(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('pid', new ParseUUIDPipe()) pid: string
  ) {
    try {
      return await this.storeService.getOneStoreProduct(id, pid);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get(':id/categories/:categoryId/products')
  @ApiFindAllInStoreByCategory()
  async getStoreProductsByCategory(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string
  ) {
    try {
      return await this.storeService.getOneStoreOneCategoryProducts(id, categoryId);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['EditStore'])
  @ApiUpdate()
  async update(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidateNotEmptyPipe()) updateStoreDto: Partial<CreateStoreDto>
  ) {
    try {
      const accountInfo = <AccountInfo>req.user;

      const user = await this.userService.findById(accountInfo.uid);

      return await this.storeService.update(user, id, updateStoreDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Patch(':id/categories/:categoryId')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['EditCategory'])
  @ApiUpdateCategory()
  async updateOneCategory(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string,
    @Body(new ValidateNotEmptyPipe()) updateCategoryDto: Partial<CreateCategoryDto>
  ) {
    const { uid } = <AccountInfo>req.user;

    try {
      return await this.storeService.updateCategory(uid, id, categoryId, updateCategoryDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Delete(':id/categories/:categoryId')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['DeleteCategory'])
  @ApiDeleteCategory()
  async deleteOneCategory(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Param('categoryId', new ParseUUIDPipe()) categoryId: string
  ) {
    const { uid } = <AccountInfo>req.user;

    try {
      return await this.storeService.deleteOneCategory(uid, id, categoryId);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }
}
