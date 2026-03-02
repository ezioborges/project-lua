import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryValidator } from '../services/categories-validators.service';

@Injectable()
export class CreateCategoryProvider {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private categoryValidator: CategoryValidator,
  ) {}

  public async execute(createCategoryDto: CreateCategoryDto) {
    try {
      const { name } = createCategoryDto;

      await this.categoryValidator.checkProductValidation(name);

      const newCategory = this.categoryRepository.create(createCategoryDto);

      return this.categoryRepository.save(newCategory);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Erro ao criar Categoria: ${error.message}`,
      );
    }
  }
}
