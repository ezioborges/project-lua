import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { FindRelationsNotFoundError } from 'typeorm';

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

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersServive.findById(id);

    return {
      status: 'success',
      message: 'Usuário Encontrado',
      data: user,
    };
  }
}
