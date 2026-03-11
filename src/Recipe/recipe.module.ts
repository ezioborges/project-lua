import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from 'src/RecipeIngredient/entities/recipe-ingredient.entity';
import { CreateRecipeProvider } from './providers/create-recipe.provider';
import { RecipeService } from './services/recipe.service';
import { RecipeController } from './controllers/recipe.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient])],
  controllers: [RecipeController],
  providers: [RecipeService, CreateRecipeProvider],
  exports: [RecipeService, CreateRecipeProvider],
})
export class RecipeModule {}
