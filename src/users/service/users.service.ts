import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserProvider } from './create-users.provider';
import { FindAllUsersProvider } from './find-all-users.provider';

@Injectable()
export class UsersService {
  constructor(
    // AQUI ESTÁ A MÁGICA:
    // O @InjectRepository cria a conexão e te entrega o repositório pronto
    private readonly createUserProvider: CreateUserProvider,
    private readonly findAllUsersProvider: FindAllUsersProvider,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.createUserProvider.execute(createUserDto);
  }

  findAll() {
    return this.findAllUsersProvider.execute();
  }
}
