import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserValidator {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async checkEmailAndCpf(
    email?: string,
    cpf?: string,
    role?: string,
    userId?: string,
  ) {
    let cleanCpf: string | undefined;
    if (email) {
      const emailExists = await this.userRepository.findOne({
        where: { email },
      });

      if (emailExists && emailExists.id !== userId) {
        throw new ConflictException('Email já está cadastrado');
      }
    }

    if (cpf) {
      const cleanCpf = cpf.replace(/\D/g, '');

      const cpfExists = await this.userRepository.findOne({
        where: { cpf: cleanCpf },
      });

      if (cpfExists && cpfExists.id !== userId) {
        throw new ConflictException('O CPF já está cadastrado.');
      }
      return cleanCpf;
    }
    return null;
  }
}
