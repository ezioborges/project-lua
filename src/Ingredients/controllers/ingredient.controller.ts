import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
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

  @Get()
  @HttpCode(200)
  async findAll(page: number, limit: number) {
    try {
      const allIngredients = await this.ingredientService.findAll(page, limit);

      return {
        status: 'success',
        message: 'Lista de Ingredientes',
        allIngredients,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao listar os ingredientes: ${error.message}`,
      );
    }
  }
}
