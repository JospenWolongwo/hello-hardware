import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendInvitationDto {
  @ApiProperty({
    description: 'User email address',
    example: 'joeharry@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Name of the store',
    example: 'carrefour',
  })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.trim().toLocaleLowerCase())
  store: string;
}
