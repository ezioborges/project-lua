import { RecipeIngredient } from 'src/RecipeIngredient/entities/recipe-ingredient.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ingredients')
export class Ingredient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => RecipeIngredient, (ReIc) => ReIc.ingredient)
  recipeIngredients: RecipeIngredient[];
}
