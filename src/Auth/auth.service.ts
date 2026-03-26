import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/Users/services/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(`Credenciais inválidas`);
    }

    if (user.password !== password) {
      throw new UnauthorizedException(`Credenciais inválidas`);
    }

    // jeito mais moderno de deletar a senha. Para não deixar a senha opcional na entidade.
    // mantem a imutabilidade
    const { password: _, ...userWithoutPassword } = user;

    // Criar o Payload que vai ser lido no decode do jwt
    const payload = { sub: user.id, email: user.email, role: user.role };

    // o Nestjs assinar e gera o token
    const token = await this.jwtService.signAsync(payload);

    return {
      userWithoutPassword,
      access_token: token,
    };
  }
}
