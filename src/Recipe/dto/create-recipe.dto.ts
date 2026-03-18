import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateRecipeIngredientDto } from 'src/RecipeIngredient/dto/create-recipe-ingredient.dto';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da receita é um campo obrigatório' })
  @MinLength(3, { message: 'O campo nome deve conter no mínimo 3 caracteres' })
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  instructions?: string;

  //lista de ingredientes
  @IsArray()
  @IsNotEmpty({
    message: 'A receita precisa conter pelo menos um ingrediente.',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateRecipeIngredientDto)
  recipeIngredients: CreateRecipeIngredientDto[];
}
