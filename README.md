<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Lua Project API

## 📖 Sobre o Projeto

O **Lua Project** é uma API RESTful desenvolvida para sustentar a plataforma de e-commerce da **Lua Cosméticos**.

A **Lua Cosméticos** é uma marca que tem como propósito democratizar o autocuidado, oferecendo **cosméticos naturais de forma acessível**. Esta API gerencia o catálogo de produtos, usuários e o fluxo de pedidos, garantindo uma experiência de compra eficiente e escalável.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as seguintes tecnologias:

- [NestJS](https://nestjs.com/) - Framework Node.js para aplicações escaláveis
- [TypeScript](https://www.typescriptlang.org/) - Superset do JavaScript com tipagem estática
- [TypeORM](https://typeorm.io/) - ORM para interação com o banco de dados
- [MySQL](https://www.mysql.com/) - Banco de Dados Relacional
- [Jest](https://jestjs.io/) - Framework de Testes

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/en/) (Versão LTS recomendada)
- [MySQL](https://www.mysql.com/) (Instância local ou remota)

## 🚀 Instalação e Configuração

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/seu-usuario/lua-project.git](https://github.com/seu-usuario/lua-project.git)
    cd lua-project
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo `.env` na raiz do projeto seguindo o modelo abaixo:

    ```env
    # Exemplo de configuração
    DB_HOST=localhost
    DB_PORT=3306
    DB_USERNAME=root
    DB_PASSWORD=sua_senha
    DB_DATABASE=lua_cosmeticos_db
    ```

## ▶️ Executando a Aplicação

```bash
npm run start:dev
```
