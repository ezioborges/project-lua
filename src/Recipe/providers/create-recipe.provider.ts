import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from 'src/Categories/dto/create-category.dto';

@Injectable()
export class CreateRecipeProvider {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepository: Repository<Recipe>,
  ) {}

  public async execute(createRecipeDto: CreateCategoryDto) {
    const recipe = await this.recipeRepository.findOneBy({
      name: createRecipeDto.name,
    });

    if (recipe) {
      throw new ConflictException(
        `Uma receita já foi cadastrada com o nome: ${createRecipeDto.name}`,
      );
    }

    const newRecipe = this.recipeRepository.create(createRecipeDto);

    return this.recipeRepository.save(newRecipe);
  }
}
