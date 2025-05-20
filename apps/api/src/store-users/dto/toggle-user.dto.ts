import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ToggleUserDto {
  @ApiProperty({
    example: [
      'e27d8570-06bd-11ee-be56-0242ac120002',

      'e27d8980-06bd-11ee-be56-0242ac120002',

      'e27d8d5e-06bd-11ee-be56-0242ac120002',

      'e27d8e9e-06bd-11ee-be56-0242ac120002',
    ],
  })
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  @Transform(({ value }) => value.map((v: string) => v.trim().toLocaleLowerCase()))
  users: string[];

  @ApiProperty({
    example: 'Saker',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  storeName: string;
}
