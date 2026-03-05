import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { IngredientService } from '../services/ingredient.service';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';

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

  @Get(':ingredientId')
  @HttpCode(200)
  async findById(
    @Param('ingredientId', new ParseUUIDPipe()) ingredientId: string,
  ) {
    try {
      const ingredient = await this.ingredientService.findById(ingredientId);

      return {
        status: 'succss',
        message: 'Ingrediente encontrado',
        ingredient,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Não foi possível encontrar o ingrediente: ${error.message}`,
      );
    }
  }

  @Put(':ingredientId')
  @HttpCode(200)
  async update(
    @Param('ingredientId', new ParseUUIDPipe()) ingredientId: string,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    try {
      const ingredient = await this.ingredientService.update(
        ingredientId,
        updateIngredientDto,
      );

      return {
        status: 'success',
        message: 'Ingrediente atualizado com sucesso',
        ingredient,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao atualizar o ingrediente: ${error.message}`,
      );
    }
  }
}
