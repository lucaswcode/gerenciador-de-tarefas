# Gerenciador de Tarefas

## Descrição técnica
Este projeto é uma API REST em Node.js com TypeScript para gerenciamento de usuários, equipes e tarefas. A aplicação permite criar contas, organizar membros em equipes, atribuir tarefas e acompanhar alterações de status.

## Bibliotecas utilizadas
- Express: framework HTTP para criar rotas e endpoints da API.
- Prisma: ORM usado para modelar o banco de dados e executar operações com PostgreSQL.
- @prisma/client e @prisma/adapter-pg: cliente Prisma e adaptador para conexão com PostgreSQL.
- PostgreSQL: banco de dados relacional para persistência dos dados.
- jsonwebtoken: geração e validação de tokens JWT para autenticação.
- bcrypt: hash de senhas.
- zod: validação de entradas e variáveis de ambiente.
- Jest e Supertest: testes automatizados da API.
- tsx: execução de código TypeScript em ambiente de desenvolvimento.

## Padrão de projeto adotado
O projeto segue uma organização em camadas e por domínio, com separação entre:
- rotas: definição dos endpoints;
- controllers: tratamento das requisições;
- middlewares: autenticação e tratamento de erros;
- database: acesso aos dados via Prisma;
- utils e configs: helpers e configurações compartilhadas.

Essa estrutura facilita a manutenção e a evolução da API conforme novos recursos forem adicionados.

## Setup e configuração
### 1. Instalar dependências
```bash
pnpm install
```

### 2. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com:
```env
PORT=3333
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/db-gerenciador-tarefas
JWT_SECRET=seu-secreto-aqui
```

### 3. Subir o banco de dados
```bash
docker compose up -d
```

### 4. Aplicar migrações do Prisma
```bash
pnpm prisma migrate dev
```

### 5. Executar a aplicação
```bash
pnpm dev
```
A API ficará disponível em `http://localhost:3333`.

### 6. Executar testes (opcional)
```bash
pnpm test:dev
```
