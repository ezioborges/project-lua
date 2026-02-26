import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteCategoryProvider {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  public async execute(categoryId: string) {
    try {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId,
      });

      if (!category) {
        throw new NotFoundException(
          `Nenhuma categoria encontrado com o ID: ${categoryId}`,
        );
      }

      return await this.categoryRepository.softDelete(categoryId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Não foi possível deletar a categoria: ${error.message}`,
      );
    }
  }
}
