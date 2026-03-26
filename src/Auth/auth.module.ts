import { Module } from '@nestjs/common';
import { UsersModule } from 'src/Users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true, // facilita usar o token em outras partes do sistema
      secret: 'MINHA_CHAVE_SECRETA_123', //TODO: mudar para variavel de ambiente .env
      signOptions: { expiresIn: '1h' }, // o token expirar em uma hora
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
