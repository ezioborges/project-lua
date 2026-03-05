import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { CreateIngredientProvider } from './providers/create-ingredient.provider';
import { IngredientService } from './services/ingredient.service';
import { IngredientController } from './controllers/ingredient.controller';
import { RecipeIngredient } from 'src/RecipeIngredient/entities/recipe-ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, RecipeIngredient])],
  controllers: [IngredientController],
  providers: [IngredientService, CreateIngredientProvider],
  exports: [IngredientService, CreateIngredientProvider],
})
export class IngredientModule {}
