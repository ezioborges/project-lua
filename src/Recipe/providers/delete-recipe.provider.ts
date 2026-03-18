import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteRecipeProvider {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  public async execute(recipeId: string) {
    try {
      const recipeToDelete = await this.recipeRepository.findOneBy({
        id: recipeId,
      });

      if (!recipeToDelete) {
        throw new NotFoundException(
          `Nenhuma receita encontrada com o ID: ${recipeId}`,
        );
      }

      return await this.recipeRepository.softDelete(recipeId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao deletar receita: ${error.message}`,
      );
    }
  }
}
