import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtServide: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // pega a requisição que está chegando
    const request = context.switchToHttp().getRequest();

    // tenta extrair o token do Header
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(`Token não encontrado na requisição`);
    }

    try {
      // tenta decifrar o token. A chave secreta tem que ser a MESMA do AuthModule
      const payload = await this.jwtServide.verifyAsync(token, {
        secret: 'MINHA_CHAVE_SECRETA_123',
      });

      // as informações do usuário estão no payload.
      // Agora o controller pode verificar se o usuário é o que está logado
      request['user'] = payload;
    } catch (error) {
      throw new UnauthorizedException(
        `Token inválido ou expirado: ${error.message}`,
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
