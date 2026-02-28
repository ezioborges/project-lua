import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GetUserByIdProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(userId: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });

      if (!user) {
        throw new NotFoundException(
          `Nenhum usuário encontrado com o ID: ${userId}`,
        );
      }

      return user;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao buscar usuário pelo ID: ${error.message}`,
      );
    }
  }
}
