// Primeiro criar o DTOque define o formato JSON que a API vai aceitar
// DTO é uma ckasse simples, sem lógica, só dados

export class CreateUserDto {
  name: string;
  email: string;
  cpf: string;
  password: string;
}
