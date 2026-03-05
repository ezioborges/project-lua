import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do ingrediente é um campo obrigatório' })
  @MinLength(3, {
    message: 'O nome do ingrediente deve possuir no mínimo 3 caracteres',
  })
  @MaxLength(50)
  name: string;
}
