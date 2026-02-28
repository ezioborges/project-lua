import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CreateCategoryProvider } from './providers/create-category.provider';
import { FindAllCategoriesProvider } from './providers/find-all-categories.provider';
import { FindCategoryByIdProvider } from './providers/find-category-by-id.provider';
import { UpdateCategoryProvider } from './providers/update-category.provider';
import { DeleteCategoryProvider } from './providers/delete-category.provider';
import { RestoreCategoryProvider } from './providers/restore-category.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [
    CategoryService,
    CreateCategoryProvider,
    FindAllCategoriesProvider,
    FindCategoryByIdProvider,
    UpdateCategoryProvider,
    DeleteCategoryProvider,
    RestoreCategoryProvider,
  ],
  exports: [
    CategoryService,
    CreateCategoryProvider,
    FindAllCategoriesProvider,
    FindCategoryByIdProvider,
    UpdateCategoryProvider,
    DeleteCategoryProvider,
    RestoreCategoryProvider,
  ],
})
export class CategoryModule {}
