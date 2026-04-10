import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserValidator } from '../services/user-validator.service';
import { hash } from 'bcrypt';

@Injectable()
export class UpdateUserProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userValidator: UserValidator,
  ) {}

  public async execute(userId: string, updateUserDto: UpdateUserDto) {
    try {
      let { email, cpf, password } = updateUserDto;
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user)
        throw new NotFoundException(
          `Usuário não encontrado com o ID: ${userId}`,
        );

      const cleanCpf = await this.userValidator.checkEmailAndCpf(
        email,
        cpf,
        userId,
      );

      if (password) {
        password = await hash(password, 10);
      }

      const userToUpdate = this.userRepository.merge(user, {
        ...updateUserDto,
        cpf: cleanCpf || updateUserDto.cpf,
      });

      return await this.userRepository.save(userToUpdate);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Erro ao atualizar o usuário: ${error.message}`,
      );
    }
  }
}
