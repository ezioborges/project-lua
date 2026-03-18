import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { Repository } from 'typeorm';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import { RecipeIngredient } from 'src/RecipeIngredient/entities/recipe-ingredient.entity';

@Injectable()
export class UpdateRecipeProvider {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,

    @InjectRepository(RecipeIngredient)
    private readonly recipeIngredientsRepository: Repository<RecipeIngredient>,
  ) {}

  public async execute(recipeId: string, updateRecipeDto: UpdateRecipeDto) {
    try {
      // 1. Separar os ingredientes dos outros dados
      const { recipeIngredients, ...updateData } = updateRecipeDto;

      // 2. Buscar a receita para garantir que ela existe
      const recipeToEdit = await this.recipeRepository.findOneBy({
        id: recipeId,
      });

      if (!recipeToEdit) {
        throw new NotFoundException(
          `Não foi encontrada receita com o ID: ${recipeId}`,
        );
      }

      // 3. Atualiza os dados básicos da receita (se houver algum)
      if (Object.keys(updateData).length > 0) {
        await this.recipeRepository.update(recipeId, updateData);
      }

      // 4. Caso tenho sido enviado uma lista de recipesIngredients
      if (recipeIngredients) {
        // a. Excluir todos os ingredientes antigos vinculados a receita
        await this.recipeIngredientsRepository.delete({
          recipe: { id: recipeId },
        });

        // b. Preparar os novos ingredientes
        const newIngredients = recipeIngredients.map((item) => {
          return this.recipeIngredientsRepository.create({
            recipe: { id: recipeId },
            ingredient: { id: item.ingredientId },
            quantity: item.quantity,
            unit: item.unit,
          });
        });

        // c. Salvar os novos vinculos no banco
        await this.recipeIngredientsRepository.save(newIngredients);
      }

      // 5. Retornar a receita atualizada
      return await this.recipeRepository.findOne({
        where: { id: recipeId },
        relations: { recipeIngredient: { ingredient: true } },
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
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Não foi possível atualizar a receita: ${error.message}`,
      );
    }
  }
}
