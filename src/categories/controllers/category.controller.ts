import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const newCategory = await this.categoryService.create(createCategoryDto);

    return {
      status: 'success',
      message: 'Categoria criada com sucesso',
      data: newCategory,
    };
  }

  @Get()
  @HttpCode(200)
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const allCategories = await this.categoryService.findAll(
      Number(page),
      Number(limit),
    );

    return {
      status: 'success',
      message: 'Lista de categorias',
      data: allCategories,
    };
  }

  @Get(':categoryId')
  @HttpCode(200)
  async findById(categoryId: string) {
    const category = await this.categoryService.findById(categoryId);

    return {
      status: 'success',
      message: 'Categoria encontrada com sucesso',
      data: category,
    };
  }

  @Put(':categoryId')
  @HttpCode(200)
  async update(
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const updatedCategory = await this.categoryService.update(
      categoryId,
      updateCategoryDto,
    );

    return {
      status: 'success',
      message: 'Categoria atualizada com sucesso',
      data: updatedCategory,
    };
  }
}
