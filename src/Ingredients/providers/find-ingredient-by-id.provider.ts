import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindIngredientByIdProvider {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  public async execute(ingredientId: string) {
    try {
      const ingredient = await this.ingredientRepository.findOneBy({
        id: ingredientId,
      });

      if (!ingredient) {
        throw new NotFoundException(
          `Não foi possível encontrar o ingredient com o ID: ${ingredientId}`,
        );
      }

      return ingredient;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Erro na busca do ingrediente através do ID: ${error.message}`,
      );
    }
  }
}
