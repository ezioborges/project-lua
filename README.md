<p align="center">
  <img src="docs/moon-waning-left.svg" width="170" alt="Lua minguante" style="display:block; margin:0 auto;" />
</p>

<h1 align="center">Lua Project API</h1>

<p align="center">
  API REST para o ecossistema Lua Cosmeticos com autenticacao JWT, controle de perfis e modulos de dominio.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/TypeORM-0.3-E83524?logo=typeorm&logoColor=white" alt="TypeORM" />
  <img src="https://img.shields.io/badge/JWT-Auth-black" alt="JWT" />
</p>

---

## Sumario

- [Visao Geral](#visao-geral)
- [Quick Start](#quick-start)
- [Stack Tecnologica](#stack-tecnologica)
- [Arquitetura](#arquitetura)
- [Configuracao de Ambiente](#configuracao-de-ambiente)
- [Banco com Docker](#banco-com-docker)
- [Execucao](#execucao)
- [Swagger](#swagger)
- [Seed de Dados](#seed-de-dados)
- [Autenticacao e Autorizacao](#autenticacao-e-autorizacao)
- [Modulos e Rotas](#modulos-e-rotas)
- [Scripts](#scripts)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Troubleshooting](#troubleshooting)

## Visao Geral

Principais capacidades da API:

- CRUD de usuarios com validacoes de negocio (email e CPF unicos).
- Login com JWT (access token e refresh token).
- Controle de acesso por perfil (admin, client, guest) em rotas protegidas.
- CRUD com soft delete e restauracao em modulos de dominio.
- Validacao global de payload com ValidationPipe.
- Documentacao de endpoints via Swagger.

> [!NOTE]
> A API usa tentativa automatica de porta: inicia em PORT (padrao 3333) e sobe para a proxima disponivel quando necessario.

## Quick Start

```bash
npm install
docker compose up -d
npm run start:dev
```

Abra no navegador:

- API: http://localhost:3333
- Swagger: http://localhost:3333/api/docs

## Stack Tecnologica

| Camada    | Tecnologia                          |
| --------- | ----------------------------------- |
| Runtime   | Node.js                             |
| Framework | NestJS                              |
| Linguagem | TypeScript                          |
| ORM       | TypeORM                             |
| Banco     | MySQL 8                             |
| Auth      | JWT + bcrypt                        |
| Validacao | class-validator + class-transformer |
| Testes    | Jest + Supertest                    |

## Arquitetura

- Arquitetura modular por dominio.
- Separacao entre controller, service e providers.
- Persistencia via TypeORM com entidades e relacionamentos.
- Configuracao centralizada com @nestjs/config.

## Configuracao de Ambiente

Crie um arquivo .env na raiz do projeto:

```env
# App
PORT=3333

# Banco
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha
DB_DATABASE=lua_cosmeticos_db
DB_SYNCHRONIZE=true
DB_LOGGING=true

# JWT
JWT_SECRET=dev_jwt_secret_change_me
JWT_REFRESH_SECRET=dev_jwt_refresh_secret_change_me
JWT_EXPIRES_IN=1h
```

## Banco com Docker

O projeto possui docker-compose para MySQL 8:

```bash
docker compose up -d
```

Configuracao atual:

| Item            | Valor             |
| --------------- | ----------------- |
| Container       | lua_cosmeticos_db |
| Porta host      | 3307              |
| Porta container | 3306              |
| Database        | lua_cosmeticos_db |
| Usuario         | root              |

Se usar o compose sem alterar nada:

```env
DB_HOST=localhost
DB_PORT=3307
DB_USERNAME=root
DB_PASSWORD=senha_secreta_root
DB_DATABASE=lua_cosmeticos_db
```

## Execucao

### Desenvolvimento

```bash
npm run start:dev
```

### Build e producao

```bash
npm run build
npm run start:prod
```

## Swagger

Com a API no ar:

http://localhost:3333/api/docs

## Seed de Dados

O seed limpa a tabela de usuarios e recria usuarios padrao:

```bash
npm run seed
```

Usuarios criados:

| Perfil | Email          | Senha  |
| ------ | -------------- | ------ |
| admin  | admin@lua.com  | 123456 |
| client | client@lua.com | 123456 |
| guest  | guest@lua.com  | 123456 |

## Autenticacao e Autorizacao

Fluxo basico:

1. Login em POST /auth/login.
2. Recebe access_token e refresh_token.
3. Envia Authorization: Bearer <access_token> nas rotas protegidas.
4. Renova token com POST /auth/refresh passando refresh_token no body.

Exemplo de login:

```bash
curl -X POST http://localhost:3333/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lua.com","password":"123456"}'
```

## Modulos e Rotas

| Modulo      | Base path    |
| ----------- | ------------ |
| Auth        | /auth        |
| Users       | /users       |
| Products    | /products    |
| Categories  | /categories  |
| Ingredients | /ingredients |
| Suppliers   | /suppliers   |
| Recipes     | /recipes     |

> [!TIP]
> Rotas de restore estao disponiveis via PATCH em varios modulos.

## Scripts

| Categoria | Comando             | Descricao              |
| --------- | ------------------- | ---------------------- |
| App       | npm run start       | sobe a app             |
| App       | npm run start:dev   | sobe com watch         |
| App       | npm run start:debug | sobe com debug         |
| Build     | npm run build       | gera dist              |
| Build     | npm run start:prod  | executa dist/main      |
| Qualidade | npm run lint        | lint com autofix       |
| Qualidade | npm run format      | formatacao Prettier    |
| Testes    | npm run test        | unitarios              |
| Testes    | npm run test:watch  | modo watch             |
| Testes    | npm run test:cov    | cobertura              |
| Testes    | npm run test:e2e    | end-to-end             |
| Dados     | npm run seed        | popula usuarios padrao |

## Testes

```bash
npm run test
npm run test:e2e
npm run test:cov
```

> [!IMPORTANT]
> Os testes E2E de autenticacao dependem de usuarios existentes no banco.

## Estrutura do Projeto

```text
src/
  Auth/
  Categories/
  Ingredients/
  Products/
  Recipe/
  RecipeIngredient/
  Suppliers/
  Users/
  app.module.ts
  main.ts
  seed.ts
test/
```

## Troubleshooting

### Erro de conexao com banco

- confira DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD e DB_DATABASE no .env
- se estiver usando Docker Compose, lembre que a porta no host e 3307

### Porta da API em uso

- a aplicacao tenta automaticamente a proxima porta
- verifique o log do bootstrap para a porta final

### 401 em rotas protegidas

- valide o header Authorization com Bearer
- confirme se o access token nao expirou
- gere novo access token via /auth/refresh

### Seed falhou

- confirme conexao com banco
- garanta que as tabelas foram criadas (DB_SYNCHRONIZE=true em dev)
