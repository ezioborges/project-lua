import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserProvider } from '../providers/create-users.provider';
import { FindAllUsersProvider } from '../providers/find-all-users.provider';
import { GetUserByIdProvider } from '../providers/get-user-by-id.provider';
import { UpdateUserProvider } from '../providers/update-user.provider';
import { UpdateUserDto } from '../dto/update-user.dto';
import { DeleteUserProvider } from '../providers/delete-user.provider';
import { RestoreUserProvider } from '../providers/restore-user.provider';

@Injectable()
export class UsersService {
  constructor(
    // AQUI ESTÁ A MÁGICA:
    // O @InjectRepository cria a conexão e te entrega o repositório pronto
    private readonly createUserProvider: CreateUserProvider,
    private readonly findAllUsersProvider: FindAllUsersProvider,
    private readonly getUserByIdProvider: GetUserByIdProvider,
    private readonly updateUserProvider: UpdateUserProvider,
    private readonly deleteUserProvider: DeleteUserProvider,
    private readonly restoreUserProvider: RestoreUserProvider,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.createUserProvider.execute(createUserDto);
  }

  findAll(page: number, limit: number) {
    return this.findAllUsersProvider.execute(page, limit);
  }

  findById(id: string) {
    return this.getUserByIdProvider.execute(id);
  }

  userUpdate(id: string, updateUserDto: UpdateUserDto) {
    return this.updateUserProvider.execute(id, updateUserDto);
  }

  deleteUser(userId: string) {
    return this.deleteUserProvider.execute(userId);
  }

  restoreUser(userId: string) {
    return this.restoreUserProvider.execute(userId);
  }
}
