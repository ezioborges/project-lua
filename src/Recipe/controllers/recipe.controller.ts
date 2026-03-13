import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { RecipeService } from '../services/recipe.service';
import { CreateRecipeDto } from '../dto/create-recipe.dto';

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
}
