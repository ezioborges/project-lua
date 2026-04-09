import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { Repository } from 'typeorm';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';

@Injectable()
export class CreateIngredientProvider {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
  ) {}

  public async execute(createIngredientDto: CreateIngredientDto) {
    try {
      const ingredient = await this.ingredientRepository.findOneBy({
        name: createIngredientDto.name,
      });

      if (ingredient) {
        throw new ConflictException(
          `Um ingrediente já foi cadastrado com esse nome: ${ingredient}`,
        );
      }

      const newIngredient =
        this.ingredientRepository.create(createIngredientDto);

      return await this.ingredientRepository.save(newIngredient);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }

      const err = error as any;
      if (err.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Já existe um ingrediente cadastrado com este nome',
        );
      }

      throw new InternalServerErrorException(
        `Não foi possível criar um ingrediente: ${err.message}`,
      );
    }
  }
}
