import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './service/users.service';
import { User } from './entities/users.entity';
import { CreateUserProvider } from './service/providers/create-users.provider';
import { FindAllUsersProvider } from './service/providers/find-all-users.provider';
import { GetUserById } from './service/providers/get-user-by-id.provider';

@Module({
  // O forFeature cria o "UserRepository" internamente
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersService,
    CreateUserProvider,
    FindAllUsersProvider,
    GetUserById,
  ],
  exports: [UsersService, CreateUserProvider, FindAllUsersProvider],
})
export class UsersModule {}
