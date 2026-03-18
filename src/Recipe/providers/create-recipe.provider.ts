import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { Repository } from 'typeorm';
import { CreateRecipeDto } from '../dto/create-recipe.dto';
import { RecipeIngredient } from 'src/RecipeIngredient/entities/recipe-ingredient.entity';

@Injectable()
export class CreateRecipeProvider {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,

    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepository: Repository<RecipeIngredient>,
  ) {}

  public async execute(createRecipeDto: CreateRecipeDto) {
    try {
      const recipeExists = await this.recipeRepository.findOneBy({
        name: createRecipeDto.name,
      });

      if (recipeExists) {
        throw new ConflictException(
          `Uma receita já foi cadastrada com o nome: ${createRecipeDto.name}`,
        );
      }

      // 1. Separar os dados da receita base da lista de ingredientes
      const { recipeIngredients, ...recipeData } = createRecipeDto;

      // 2. Cria e salva a receita base no banco
      const recipe = this.recipeRepository.create(recipeData);
      const savedRecipe = await this.recipeRepository.save(recipe);

      // 3. Preparar os ingredientes para a tabela intermediária
      // Usar o map para adicionar a referência da receita salva em cada ingrediente
      const ingredientsToSave = recipeIngredients.map((item) => {
        return this.recipeIngredientRepository.create({
          // Vincular o ID da receita que acabou de ser salva
          recipe: { id: savedRecipe.id },
          // Vincular o ID do ingrediente que vem da DTO
          ingredient: { id: item.ingredientId },
          quantity: item.quantity,
          unit: item.unit,
        });
      });

      // 4. Salvar todos os ingredientes na tabela intermediária
      await this.recipeIngredientRepository.save(ingredientsToSave);

      return {
        ...savedRecipe,
        recipeIngredients: ingredientsToSave,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Não foi possível criar a receita.`,
      );
    }
  }
}
