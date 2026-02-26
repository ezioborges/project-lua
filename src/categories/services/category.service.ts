import { Injectable } from '@nestjs/common';
import { CreateCategoryProvider } from '../providers/create-category.provider';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { FindAllCategoriesProvider } from '../providers/find-all-categories.provider';

@Injectable()
export class CategoryService {
  constructor(
    private readonly createCategoryProvider: CreateCategoryProvider,
    private readonly findAllCategoriesProvider: FindAllCategoriesProvider,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.createCategoryProvider.execute(createCategoryDto);
  }

  async findAll(page: number, limit: number) {
    return await this.findAllCategoriesProvider.execute(page, limit);
  }
}
