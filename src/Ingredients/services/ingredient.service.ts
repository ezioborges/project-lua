import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateIngredientProvider } from '../providers/create-ingredient.provider';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { FindAllIngredientsProvider } from '../providers/find-all-ingredients.provider';
import { FindIngredientByIdProvider } from '../providers/find-ingredient-by-id.provider';
import { UpdateIngredientProvider } from '../providers/update-ingredient.provider';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';

@Injectable()
export class IngredientService {
  constructor(
    private readonly createIngredientProvider: CreateIngredientProvider,
    private readonly findAllIngredientProvider: FindAllIngredientsProvider,
    private readonly findIngredientByIdProvider: FindIngredientByIdProvider,
    private readonly updateIngredientProvider: UpdateIngredientProvider,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    return this.createIngredientProvider.execute(createIngredientDto);
  }

  async findAll(page: number, limit: number) {
    return await this.findAllIngredientProvider.execute(page, limit);
  }

  async findById(ingredientId: string) {
    return await this.findIngredientByIdProvider.execute(ingredientId);
  }

  async update(ingredentId: string, updateIngredientDto: UpdateIngredientDto) {
    return this.updateIngredientProvider.execute(
      ingredentId,
      updateIngredientDto,
    );
  }
}
