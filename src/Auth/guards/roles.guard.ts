import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // O Reflector le os decorators
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Ler quais roles a rota exige
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Se a rota não tem @Roles(), qualquer pessoa logada pode acessar a rota
    if (!requiredRoles) {
      return true;
    }

    // Pegar o user logado que o JwtAuthGuard injetou no request
    const { user } = context.switchToHttp().getRequest();

    // Verificamos se a role do usuário bate com alguma role que é exigido na rota
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      // hettpStatus 403 = encontra o usuário reconhece, mas ele não tem permissão
      throw new ForbiddenException(`Acesso negado! Privilégios insuficientes.`);
    }

    return true;
  }
}
