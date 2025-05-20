import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { PermissionService } from '../service/permission.service';
import { ApiCreate } from '../swagger/create.swagger';
import { ApiFindAll } from '../swagger/find-all.swagger';
import { ApiFindOne } from '../swagger/find-one.swagger';
import { ApiUpdate } from '../swagger/update.swagger';

@ApiTags('Permissions')
@ApiBearerAuth()
@Controller('permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('')
  @ApiCreate()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    try {
      return await this.permissionService.create(createPermissionDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Get('')
  @ApiFindAll()
  async findAll() {
    try {
      return await this.permissionService.findAll();
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  @Get(':id')
  @ApiFindOne()
  async findOne(@Param('id') id: string) {
    try {
      return await this.permissionService.findById(id);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @Patch(':id')
  @ApiUpdate()
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePermissionDto: Partial<CreatePermissionDto>
  ) {
    try {
      return await this.permissionService.update(id, updatePermissionDto);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }
}
