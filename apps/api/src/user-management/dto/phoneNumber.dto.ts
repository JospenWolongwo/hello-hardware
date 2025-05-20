import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsMobilePhone, IsNotEmpty, MinLength } from 'class-validator';

export class PhoneNumberDto {
  @ApiProperty({ example: '690012345' })
  @IsMobilePhone()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ example: 'mobile' })
  @IsIn(['mobile', 'landLine'])
  @IsNotEmpty()
  type: 'mobile' | 'landLine';

  @ApiProperty({ example: '237' })
  @MinLength(1)
  countryCode: string;
}
