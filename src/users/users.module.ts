import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './service/users.service';
import { User } from './entitites/users.entity';
import { CreateUserProvider } from './service/create-users.provider';
import { FindAllUsersProvider } from './service/find-all-users.provider';

@Module({
  // O forFeature cria o "UserRepository" internamente
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, CreateUserProvider, FindAllUsersProvider],
  exports: [UsersService, CreateUserProvider, FindAllUsersProvider],
})
export class UsersModule {}
