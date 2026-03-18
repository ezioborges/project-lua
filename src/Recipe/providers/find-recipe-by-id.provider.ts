import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      const recipe = await this.recipeRepository.findOne({
        where: { id: recipeId },
        relations: { recipeIngredient: { ingredient: true } },
        // escolher os dados que quero que retorne
        select: {
          id: true,
          name: true,
          instructions: true,
          recipeIngredient: {
            id: true,
            quantity: true,
            unit: true,
            ingredient: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!recipe) {
        throw new NotFoundException(
          `Nenhuma receita encontrada com o ID: ${recipeId}`,
        );
      }

      return recipe;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Não foi possível encontrar a receita pelo ID.`,
      );
    }
  }
}
