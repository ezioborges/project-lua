import { Ingredient } from 'src/Ingredients/entities/ingredient.entity';
import { Recipe } from 'src/Recipe/entities/recipe.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('recipe_ingredients')
export class RecipeIngredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Column()
  // tipo de unidade ml, gota, g...
  unit: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredient)
  @JoinColumn({ name: 'recipe_id' }) // força a nomenclatura em snake_case
  recipe: Recipe;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;
}
