import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class UpdateCategoryProvider {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  public async execute(
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const category = await this.categoryRepository.findOne({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        throw new NotFoundException(
          `Categoria não encontrada com o ID: ${categoryId}`,
        );
      }

      const categoryToUpdate = this.categoryRepository.merge(category, {
        ...updateCategoryDto,
      });

      return await this.categoryRepository.save(categoryToUpdate);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Já existe uma categoria com este código (sku)',
        );
      }

      throw new InternalServerErrorException(
        `Erro ao salvar a categoria no banco de dados: ${error.message}`,
      );
    }
  }
}
