import { Injectable } from '@nestjs/common';
import { CreateCategoryProvider } from '../providers/create-category.provider';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { FindAllCategoriesProvider } from '../providers/find-all-categories.provider';
import { FindCategoryByIdProvider } from '../providers/find-category-by-id.provider';
import { UpdateCategoryProvider } from '../providers/update-category.provider';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { DeleteCategoryProvider } from '../providers/delete-category.provider';
import { RestoreCategoryProvider } from '../providers/restore-category.provider';

@Injectable()
export class CategoryService {
  constructor(
    private readonly createCategoryProvider: CreateCategoryProvider,
    private readonly findAllCategoriesProvider: FindAllCategoriesProvider,
    private readonly findCategoryByIdProvider: FindCategoryByIdProvider,
    private readonly updateCategoryProvider: UpdateCategoryProvider,
    private readonly deleteteCategoryProvider: DeleteCategoryProvider,
    private readonly restoreCategoryProvider: RestoreCategoryProvider,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.createCategoryProvider.execute(createCategoryDto);
  }

  async findAll(page: number, limit: number) {
    return await this.findAllCategoriesProvider.execute(page, limit);
  }

  async findById(categoryId: string) {
    return await this.findCategoryByIdProvider.execute(categoryId);
  }

  async update(categoryId: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.updateCategoryProvider.execute(
      categoryId,
      updateCategoryDto,
    );
  }

  async delete(categoryId: string) {
    return await this.deleteteCategoryProvider.execute(categoryId);
  }

  async restore(categoryId: string) {
    return await this.restoreCategoryProvider.execute(categoryId);
  }
}
