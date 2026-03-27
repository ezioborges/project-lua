import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    // Ativar o ValidationPipe para funcionar o teste 4
    app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));

    await app.init();
  });

  afterAll(async () => {
    // Pega a conexão do banco e força a destuição
    const dataSource = app.get(DataSource);
    await dataSource.destroy();

    await app.close();
  });

  it('/auth/login POST: deve retornar 200 e os tokens', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@lua.com', password: '123456' })
      .expect(200)
      .expect((res) => {
        // Verifica se a API devolveu os tokens na raiz da resposta
        expect(res.body.userLog.access_token).toBeDefined();
        expect(res.body.userLog.refresh_token).toBeDefined();

        // Verifica se a NÃO vazou
        expect(res.body.userLog?.user?.password).toBeUndefined();
      });
  });

  it('/auth/login POST: deve retornar 401 com a senha errada', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@lua.com', password: 'senha_incorreta' })
      .expect(401)
      .expect((res) => {
        expect(res.body.message).toEqual('Credenciais inválidas');
      });
  });

  it('/auth/login POST: deve retornar 404 com o email errado, ou não cadastrado', async () => {
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'errado@lua.com', password: 'senha_incorreta' })
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toEqual(
          'Nenhum usuário encontrado com o email: errado@lua.com',
        );
      });
  });

  it('/auth/login POST: ', async () => {
    const errorMessage = ['A senha deve possuir no minimo 6 caracteres'];
    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@lua.com' })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(errorMessage);
      });
  });
});
