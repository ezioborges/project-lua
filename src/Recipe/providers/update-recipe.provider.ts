import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { Repository } from 'typeorm';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';

@Injectable()
export class UpdateRecipeProvider {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  public async execute(recipeId: string, updateRecipeDto: UpdateRecipeDto) {
    try {
      const recipeToEdit = await this.recipeRepository.findOneBy({
        id: recipeId,
      });

      if (!recipeToEdit) {
        throw new NotFoundException(
          `Não foi encontrada receita com o ID: ${recipeId}`,
        );
      }

      const editedRecipe = await this.recipeRepository.merge(recipeToEdit, {
        ...updateRecipeDto,
      });

      return await this.recipeRepository.save(editedRecipe);
    } catch (error) {
      throw new InternalServerErrorException(
        `Não foi possível atualizar a receita: ${error.message}`,
      );
    }
  }
}
