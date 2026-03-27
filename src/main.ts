import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(PORT, () => {
    console.log(`Rodando na porta: ${PORT}`);
  });
}
bootstrap();
