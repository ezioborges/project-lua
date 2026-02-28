import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/users.entity';

@Injectable()
export class RestoreUserProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(userId: string) {
    try {
      return await this.userRepository.restore(userId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro em restaurar o usuário: ${error.message}`,
      );
    }
  }
}
