import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteUserProvider {
  constructor(
    @InjectRepository(User)
    private userRepositpry: Repository<User>,
  ) {}

  public async execute(userId: string) {
    return await this.userRepositpry.softDelete(userId);
  }
}
