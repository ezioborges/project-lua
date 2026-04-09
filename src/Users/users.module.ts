import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { User } from './entities/users.entity';
import { CreateUserProvider } from './providers/create-users.provider';
import { FindAllUsersProvider } from './providers/find-all-users.provider';
import { GetUserByIdProvider } from './providers/get-user-by-id.provider';
import { UpdateUserProvider } from './providers/update-user.provider';
import { DeleteUserProvider } from './providers/delete-user.provider';
import { RestoreUserProvider } from './providers/restore-user.provider';
import { UserValidator } from './services/user-validator.service';
import { FindUserByEmailProvider } from './providers/find-user-by-email';

@Module({
  // O forFeature cria o "UserRepository" internamente
  imports: [TypeOrmModule.forFeature([User]), JwtModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserValidator,
    CreateUserProvider,
    FindAllUsersProvider,
    GetUserByIdProvider,
    UpdateUserProvider,
    DeleteUserProvider,
    RestoreUserProvider,
    FindUserByEmailProvider,
  ],
  exports: [
    UsersService,
    UserValidator,
    CreateUserProvider,
    FindAllUsersProvider,
    GetUserByIdProvider,
    UpdateUserProvider,
    DeleteUserProvider,
    RestoreUserProvider,
    FindUserByEmailProvider,
  ],
})
export class UsersModule {}
