import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Necessário para ler o .env
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module'; // aqui imprta o módulo e não o controller
import { User } from './users/entities/users.entity'; // Corrigi o caminho (typo: entitites -> entities)

@Module({
  imports: [
    // Carrega as variáveis do arquivo .env
    ConfigModule.forRoot(),

    // Cria a conexão com o banco de dados
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User], // Lista as tabelas do banco
      synchronize: true, // Cria as tabelas automaticamente
      logging: true,
    }),

    // 3. Importa o módulo de usuários (que já tem o controller e o service dentro dele)
    UsersModule,
  ],
})
export class AppModule {}
