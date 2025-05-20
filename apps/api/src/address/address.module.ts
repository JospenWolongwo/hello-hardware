import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user-management/user.module';
import { AddressController } from './controller/address.controller';
import { Address } from './entity/address.entity';
import { AddressService } from './service/address.service';

@Module({
  imports: [TypeOrmModule.forFeature([Address]), UserModule],
  providers: [AddressService],
  controllers: [AddressController],
  exports: [AddressService],
})
export class AddressModule {}
