import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestoreCategoryProvider {
  constructor(
    @InjectRepository(Category)
    private categoryRespository: Repository<Category>,
  ) {}

  public async execute(categoryId: string) {
    try {
      return await this.categoryRespository.restore(categoryId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Não foi possível restaurar a categoria: ${error.message}`,
      );
    }
  }
}
