import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
        throw new ConflictException(
          `Não foi possível encontrar o ingredient com o ID: ${ingredientId}`,
        );
      }

      return ingredient;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro na busca do ingrediente através do ID: ${error.message}`,
      );
    }
  }
}
