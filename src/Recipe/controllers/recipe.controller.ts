import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { RecipeService } from '../services/recipe.service';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Recipes')
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    const newRecipe = await this.recipeService.create(createRecipeDto);

    return {
      status: 'success',
      message: 'Receita criada com sucesso',
      newRecipe,
    };
  }

  @Get()
  @HttpCode(200)
  async findAll(page: number, limit: number) {
    const allRecipes = await this.recipeService.findAll(page, limit);

    return {
      status: 'success',
      message: 'Lista de Receitas',
      allRecipes,
    };
  }

  @Get(':recipeId')
  @HttpCode(200)
  async findById(@Param('recipeId') recipeId: string) {
    const recipe = await this.recipeService.findById(recipeId);

    return {
      status: 'success',
      message: 'Receita encontrada com sucesso',
      recipe,
    };
  }

  @Delete(':recipeId')
  @HttpCode(200)
  async delete(@Param('recipeId', new ParseUUIDPipe()) recipeId: string) {
    await this.recipeService.delete(recipeId);

    return {
      status: 'success',
      message: 'Receita deletada com sucesso',
    };
  }

  @Put(':recipeId')
  @HttpCode(200)
  async update(
    @Param('recipeId', new ParseUUIDPipe()) recipeId: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    const recipeUpdated = await this.recipeService.update(
      recipeId,
      updateRecipeDto,
    );

    return {
      status: 'success',
      message: 'Receita atualizada com sucesso',
      recipeUpdated,
    };
  }

  @Patch(':recipeId')
  @HttpCode(200)
  async restore(@Param('recipeId', new ParseUUIDPipe()) recipeId: string) {
    await this.recipeService.restore(recipeId);

    return {
      status: 'success',
      message: 'Receita restaurada com sucesso',
    };
  }
}
