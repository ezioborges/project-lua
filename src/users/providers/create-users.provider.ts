import { Repository } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/users.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';

@Injectable()
export class CreateUserProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(createUserDto: CreateUserDto) {
    const { email, cpf, password } = createUserDto;

    // caso tenha '-' ou '.' é apagado para deixar apenas os números
    const cleanCpf = cpf.replace(/\D/g, '');

    // verifica se o email já existe
    const emailExists = await this.userRepository.findOne({ where: { email } });

    // lança erro caso o email já exista
    if (emailExists)
      throw new ConflictException('Email já foi está cadastrado!');

    // verifica se o email já existe; ATENÇÃO: no cpf eu passei o cleanCpf como valor de comparação.
    const cpfExists = await this.userRepository.findOne({
      where: { cpf: cleanCpf },
    });

    // lança erro se o CPF já existe
    if (cpfExists) throw new ConflictException('O CPF já está cadastrado.');

    // tranforma a senha em hash o 10 representa o salt (padrão mais seguro)
    const hashedPassword = await hash(password, 10);

    const newUser = this.userRepository.create({
      ...createUserDto,
      cpf: cleanCpf,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }
}
