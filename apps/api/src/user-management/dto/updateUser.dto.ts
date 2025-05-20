import { ApiPropertyOptional } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { Gender } from '../entities/user.entity';
import { PhoneNumberDto } from './phoneNumber.dto';

export class UpdateUserDto {
  @ApiPropertyOptional({
    example: 'John',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  firstName: string;

  @ApiPropertyOptional({
    example: 'Nsame',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  lastName: string;

  @ApiPropertyOptional({
    example: 'male',
  })
  @IsOptional()
  @Matches(/(?:male|female|other)$/)
  @IsNotEmpty()
  gender: Gender;

  @ApiPropertyOptional({
    example: '656351328',
  })
  @ApiPropertyOptional({
    type: PhoneNumberDto,
  })
  @IsOptional()
  phoneNumber: PhoneNumberDto;

  @ApiPropertyOptional({
    example: 'profile.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  profilePicture: string;
}
