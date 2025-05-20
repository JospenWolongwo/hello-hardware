import { IsJWT, IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { Matches as MatchField } from 'class-validator-matches';

export class SignUpStoreUserDto {
  @IsJWT()
  @IsNotEmpty()
  token: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).{8,}$/, {
    message: 'password is too weak',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MatchField('password', { message: 'password confirm does not match' })
  passwordConfirm: string;
}
