import { Injectable } from '@nestjs/common';
import { CreateIngredientProvider } from '../providers/create-ingredient.provider';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { FindAllIngredientsProvider } from '../providers/find-all-ingredients.provider';

@Injectable()
export class IngredientService {
  constructor(
    private readonly createIngredientProvider: CreateIngredientProvider,
    private readonly findAllIngredientProvider: FindAllIngredientsProvider,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    return this.createIngredientProvider.execute(createIngredientDto);
  }

  async findAll(page: number, limit: number) {
    return await this.findAllIngredientProvider.execute(page, limit);
  }
}
