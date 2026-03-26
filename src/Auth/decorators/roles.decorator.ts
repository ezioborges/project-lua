import { SetMetadata } from '@nestjs/common';

// Uma etiqueta invisível que colocamos na rota
export const ROLES_KEY = 'roles';

// O decorator que vai receber os papéis (admin, client...)
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
