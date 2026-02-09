import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../entitites/users.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FindAllUsersProvider {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  public async execute() {
    return this.usersRepository.find();
  }
}
