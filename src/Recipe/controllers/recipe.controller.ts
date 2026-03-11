import { Body, Controller, HttpCode, Post } from '@nestjs/common';
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
      message: 'Receita cria com sucesso',
      newRecipe,
    };
  }
}
