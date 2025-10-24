import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

interface CreateUserInput {
  email: string;
  passwordHash: string;
  displayName: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>
  ) {}

  async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }

  async create(input: CreateUserInput): Promise<UserEntity> {
    const exists = await this.findByEmail(input.email);
    if (exists) {
      throw new ConflictException('Email already registered');
    }

    const user = this.repository.create({
      email: input.email,
      passwordHash: input.passwordHash,
      displayName: input.displayName
    });
    return this.repository.save(user);
  }
}
