import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

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
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.usersServive.findAll(Number(page), Number(limit));

    return {
      status: 'success',
      message: 'Lista de usuários ativos.',
      meta: result.meta,
      data: result.data,
    };
  }

  @Get(':userId')
  async findOne(@Param('userId', new ParseUUIDPipe()) id: string) {
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
