import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import request from 'supertest';
import { DataSource } from 'typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  // Criar variveis para guardar os tokens
  let adminToken: string;
  let clientToken: string;
  let guestToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();

    // Ativar o ValidationPipe para funcionar o teste 4
    app.useGlobalPipes(new ValidationPipe({ stopAtFirstError: true }));

    await app.init();

    // depois de ativar o app, fazer os logins
    const responseAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@lua.com', password: '123456' });

    adminToken = responseAdmin.body.userLog.access_token;

    const responseClient = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'client@lua.com', password: '123456' });

    clientToken = responseClient.body.userLog.access_token;

    const responseGuest = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'guest@lua.com', password: '123456' });

    guestToken = responseGuest.body.userLog.access_token;
  });

  afterAll(async () => {
    // Pega a conexão do banco e força a destuição
    const dataSource = app.get(DataSource);
    await dataSource.destroy();

    await app.close();
  });

  it('/users (GET) - Admin deve conseguir listar usuários', async () => {
    return request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data);
      });
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
