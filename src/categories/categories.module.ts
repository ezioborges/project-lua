import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';
import { CreateCategoryProvider } from './providers/create-category.provider';
import { FindAllCategoriesProvider } from './providers/find-all-categories.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [
    CategoryService,
    CreateCategoryProvider,
    FindAllCategoriesProvider,
  ],
  exports: [CategoryService, CreateCategoryProvider, FindAllCategoriesProvider],
})
export class CategoryModule {}
