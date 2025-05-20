import { ClassSerializerInterceptor, Controller, Get, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import type { AccountInfo } from '../../auth/types';
import { CategoryService } from '../service/category.service';
import { ApiFindAllManagedByUser } from '../swagger';

@ApiTags('Categories')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(AuthGuard('accessToken'))
  @ApiFindAllManagedByUser()
  async findManagedCategories(@Req() req: Request) {
    const { uid } = <AccountInfo>req.user;

    try {
      return await this.categoryService.findManagedCategories(uid);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }
}
