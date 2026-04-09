import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllIngredientsProvider {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  public async execute(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [ingredients, total] = await this.ingredientRepository.findAndCount(
        {
          take: limit,
          skip,
          order: {
            createdAt: 'DESC',
          },
        },
      );

      if (ingredients.length === 0) {
        throw new NotFoundException(`Não foi possível listar os ingredientes`);
      }

      return {
        ingredients,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Erro ao listar ingredientes: ${error.message}`,
      );
    }
  }
}
