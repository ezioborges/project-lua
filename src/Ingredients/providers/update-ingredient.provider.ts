import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { Repository } from 'typeorm';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';

@Injectable()
export class UpdateIngredientProvider {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRespository: Repository<Ingredient>,
  ) {}

  public async execute(
    ingredentId: string,
    updateIngredientDto: UpdateIngredientDto,
  ) {
    try {
      const ingredent = await this.ingredientRespository.findOneBy({
        id: ingredentId,
      });

      if (!ingredent) {
        throw new NotFoundException(
          `Não foi possível encontrar ingrediente com ID: ${ingredentId}`,
        );
      }

      const ingredientToUpdate = this.ingredientRespository.merge(ingredent, {
        ...updateIngredientDto,
      });

      return await this.ingredientRespository.save(ingredientToUpdate);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Já existe um ingrediente com este nome');
      }

      throw new InternalServerErrorException(
        `Não foi possível atualizar o ingrediente: ${error.message}`,
      );
    }
  }
}
