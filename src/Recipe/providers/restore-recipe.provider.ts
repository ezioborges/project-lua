import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestoreRecipeProvider {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  public async execute(recipeId: string) {
    try {
      return this.recipeRepository.restore(recipeId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Não foi possivel restaurar a receita: ${error.message}`,
      );
    }
  }
}
