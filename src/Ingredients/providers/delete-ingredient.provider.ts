import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { Repository } from 'typeorm';
import { error } from 'console';

@Injectable()
export class DeleteIngredientProvider {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRespository: Repository<Ingredient>,
  ) {}

  public async execute(ingredientId: string) {
    try {
      const ingredient = await this.ingredientRespository.findOneBy({
        id: ingredientId,
      });

      if (!ingredient) {
        throw new ConflictException(
          `Não foi possível encontrar o ingrediente com o ID: ${ingredientId}`,
        );
      }

      return await this.ingredientRespository.softDelete(ingredientId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao deletar ingrediente: ${error.message}`,
      );
    }
  }
}
