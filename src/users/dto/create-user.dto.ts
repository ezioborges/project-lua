import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/users.entity';

// Primeiro criar o DTOque define o formato JSON que a API vai aceitar
// DTO é uma ckasse simples, sem lógica, só dados

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O campo de email é obrigatório.' })
  email: string;

  @IsString()
  @Length(11, 14, { message: 'O CPF deve ter entre 11 e 14 caracteres' })
  cpf: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve possuir no mínimo 6 caracteres.' })
  password: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Os valores de role aceitos são: admin, client ou guest',
  })
  role: UserRole;
}
