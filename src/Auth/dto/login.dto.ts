import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Por favor, informe um endereço de email válido' })
  @IsNotEmpty({ message: 'o campo de email é obrigatório' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Por favor, coloque sua senha' })
  @MinLength(6, { message: 'A senha deve possuir no minimo 6 caracteres' })
  password: string;
}
