import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './Users/services/users.service';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  // 1. Cria o contexto da aplicação NestJS (sem subir o servidor HTTP)
  const app = await NestFactory.createApplicationContext(AppModule);

  // 2. Puxa os serviços que vamos precisar
  const usersService = app.get(UsersService);
  const dataSource = app.get(DataSource);

  console.log('🧹 Limpando a tabela de usuários...');

  // 3. O "Reset": Apaga todos os usuários existentes.
  // Usamos o query runner do TypeORM para um DELETE forçado e rápido
  await dataSource.query('DELETE FROM users');

  console.log('🌱 Plantando os usuários padrão...');

  // 5. Nossos 3 usuários sementes
  const seedUsers = [
    {
      name: 'Ezio Admin',
      email: 'admin@lua.com',
      cpf: '11111111111',
      password: '123456',
      role: 'admin' as any,
    },
    {
      name: 'Laura Client',
      email: 'client@lua.com',
      cpf: '22222222222',
      password: '123456',
      role: 'client' as any,
    },
    {
      name: 'Visitante Convidado',
      email: 'guest@lua.com',
      cpf: '33333333333',
      password: '123456',
      role: 'guest' as any,
    },
  ];

  // 6. Salvando no banco de dados usando o seu Service
  for (const user of seedUsers) {
    await usersService.create(user);
    console.log(`✅ Usuário criado: ${user.name} (${user.role})`);
  }

  console.log('🚀 Seed finalizado com sucesso!');

  // 7. Fecha a aplicação para o terminal ser liberado
  await app.close();
}

bootstrap();
