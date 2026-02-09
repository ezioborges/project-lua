import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserProvider } from './providers/create-users.provider';
import { FindAllUsersProvider } from './providers/find-all-users.provider';
import { GetUserById } from './providers/get-user-by-id.provider';

@Injectable()
export class UsersService {
  constructor(
    // AQUI ESTÁ A MÁGICA:
    // O @InjectRepository cria a conexão e te entrega o repositório pronto
    private readonly createUserProvider: CreateUserProvider,
    private readonly findAllUsersProvider: FindAllUsersProvider,
    private readonly getUserById: GetUserById,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.createUserProvider.execute(createUserDto);
  }

  findAll() {
    return this.findAllUsersProvider.execute();
  }

  findById(id: string) {
    return this.getUserById.execute(id);
  }
}
