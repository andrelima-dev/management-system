import { IsJWT, IsString } from 'class-validator';

export class RefreshAuthDto {
  @IsJWT()
  refreshToken!: string;

  @IsString()
  userId!: string;
}
