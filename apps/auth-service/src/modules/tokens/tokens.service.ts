import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { IsNull, Repository } from 'typeorm';
import { RefreshTokenEntity } from './refresh-token.entity';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly repository: Repository<RefreshTokenEntity>
  ) {}

  private async hashToken(raw: string): Promise<string> {
    return argon2.hash(raw, { type: argon2.argon2id });
  }

  async issue(user: UserEntity, token: string, expiresAt: Date): Promise<void> {
    const tokenHash = await this.hashToken(token);
    const entity = this.repository.create({
      tokenHash,
      expiresAt,
      user
    });
    await this.repository.save(entity);
  }

  async revoke(userId: string, token: string): Promise<void> {
    const records = await this.repository.find({
      where: { user: { id: userId } },
      relations: { user: true }
    });
    for (const record of records) {
      const matches = await argon2.verify(record.tokenHash, token);
      if (matches) {
        await this.repository.update(record.id, { revokedAt: new Date() });
      }
    }
  }

  async validate(userId: string, token: string): Promise<boolean> {
    const records = await this.repository.find({
      where: { user: { id: userId }, revokedAt: IsNull() },
      relations: { user: true }
    });
    for (const record of records) {
      const matches = await argon2.verify(record.tokenHash, token);
      if (matches && record.expiresAt.getTime() > Date.now()) {
        return true;
      }
    }
    return false;
  }
}
