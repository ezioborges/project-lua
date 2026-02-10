import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/users.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { UserValidator } from '../service/user-validator.service';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly userValidator: UserValidator,
  ) {}

  public async execute(createUserDto: CreateUserDto) {
    const { email, cpf, password } = createUserDto;

    const cleanCpf = await this.userValidator.checkEmailAndCpf(email, cpf);

    // tranforma a senha em hash o 10 representa o salt (padrão mais seguro)
    const hashedPassword = await hash(password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      cpf: cleanCpf || createUserDto.cpf, // a exclamação faz com que eu saiba que tem uma verificação acontecenedo
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }
}
