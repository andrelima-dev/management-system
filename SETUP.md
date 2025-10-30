# 📋 SETUP COMPLETO - Sistema de Gestão de Tarefas

**Desafio**: Jungle Gaming Full-Stack Júnior  
**Data**: Outubro 2025  
**Status**: ✅ Pronto para rodar

---

## 🚀 Quick Start (3 minutos)

### Prerequisitos
- **Node.js 20+**: `node --version`
- **pnpm**: `npm install -g pnpm@9`
- **Docker & Docker Compose**: `docker --version && docker-compose --version`
- **PostgreSQL** (local) OU use Docker
- **RabbitMQ** (local) OU use Docker

### Opção A: Com Docker Compose (RECOMENDADO)

```bash
# 1. Clone e instale dependências
git clone <repo>
cd management-system
pnpm install

# 2. Inicie todos os serviços
docker-compose up -d

# 3. Aguarde 15 segundos para banco ficar pronto
sleep 15

# 4. Rode as migrações
pnpm run migration:run

# 5. Acesse
# Frontend: http://localhost:5174
# API Gateway: http://localhost:3000
# RabbitMQ Admin: http://localhost:15672 (admin/admin)
# PostgreSQL: localhost:5432

# 6. Para parar
docker-compose down
```

### Opção B: Setup Local (Dev)

```bash
# 1. Clone e instale dependências
git clone <repo>
cd management-system
pnpm install

# 2. Criar banco de dados PostgreSQL
psql -U postgres -h localhost <<EOF
CREATE DATABASE challenge_db;
CREATE USER jungle WITH PASSWORD 'password';
ALTER ROLE jungle WITH PASSWORD 'password';
ALTER ROLE jungle CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE challenge_db TO jungle;
EOF

# 3. Iniciar RabbitMQ (opção: usar Docker apenas para RabbitMQ)
docker run -d --name rabbitmq \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3.13-management-alpine

# 4. Copiar variáveis de ambiente
cp apps/web/.env.example apps/web/.env
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/auth-service/.env.example apps/auth-service/.env
cp apps/tasks-service/.env.example apps/tasks-service/.env
cp apps/notifications-service/.env.example apps/notifications-service/.env

# 5. Rodar migrações (AUTH primeiro, depois TASKS)
pnpm --filter @jungle/auth-service run migration:run
pnpm --filter @jungle/tasks-service run migration:run

# 6. Rodar em paralelo (em terminais separados ou use tmux/screen)
# Terminal 1:
pnpm --filter @jungle/auth-service run dev

# Terminal 2:
pnpm --filter @jungle/tasks-service run dev

# Terminal 3:
pnpm --filter @jungle/api-gateway run dev

# Terminal 4:
pnpm --filter @jungle/web run dev

# 7. Acesse
# Frontend: http://localhost:5174
# API Gateway: http://localhost:3000
```

---

## 📁 Estrutura do Projeto

```
management-system/
├── apps/
│   ├── web/                           # Frontend React (Vite)
│   │   ├── src/
│   │   ├── .env.example              # Variáveis de ambiente
│   │   └── Dockerfile
│   │
│   ├── api-gateway/                   # NestJS HTTP + WebSocket
│   │   ├── src/
│   │   │   ├── app.module.ts
│   │   │   ├── main.ts
│   │   │   ├── config/               # Configuração
│   │   │   ├── modules/              # Controllers/Services
│   │   │   └── infra/                # Microservices integration
│   │   ├── .env.example
│   │   └── Dockerfile
│   │
│   ├── auth-service/                  # NestJS Microserviço (RMQ)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── users/            # UserEntity
│   │   │   │   └── tokens/           # RefreshTokenEntity
│   │   │   └── database/
│   │   │       ├── data-source.ts    # TypeORM DataSource
│   │   │       └── typeorm.config.ts # Configuração
│   │   ├── migrations/                # TypeORM Migrations
│   │   │   ├── 1700000001000-CreateUsersTable.ts
│   │   │   └── 1700000002000-CreateRefreshTokensTable.ts
│   │   ├── .env.example
│   │   └── Dockerfile
│   │
│   ├── tasks-service/                 # NestJS Microserviço (RMQ)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── tasks/            # TaskEntity
│   │   │   │   ├── comments/         # CommentEntity
│   │   │   │   └── history/          # HistoryEntryEntity
│   │   │   └── database/
│   │   ├── migrations/                # TypeORM Migrations
│   │   │   ├── 1700000003000-CreateTasksTable.ts
│   │   │   ├── 1700000004000-CreateCommentsTable.ts
│   │   │   └── 1700000005000-CreateTaskHistoryTable.ts
│   │   ├── .env.example
│   │   └── Dockerfile
│   │
│   ├── notifications-service/         # NestJS Microserviço (RMQ + WebSocket)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── messaging/        # RabbitMQ Consumer
│   │   │   │   ├── realtime/         # WebSocket Gateway
│   │   │   │   └── notifications/    # NotificationEntity
│   │   │   └── database/
│   │   ├── migrations/
│   │   ├── .env.example
│   │   └── Dockerfile
│
├── packages/
│   ├── types/                         # Tipos TypeScript compartilhados
│   │   ├── microservices.dto.ts      # DTOs comuns
│   │   └── microservices.patterns.ts # RabbitMQ Patterns
│   ├── utils/
│   ├── ui-kit/
│   ├── tsconfig/
│   └── eslint-config/
│
├── docker-compose.yml                 # Orquestração de containers
├── turbo.json                         # Build/dev orchestration
├── pnpm-workspace.yaml                # Monorepo config
├── package.json                       # Root scripts
└── README.md                          # Documentação
```

---

## 🔐 Credenciais Padrão (Para Teste)

```
Email: andre@teste.com
Senha: 12345678
```

Para criar novos usuários, use o endpoint `/api/auth/register`.

---

## 📚 Scripts Principais

```bash
# Desenvolvimento
pnpm run dev              # Inicia TODOS os serviços em paralelo

# Build
pnpm run build            # Build de todos os packages

# Linting
pnpm run lint             # ESLint em todos os packages
pnpm run format           # Prettier

# Database & Migrations
pnpm run migration:run    # Rodar migrações (Auth → Tasks)
pnpm run migration:revert # Reverter última migração

# Serviços Individuais
pnpm --filter @jungle/web run dev
pnpm --filter @jungle/api-gateway run dev
pnpm --filter @jungle/auth-service run dev
pnpm --filter @jungle/tasks-service run dev
pnpm --filter @jungle/notifications-service run dev
```

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                       │
│            http://localhost:5174 (React App)                 │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP REST + WebSocket
                         ▼
        ┌────────────────────────────────────┐
        │      API GATEWAY (NestJS HTTP)     │
        │      http://localhost:3000         │
        │  - JWT Validation                  │
        │  - Rate Limiting (10 req/seg)      │
        │  - WebSocket Gateway               │
        │  - Swagger: /api/docs              │
        └────────────────┬───────────────────┘
                         │ AMQP (RabbitMQ)
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────▼────┐      ┌───▼─────┐   ┌───▼─────────────┐
    │   AUTH   │      │  TASKS  │   │ NOTIFICATIONS  │
    │ SERVICE  │      │ SERVICE │   │    SERVICE     │
    │ :3001    │      │  :3002  │   │     :3003      │
    └────┬─────┘      └───┬─────┘   └───┬────────────┘
         │                │             │
         └────────────────┼─────────────┘
                          │ SQL
                  ┌───────▼────────┐
                  │   PostgreSQL   │
                  │  localhost:5432│
                  │ challenge_db   │
                  └────────────────┘

    Message Broker: RabbitMQ (localhost:5672)
    Admin Panel: http://localhost:15672
```

### Fluxo de Comunicação

1. **Cliente** → API Gateway (REST API)
2. **API Gateway** → Microserviços (RabbitMQ via ClientProxy)
3. **Microserviços** ↔ Banco de Dados (TypeORM)
4. **Tasks Service** → Publica eventos (RabbitMQ Event Pattern)
5. **Notifications Service** → Consome eventos + WebSocket
6. **WebSocket** → Cliente (Notificações em tempo real)

---

## 🔌 Endpoints HTTP

### Autenticação
```bash
POST   /api/auth/register         # Criar conta
POST   /api/auth/login            # Login
POST   /api/auth/refresh          # Renovar token
```

### Tarefas
```bash
GET    /api/tasks                 # Listar (com filtros e paginação)
POST   /api/tasks                 # Criar
GET    /api/tasks/:id             # Detalhe
PUT    /api/tasks/:id             # Atualizar
DELETE /api/tasks/:id             # Deletar
```

### Comentários
```bash
POST   /api/tasks/:id/comments    # Criar comentário
GET    /api/tasks/:id/comments    # Listar comentários
```

---

## 📡 WebSocket Events

**Cliente escuta:**
```
task:created       # Nova tarefa criada
task:updated       # Tarefa atualizada
comment:new        # Novo comentário
```

**Cliente emite:**
```
ping               # Keep-alive
disconnect         # Desconecta
```

---

## 🛠️ Troubleshooting

### ❌ Migrations falhando

```bash
# Erro: "Cannot find module 'src/database/data-source.ts'"
# Solução: Certifique-se que ts-node está instalado
pnpm install ts-node --save-dev

# Erro: "migration:run: command not found"
# Solução: Execute dentro do serviço
pnpm --filter @jungle/auth-service run migration:run
```

### ❌ Gateway retorna erro 400

```bash
# Erro: "Auth Service não responde"
# Solução 1: Verificar se RabbitMQ está rodando
docker ps | grep rabbitmq

# Solução 2: Checar logs do Gateway
pnpm --filter @jungle/api-gateway run dev
# Procure por "Error" ou "Timeout"

# Solução 3: Certificar que Auth Service está rodando
pnpm --filter @jungle/auth-service run dev
```

### ❌ WebSocket não conecta

```bash
# Erro: "WebSocket connection failed"
# Solução: Verificar URL de WebSocket no frontend

# apps/web/.env
VITE_WS_URL=http://localhost:3000  # Deve apontar para Gateway

# Verificar logs do Gateway
docker logs api-gateway
```

### ❌ Banco de dados vazio

```bash
# Problema: Tabelas não foram criadas
# Solução: Rodar migrações

pnpm run migration:run

# Se ainda não funcionar, verificar:
docker logs db
# ou
psql -U jungle -d challenge_db -h localhost
# \dt (listar tabelas)
```

---

## 🧪 Testando Manualmente

### 1. Registrar Usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456",
    "displayName": "Test User"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123456"
  }'

# Resposta:
# {
#   "accessToken": "eyJhbGc...",
#   "refreshToken": "eyJhbGc...",
#   "user": { "id": "uuid", "email": "test@example.com" }
# }
```

### 3. Criar Tarefa
```bash
export TOKEN="seu-access-token"

curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar feature X",
    "description": "Descrição da tarefa",
    "priority": "HIGH",
    "dueDate": "2025-12-31T23:59:59Z"
  }'
```

### 4. Listar Tarefas
```bash
curl -X GET "http://localhost:3000/api/tasks?page=1&size=20" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Variáveis de Ambiente Obrigatórias

### Web
```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

### API Gateway
```
PORT=3000
RABBITMQ_URL=amqp://guest:guest@localhost:5672
JWT_ACCESS_PUBLIC_KEY=<public-key>
```

### Auth Service
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/challenge_db
JWT_ACCESS_SECRET=access-secret-key
JWT_REFRESH_SECRET=refresh-secret-key
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

### Tasks Service
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/challenge_db
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

### Notifications Service
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/challenge_db
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

---

## ✅ Checklist de Requisitos (Desafio)

### 🧱 Requisitos Funcionais

- [x] **Autenticação** - JWT com registro/login, hash argon2, tokens access/refresh
- [x] **CRUD Tarefas** - Completo com campos: título, descrição, prazo, prioridade, status
- [x] **Atribuição Múltipla** - Múltiplos usuários por tarefa
- [x] **Comentários** - Criar e listar em cada tarefa
- [x] **Histórico** - Audit log de alterações
- [x] **Notificações** - Eventos em RabbitMQ + WebSocket
- [x] **Docker Compose** - Tudo orquestrado

### 🧭 Frontend

- [x] React + TanStack Router
- [x] shadcn/ui (Button, Input, Dialog, Card, Skeleton, Select, Textarea)
- [x] Tailwind CSS
- [x] Zustand + localStorage
- [x] react-hook-form + Zod
- [x] Login/Register
- [x] Lista com filtros e busca
- [x] Detalhe com comentários
- [x] WebSocket notificações
- [x] Toast notifications

### 🛠️ Backend

- [x] NestJS + TypeORM + PostgreSQL
- [x] JWT Guards + Passport
- [x] Swagger (`/api/docs`)
- [x] DTOs + Validators
- [x] Microserviços + RabbitMQ
- [x] WebSocket Gateway
- [x] Migrations
- [x] Rate limiting

### 🐳 Infraestrutura

- [x] Dockerfile para todos os serviços
- [x] docker-compose.yml
- [x] Volumes para persistência
- [x] Networks configuradas

---

## 🕒 Tempo de Setup

| Fase | Tempo |
|------|-------|
| Clone + Install | 2 min |
| Docker Compose Up | 3 min |
| Migrations | 1 min |
| **Total** | **6 min** |

---

## 📧 Dúvidas?

Consulte a auditoria em `AUDITORIA_DESAFIO.md` para problemas específicos ou a documentação de requisitos em `README.md`.

---

**Última atualização**: 29 de outubro de 2025  
**Status**: ✅ Pronto para submissão

