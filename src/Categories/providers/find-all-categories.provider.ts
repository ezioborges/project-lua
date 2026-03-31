import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';
import { CategoryValidator } from '../services/categories-validators.service';

@Injectable()
export class FindAllCategoriesProvider {
  constructor(
    @InjectRepository(Category)
    private readonly findAllCategoriesRepository: Repository<Category>,
    private readonly categoryValidator: CategoryValidator,
  ) {}

  public async execute(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [categories, total] =
        await this.findAllCategoriesRepository.findAndCount({
          take: limit,
          skip,
          order: {
            createdAt: 'DESC',
          },
        });

      await this.categoryValidator.checkCategoryListExist(categories);

      return {
        categories,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Erro ao buscar todas as categorias: ${error.message}`,
      );
    }
  }
}
