import { IsEmail, IsNotEmpty } from 'class-validator';
import { Matches as MatchField } from 'class-validator-matches';

export class ResetEmailDto {
  @IsEmail()
  @IsNotEmpty()
  newEmail: string;

  @IsEmail()
  @IsNotEmpty()
  @MatchField('newEmail', { message: 'Confirm new email does not match' })
  confirmNewEmail: string;

  @IsEmail()
  @IsNotEmpty()
  subscription: string;
}
