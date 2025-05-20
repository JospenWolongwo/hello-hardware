import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { CreateAddressDto } from '../dto/create-address.dto';
import type { UpdateAddressDto } from '../dto/update-address.dto';
import { Address } from '../entity/address.entity';
import { SerializedAddressEntity } from '../types/serializedAddressEntity.class';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>
  ) {}

  private readonly logger = new Logger(AddressService.name);

  async create(uid: string, createAddressDto: CreateAddressDto) {
    const newAddress = new Address();
    newAddress.country = createAddressDto.country;
    newAddress.city = createAddressDto.city;
    newAddress.street = createAddressDto.street;
    newAddress.zipCode = createAddressDto.zipCode;
    newAddress.additionalDescription = createAddressDto.additionalDescription;

    newAddress.owner = uid;

    const createdAddress = await this.addressRepository.save(newAddress);

    return new SerializedAddressEntity(createdAddress);
  }

  async findAllByUserId(uid: string) {
    const addresses = await this.addressRepository.find({
      where: {
        owner: uid,
      },
    });

    if (Array.isArray(addresses)) {
      if (addresses.length > 0) {
        const serializedAddresses = addresses.map((address) => new SerializedAddressEntity(address));

        return serializedAddresses;
      }

      return addresses;
    }

    const error = new HttpException('Internal error', HttpStatus.INTERNAL_SERVER_ERROR);
    this.logger.error(`${JSON.stringify(error)}`);
    throw error;
  }

  async findOne(id: string) {
    const address = await this.addressRepository.findOne({
      where: {
        id: id,
      },
    });

    if (address) {
      return new SerializedAddressEntity(address);
    } else {
      return null;
    }
  }

  async findOneByUserId(id: string, uid: string) {
    const address = await this.addressRepository.findOne({
      where: {
        id: id,
        owner: uid,
      },
    });

    if (address) {
      return new SerializedAddressEntity(address);
    }

    const error = new HttpException('Address was not found.', HttpStatus.NOT_FOUND);

    this.logger.error(`Failed to find one address with user id: ${uid} and address id ${id}`);

    throw error;
  }

  async update(uid: string, id: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.findOneByUserId(id, uid);
    if (address) {
      await this.addressRepository.update(id, updateAddressDto).catch((error) => {
        this.logger.error(
          `Failed to update the user address with the uid ${uid} and address id ${id} \n
            data : ${JSON.stringify(error)}`
        );
        throw new HttpException('Internal Error', HttpStatus.INTERNAL_SERVER_ERROR);
      });

      return await this.findOneByUserId(id, uid);
    }
  }
}
