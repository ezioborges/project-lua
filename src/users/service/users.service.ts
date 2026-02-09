import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entitites/users.entity'; // Verifique o caminho
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    // AQUI ESTÁ A MÁGICA:
    // O @InjectRepository cria a conexão e te entrega o repositório pronto
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }
}
