import { IsEmail, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;
}
