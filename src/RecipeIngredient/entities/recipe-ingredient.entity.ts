import { Ingredient } from 'src/Ingredients/entities/ingredient.entity';
import { Recipe } from 'src/Recipe/entities/recipe.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('recipe_ingredinets')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column()
  // tipo de unidade ml, gota, g...
  unit: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredient)
  recipe: Recipe;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients)
  ingredient: Ingredient;
}
