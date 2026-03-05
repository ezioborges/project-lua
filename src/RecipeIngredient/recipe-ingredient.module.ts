import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeIngredient } from './entities/recipe-ingredient.entity';
import { Recipe } from 'src/Recipe/entities/recipe.entity';
import { Ingredient } from 'src/Ingredients/entities/ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeIngredient, Recipe, Ingredient])],
  controllers: [],
  providers: [],
  exports: [],
})
export class RecipeIngredientModule {}
