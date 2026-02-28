import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'O produto deve conter duas casas decimais' },
  )
  // se usar IsNotEmpty, pode ser que o preço aceite valores negativos.
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty({ message: 'O código do produto é obrigatório' })
  sku: string;

  @IsUrl({}, { message: 'Forneça uma URL válida para a imagem' })
  @IsOptional()
  imageUrl?: string;

  @IsInt({ message: 'A quantidade de estoque deve ser um número inteiro!' })
  @Min(0, { message: 'O estoqur final não pode ser um valor negativo' })
  stock_quantity: number;

  // RELACIONAMENTOS: chamo apenas o ID por que é responsabilidade do Service fazer a busca

  @IsString()
  @IsNotEmpty({ message: 'A categoria do produto é obrigatória' })
  categoryId: string;

  @IsString()
  @IsOptional()
  supplierId?: string;
}
