import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UpdateUserProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public async execute(userId: string, UpdateUserDto: UpdateUserDto) {
    // pega pelo id e a entidade que quero atualizar
    const updatingUser = await this.userRepository.update(
      userId,
      UpdateUserDto,
    );

    // caso nenhuma linha da tabela seja afetada. É mais rápido
    if (updatingUser.affected === 0) {
      throw new NotFoundException(`Usuário não encontrado com o ID: ${userId}`);
    }

    // chamo de novo pelo id pra que mostra atualizado no resultado.
    const updatedUser = await this.userRepository.findOneBy({ id: userId });

    return updatedUser;
  }
}
