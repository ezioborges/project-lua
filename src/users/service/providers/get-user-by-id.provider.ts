import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetUserById {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(userId: string) {
    const user = this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error(`Nenhum usuário encontrado com o ID: ${userId}`);
    }

    return user;
  }
}
