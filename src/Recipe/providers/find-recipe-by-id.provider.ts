import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindRecipeByIdProvider {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  public async execute(recipeId: string) {
    const recipe = await this.recipeRepository.findOneBy({ id: recipeId });

    if (!recipe) {
      throw new NotFoundException(
        `Nenhuma receita encontrada com o ID: ${recipeId}`,
      );
    }

    return recipe;
  }
}
