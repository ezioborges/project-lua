import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestoreIngredientProvider {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  public async execute(ingredientId: string) {
    try {
      return await this.ingredientRepository.restore(ingredientId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro na restauração do ingrediente: ${error.message}`,
      );
    }
  }
}
