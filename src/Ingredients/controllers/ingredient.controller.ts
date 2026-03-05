import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';

@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createIngredientDto: CreateIngredientDto) {
    const newIngredient =
      await this.ingredientService.create(createIngredientDto);

    return {
      status: 'success',
      message: 'Ingrediente criado com sucesso',
      newIngredient,
    };
  }
}
