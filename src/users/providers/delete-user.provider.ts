import { Injectable, NotFoundException } from '@nestjs/common';
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
    const user = await this.userRepositpry.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado ou já removido!');
    }

    return await this.userRepositpry.softDelete(userId);
  }
}
