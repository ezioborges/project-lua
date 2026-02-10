import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { STATUS_CODES } from 'http';

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

  @Get(':userId')
  async findOne(@Param('userId') id: string) {
    const user = await this.usersServive.findById(id);

    return {
      status: 'success',
      message: 'Usuário Encontrado',
      data: user,
    };
  }

  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const update = await this.usersServive.userUpdate(userId, updateUserDto);

    return {
      status: 'success',
      message: 'Usuário atualizado com sucesso',
      data: update,
    };
  }

  @Delete(':userId')
  async deleteUser(@Param('userId', new ParseUUIDPipe()) userId: string) {
    await this.usersServive.deleteUser(userId);

    return {
      status: 'success',
      message: 'Usuário excluido com sucesso!',
    };
  }

  @Patch(':userId/restore')
  async restoreUser(@Param('userId') userId: string) {
    await this.usersServive.restoreUser(userId);

    const userRestored = await this.usersServive.findById(userId);

    return {
      status: 'success',
      message: 'Usuário restaurado com sucesso!',
      data: userRestored,
    };
  }
}
