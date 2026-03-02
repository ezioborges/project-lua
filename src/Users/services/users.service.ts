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

  async findAll(page: number, limit: number) {
    return await this.findAllUsersProvider.execute(page, limit);
  }

  async findById(id: string) {
    return await this.getUserByIdProvider.execute(id);
  }

  async userUpdate(id: string, updateUserDto: UpdateUserDto) {
    return await this.updateUserProvider.execute(id, updateUserDto);
  }

  async deleteUser(userId: string) {
    return await this.deleteUserProvider.execute(userId);
  }

  async restoreUser(userId: string) {
    return await this.restoreUserProvider.execute(userId);
  }
}
