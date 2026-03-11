import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da receita é um campo obrigatório' })
  @MinLength(3, { message: 'O campo nome deve conter no mínimo 3 caracteres' })
  @MaxLength(50)
  name: string;
}
