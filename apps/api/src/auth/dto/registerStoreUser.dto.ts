import { IsEmail, IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class RegisterStoreUserDto {
  @IsEmail()
  @IsNotEmpty()
  userEmail: string;

  @IsUUID()
  @IsNotEmpty()
  store: string;

  @IsUUID()
  @IsNotEmpty()
  inviter: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).{8,}$/, {
    message: 'password is too weak',
  })
  password: string;
}
