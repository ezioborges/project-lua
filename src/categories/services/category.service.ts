import { Injectable } from '@nestjs/common';
import { CreateCategoryProvider } from '../providers/create-category.provider';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryProvider: CreateCategoryProvider) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryProvider.execute(createCategoryDto);
  }
}
