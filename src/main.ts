import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);

  // Habilita requisições de outras origens (Front-end)
  app.enableCors();

  // ativa a validação dos tipos que passei na DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos que não estão na DTO
      forbidNonWhitelisted: true, // Erro se for enviado campos extras
      transform: true, // converte tipos automaticamente
      stopAtFirstError: true, // lança o primeiro erro encontrado sem mandar os outros
    }),
  );

  const configuredPort = Number(configService.get<string>('PORT', '3333'));
  const initialPort = Number.isFinite(configuredPort) ? configuredPort : 3333;
  const maxPortAttempts = 10;

  for (let attempt = 0; attempt < maxPortAttempts; attempt++) {
    const port = initialPort + attempt;

    try {
      await app.listen(port);

      if (attempt > 0) {
        logger.warn(
          `A porta configurada (${initialPort}) estava em uso. Aplicacao iniciada na porta ${port}.`,
        );
      }

      logger.log(`Rodando na porta: ${port}`);
      return;
    } catch (error) {
      const err = error as NodeJS.ErrnoException;

      if (err.code === 'EADDRINUSE') {
        logger.warn(`Porta ${port} em uso. Tentando porta ${port + 1}...`);
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    `Nao foi possivel iniciar a API. Nenhuma porta disponivel entre ${initialPort} e ${initialPort + maxPortAttempts - 1}.`,
  );
}
bootstrap();
