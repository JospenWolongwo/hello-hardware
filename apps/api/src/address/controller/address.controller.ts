import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import type { AccountInfo } from '../../auth/types';
import { ValidateNotEmptyPipe } from '../../common/utils/validateNotEmpty.pipe';
import { UserService } from '../../user-management/service/user.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';
import { AddressService } from '../service/address.service';
import { ApiCreate, ApiFindAll, ApiFindOne, ApiUpdate } from '../swagger/index';

@ApiTags('Addresses')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService, private readonly userService: UserService) {}

  @UseGuards(AuthGuard('accessToken'))
  @Get()
  @ApiFindAll()
  async findAll(@Req() req: Request) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.addressService.findAllByUserId(uid);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @UseGuards(AuthGuard('accessToken'))
  @Get(':id')
  @ApiFindOne()
  async findOne(@Req() req: Request, @Param('id', new ParseUUIDPipe()) id: string) {
    try {
      const { uid } = <AccountInfo>req.user;

      return await this.addressService.findOneByUserId(id, uid);
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @UseGuards(AuthGuard('accessToken'))
  @ApiCreate()
  @Post('')
  async createAddress(@Req() req: Request, @Body() createAddressDto: CreateAddressDto) {
    try {
      const { uid } = <AccountInfo>req.user;
      const userExist = await this.userService.exist(uid);

      if (userExist) {
        return await this.addressService.create(uid, createAddressDto);
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }

  @UseGuards(AuthGuard('accessToken'))
  @Patch('/:id')
  @ApiUpdate()
  async updateAddress(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body(new ValidateNotEmptyPipe()) updateAddressDto: UpdateAddressDto
  ) {
    try {
      const { uid } = <AccountInfo>req.user;
      const user = await this.userService.findById(uid);

      if (user) {
        return await this.addressService.update(uid, id, updateAddressDto);
      }
    } catch (error) {
      if (error.status) {
        throw error;
      }

      throw InternalServerErrorException;
    }
  }
}
