import { Injectable } from '@nestjs/common';
import { CreateRecipeProvider } from '../providers/create-recipe.provider';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { FindAllRecipesProvider } from '../providers/find-all-recipes.provider';
import { FindRecipeByIdProvider } from '../providers/find-recipe-by-id.provider';
import { UpdateRecipeProvider } from '../providers/update-recipe.provider';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { DeleteRecipeProvider } from '../providers/delete-recipe.provider';

@Injectable()
export class RecipeService {
  constructor(
    private readonly createRecipeProvider: CreateRecipeProvider,
    private readonly findAllRecipeProvider: FindAllRecipesProvider,
    private readonly findRecipeByIdProvider: FindRecipeByIdProvider,
    private readonly updateRecipeProvider: UpdateRecipeProvider,
    private readonly deleteRecipeProvider: DeleteRecipeProvider,
  ) {}

  async create(createRecipeDto: CreateRecipeDto) {
    return this.createRecipeProvider.execute(createRecipeDto);
  }

  async findAll(page: number, limit: number) {
    return await this.findAllRecipeProvider.execute(page, limit);
  }

  async findById(recipeId: string) {
    return await this.findRecipeByIdProvider.execute(recipeId);
  }

  async update(recipeId: string, updateRecipeDto: UpdateRecipeDto) {
    return await this.updateRecipeProvider.execute(recipeId, updateRecipeDto);
  }

  async delete(recipeId: string) {
    return await this.deleteRecipeProvider.execute(recipeId);
  }
}
