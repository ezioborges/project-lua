import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
      });

      return {
        recipes,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Não foi possível listar as receitas`,
      );
    }
  }
}
