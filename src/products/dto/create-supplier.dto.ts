import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome do fornecedor é obrigatório' })
  name: string;

  @IsString()
  @IsOptional()
  contactEmail?: string;

  @IsUrl({}, { message: 'O site do fornecedor deve ser um link válido' })
  @IsOptional()
  webSite?: string;
}
