import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRecipeProvider } from '../providers/create-recipe.provider';
import { CreateRecipeDto } from '../dto/create-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(private readonly createRecipeProvider: CreateRecipeProvider) {}

  async create(createRecipeDto: CreateRecipeDto) {
    return this.createRecipeProvider.execute(createRecipeDto);
  }
}
