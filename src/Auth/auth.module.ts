import { Module } from '@nestjs/common';
import { UsersModule } from 'src/Users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const expiresInRaw = configService.get<string>('JWT_EXPIRES_IN', '1h');
        const expiresInAsNumber = Number(expiresInRaw);

        return {
          global: true, // facilita usar o token em outras partes do sistema
          secret: configService.get<string>(
            'JWT_SECRET',
            'dev_jwt_secret_change_me',
          ),
          signOptions: {
            expiresIn: Number.isNaN(expiresInAsNumber)
              ? (expiresInRaw as any)
              : expiresInAsNumber,
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
