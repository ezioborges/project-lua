import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryValidator {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async checkProductValidation(name?: string) {
    const nameExists = await this.categoryRepository.findOneBy({ name });

    if (nameExists && nameExists.name === name) {
      throw new ConflictException(`Categoria já cadastrado`);
    }

    return null;
  }

  async checkCategoryListExist(categories: Category[]) {
    if (!categories || categories.length === 0) {
      throw new NotFoundException(`Nenhuma categoria encontrada`);
    }

    return null;
  }
}
