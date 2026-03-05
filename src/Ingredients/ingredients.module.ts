import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientProvider } from './providers/create-ingredient.provider';
import { IngredientService } from './services/ingredient.service';
import { IngredientController } from './controllers/ingredient.controller';
import { RecipeIngredient } from 'src/RecipeIngredient/entities/recipe-ingredient.entity';
import { FindAllIngredientsProvider } from './providers/find-all-ingredients.provider';
import { FindIngredientByIdProvider } from './providers/find-ingredient-by-id.provider';
import { UpdateIngredientProvider } from './providers/update-ingredient.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, RecipeIngredient])],
  controllers: [IngredientController],
  providers: [
    IngredientService,
    CreateIngredientProvider,
    FindAllIngredientsProvider,
    FindIngredientByIdProvider,
    UpdateIngredientProvider,
  ],
  exports: [
    IngredientService,
    CreateIngredientProvider,
    FindAllIngredientsProvider,
    FindIngredientByIdProvider,
    UpdateIngredientProvider,
  ],
})
export class IngredientModule {}
