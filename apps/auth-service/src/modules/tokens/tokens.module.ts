import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { TokensService } from './tokens.service';

@Module({
  imports: [TypeOrmModule.forFeature([RefreshTokenEntity])],
  providers: [TokensService],
  exports: [TokensService]
})
export class TokensModule {}
