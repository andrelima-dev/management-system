import { IsJWT, IsString } from 'class-validator';

export class LogoutAuthDto {
  @IsString()
  userId!: string;

  @IsJWT()
  refreshToken!: string;
}
