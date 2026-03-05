import { Injectable } from '@nestjs/common';
import { CreateIngredientProvider } from '../providers/create-ingredient.provider';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';

@Injectable()
export class IngredientService {
  constructor(
    private readonly createIngredientProvider: CreateIngredientProvider,
  ) {}

  async create(createIngredientDto: CreateIngredientDto) {
    return this.createIngredientProvider.execute(createIngredientDto);
  }
}
