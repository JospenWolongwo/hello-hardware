import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserSubscriptionDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
