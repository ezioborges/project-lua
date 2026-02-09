import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersServive: UsersService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersServive.create(createUserDto);
    return {
      status: 'success',
      message: 'Usuário criado com sucesso!',
      data: newUser,
    };
  }

  @Get()
  async findAll() {
    const allUsers = await this.usersServive.findAll();
    return {
      status: 'success',
      message: 'Lista de usuários cadastrados!',
      data: allUsers,
    };
  }
}
