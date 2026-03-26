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
    const { password: _, refreshToken: __, ...userWithoutPassword } = user;

    // Criar o Payload que vai ser lido no decode do jwt
    const payload = { sub: user.id, email: user.email, role: user.role };

    // o Nestjs assinar e gera o token de acesso (menos tempo de duração)
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: 'MINHA_CHAVE_SUPER_SECRETA_123',
      expiresIn: '1h',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'MINHA_CHAVE_DO_REFRESH_TOKEN_999',
      expiresIn: '7d',
    });

    // salvar o refresh token no banco de dados
    await this.usersService.userUpdate(user.id, { refreshToken });

    return {
      user: userWithoutPassword,
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(oldToken: string) {
    try {
      // Se o token estiver expirado ou falso, cai direto no catch
      // Aqui usamos a mesma chave que é usada para gerar o refresh token no login
      const payload = await this.jwtService.verifyAsync(oldToken, {
        secret: 'MINHA_CHAVE_DO_REFRESH_TOKEN_999',
      });

      // Busca o usuário no banco de dados pelo ID que foi passado dentro do token
      const user = await this.usersService.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException(`Usuário não encontrado`);
      }

      // verificação de segurança, verifica se o token enviado é o mesmo ativo no banco de dados
      if (user.refreshToken !== oldToken) {
        throw new UnauthorizedException(`Refresh token revogado ou inválido`);
      }

      // Gera novo access token de 1 hora
      const newPayload = { sub: user.id, email: user.email, role: user.role };

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        secret: 'MINHA_CHAVE_SUPER_SECRETA_123',
        expiresIn: '1h',
      });

      return {
        access_token: newAccessToken,
      };
    } catch (error) {
      console.log('Erro real do refresh token: ', error.message);

      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException(
        `Refresh token inválido ou expirado. Faça login novamente`,
      );
    }
  }
}
