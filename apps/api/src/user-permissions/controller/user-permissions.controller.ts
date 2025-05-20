import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Delete } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequirePermissions } from '../../common/decorators/requirePermissions.decorator';
import { PermissionsGuard } from '../../common/guards/permission.guard';
import { ValidateNotEmptyPipe } from '../../common/utils/validateNotEmpty.pipe';
import { UserService } from '../../user-management/service/user.service';
import { CreateUserPermissionDto } from '../dto/create-user-permission.dto';
import { UserPermissionsService } from '../service/user-permissions.service';
import { ApiAdd, ApiRevoke } from '../swagger';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
@UseInterceptors(ClassSerializerInterceptor)
export class UserPermissionsController {
  constructor(
    private readonly userPermissionsService: UserPermissionsService,
    private readonly userService: UserService
  ) {}

  @Post(':id')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['AddPermissions'])
  @ApiAdd()
  async addPermissions(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidateNotEmptyPipe()) createUserPermissionDto: CreateUserPermissionDto
  ) {
    try {
      const userToUpdate = await this.userService.findById(id);

      if (userToUpdate.id) {
        return await this.userPermissionsService.addPermissions(id, createUserPermissionDto);
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @UseGuards(AuthGuard('accessToken'))
  @RequirePermissions(['RevokePermissions'])
  @ApiRevoke()
  async revokePermissions(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidateNotEmptyPipe()) revokePermissionDto: CreateUserPermissionDto
  ) {
    try {
      const userToUpdate = await this.userService.findById(id);

      if (userToUpdate.id) {
        return await this.userPermissionsService.revokePermissions(id, revokePermissionDto);
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }
}
