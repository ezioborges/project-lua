import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeIngredient } from 'src/RecipeIngredient/entities/recipe-ingredient.entity';
import { CreateRecipeProvider } from './providers/create-recipe.provider';
import { RecipeService } from './services/recipe.service';
import { RecipeController } from './controllers/recipe.controller';
import { FindAllRecipesProvider } from './providers/find-all-recipes.provider';
import { FindRecipeByIdProvider } from './providers/find-recipe-by-id.provider';
import { UpdateRecipeProvider } from './providers/update-recipe.provider';
import { DeleteRecipeProvider } from './providers/delete-recipe.provider';
import { RestoreRecipeProvider } from './providers/restore-recipe.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient])],
  controllers: [RecipeController],
  providers: [
    RecipeService,
    CreateRecipeProvider,
    FindAllRecipesProvider,
    FindRecipeByIdProvider,
    UpdateRecipeProvider,
    DeleteRecipeProvider,
    RestoreRecipeProvider,
  ],
  exports: [
    RecipeService,
    CreateRecipeProvider,
    FindAllRecipesProvider,
    FindRecipeByIdProvider,
    UpdateRecipeProvider,
    DeleteRecipeProvider,
    RestoreRecipeProvider,
  ],
})
export class RecipeModule {}
