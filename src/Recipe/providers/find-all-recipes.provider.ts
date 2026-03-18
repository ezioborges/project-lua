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
export class FindAllRecipesProvider {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  public async execute(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [recipes, total] = await this.recipeRepository.findAndCount({
        take: limit,
        skip,
        order: {
          createdAt: 'DESC',
        },
        // Adicionar as relações
        relations: {
          recipeIngredient: {
            ingredient: true, // garante que retona os dados dos ingredientes também
          },
        },
        select: {
          id: true,
          name: true,
          instructions: true,
          createdAt: true, // quando uso ordenação é necessário que o createAt, seja passado para que TypeORM entenda a busca
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

      if (!recipes) {
        throw new NotFoundException(`Nenhuma receita foi encontrada`);
      }

      return {
        recipes,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Não foi possível listar as receitas`,
      );
    }
  }
}
