import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindCategoryByIdProvider {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  public async execute(
    categoryId: string,
  ): Promise<Category | null | undefined> {
    try {
      const category = this.categoryRepository.findOneBy({ id: categoryId });

      if (!category) {
        throw new NotFoundException(
          `Nenhuma categoria encontrado com o ID: ${categoryId}`,
        );
      }

      return category;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao buscar a categoria pelo ID: ${error.message}`,
      );
    }
  }
}
