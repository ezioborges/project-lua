<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Lua Project API

## 📖 Sobre o Projeto

O **Lua Project** é uma API RESTful desenvolvida para sustentar a plataforma de e-commerce da **Lua Cosméticos**.

A **Lua Cosméticos** é uma marca que tem como propósito democratizar o autocuidado, oferecendo **cosméticos naturais de forma acessível**. Esta API gerencia o catálogo de produtos, usuários e o fluxo de pedidos, garantindo uma experiência de compra eficiente, segura e escalável.

---

## ✨ Funcionalidades e Regras de Negócio

O projeto conta com regras de negócio refinadas para garantir a integridade e segurança dos dados:

- **Gestão de Usuários (CRUD):**
  - **Validação de Unicidade:** Verificação automática se **Email** e **CPF** já estão cadastrados no sistema.
  - **Sanitização de Dados:** Formatação automática de dados (ex: CPF armazena apenas números).
  - **Segurança:** As senhas dos usuários são transformadas em **hash** utilizando `bcrypt` antes da persistência no banco.
- **Validação de Dados (DTOs):**
  - Utilização de **Class Validator** e **Class Transformer** para garantir que os dados de entrada (payload) estejam no formato correto (tamanho do CPF, formato de email, campos obrigatórios, etc).
  - Tratamento global de erros para campos inválidos.

- **Arquitetura e Escalabilidade:**
  - **Paginação:** Implementada nativamente nas listagens para suportar o crescimento da base de dados.
  - **Tratamento de Erros:** Uso de `NotFoundException` e `ConflictException` e filtros de exceção do NestJS para respostas HTTP semânticas e claras.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias e bibliotecas:

- **Core:** [NestJS](https://nestjs.com/) (Framework Node.js)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **ORM:** [TypeORM](https://typeorm.io/)
- **Banco de Dados:** [MySQL](https://www.mysql.com/)
- **Testes:** [Jest](https://jestjs.io/)
- **Segurança:** [Bcrypt](https://www.npmjs.com/package/bcrypt) (Hash de senhas)
- **Validação:** [Class Validator](https://github.com/typestack/class-validator) & [Class Transformer](https://github.com/typestack/class-transformer)

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/en/) (Versão LTS recomendada)
- [MySQL](https://www.mysql.com/) (Instância local ou remota)

---

## 🚀 Instalação e Configuração

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/seu-usuario/lua-project.git
    cd lua-project
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto seguindo o modelo abaixo:

    ```env
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=sua_senha
    DB_DATABASE=lua_cosmeticos_db
    ```

---

## ▶️ Executando a Aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod
```
