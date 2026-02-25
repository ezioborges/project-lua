import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório' })
  @MinLength(3, {
    message: 'O código da categoria deve possuir no minimo 3 caracteres',
  })
  @MaxLength(50)
  name: string;
}
