import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { LoginDto } from 'src/Auth/dto/login.dto';

@Injectable()
export class FindUserByEmailProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(email: string) {
    const userToLog = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .addSelect('user.password') //  traz a senha que está sendo escondido quando cria o user. Olhar a entidade user
      .getOne();

    console.log('NÃO ESQUECER DE CONFIGURAR O ENV');

    if (!userToLog) {
      throw new NotFoundException(
        `Nenhum usuário encontrado com o email: ${email}`,
      );
    }

    return userToLog;
  }
}
