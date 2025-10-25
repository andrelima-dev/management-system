# 🚀 Sistema de Gerenciamento de Tarefas - Jungle Tasks

## 📋 Índice

1. [Resumo Técnico Detalhado](#resumo-técnico-detalhado)
2. [Modelagem do Domínio](#modelagem-do-domínio)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Estrutura de Monorepo](#estrutura-de-monorepo)
5. [Especificação de Endpoints](#especificação-de-endpoints)
6. [Plano de Implementação](#plano-de-implementação)
7. [Configuração Docker Compose](#configuração-docker-compose)
8. [Boas Práticas](#boas-práticas)
9. [Checklist de Entrega](#checklist-de-entrega)

---

## 📖 Resumo Técnico Detalhado

### O que é Obrigatório?

Este desafio é uma aplicação **full-stack moderna** com foco em arquitetura de microserviços. Os requisitos obrigatórios são:

#### **Backend (Microserviços)**
- ✅ **API Gateway**: Ponto de entrada único para o front-end
- ✅ **Auth Service**: Autenticação JWT com access/refresh tokens
- ✅ **Tasks Service**: CRUD de tarefas com comentários e histórico
- ✅ **Notifications Service**: Notificações em tempo real via RabbitMQ

#### **Frontend**
- ✅ **React com TanStack Router**: SPA moderna e responsiva
- ✅ **Autenticação**: Login/Signup com JWT
- ✅ **CRUD de Tarefas**: Interface completa para gerenciar tarefas
- ✅ **Notificações em Tempo Real**: WebSocket integrado

#### **Infraestrutura**
- ✅ **Docker & Docker Compose**: Containers para todos os serviços
- ✅ **Monorepo com Turborepo**: Compartilhamento de código e tipos
- ✅ **PostgreSQL**: Banco de dados persistente
- ✅ **RabbitMQ**: Message broker para comunicação entre serviços

---

### Como os Microserviços Se Comunicam?

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                  │
└────────────────────┬────────────────────────────────┘
                     │ HTTP + WebSocket
                     ▼
        ┌────────────────────────────┐
        │    API GATEWAY (3000)      │
        │  - Proxy reverso           │
        │  - JWT validation          │
        │  - WebSocket relay         │
        └────────────────────────────┘
                     │
        ┌────────────┼────────────┬───────────────┐
        │            │            │               │
    HTTP │        HTTP │      HTTP │           HTTP│
        ▼            ▼            ▼               ▼
    ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌──────────────┐
    │  AUTH   │ │ TASKS   │ │NOTIF     │ │  Database    │
    │ SERVICE │ │SERVICE  │ │ SERVICE  │ │ + RabbitMQ   │
    │(3001)   │ │(3002)   │ │ (3003)   │ │              │
    └────┬────┘ └────┬────┘ └─────┬────┘ └──────────────┘
         │           │            │
         └───────────┼────────────┘
                     │
              RabbitMQ Events
          (Async Communication)
```

### Responsabilidades de Cada Serviço

**API Gateway:**
- Rotear requisições para os serviços corretos
- Validar tokens JWT
- Relayar WebSocket para notificações em tempo real
- Cache de respostas (opcional)

**Auth Service:**
- Registrar novos usuários
- Autenticar e emitir JWT
- Refresh de tokens expirados
- Validação de credenciais

**Tasks Service:**
- CRUD completo de tarefas
- Comentários em tarefas
- Histórico de alterações
- Atribuição de tarefas a usuários
- Publicar eventos (task-created, task-updated) no RabbitMQ

**Notifications Service:**
- Consumir eventos do RabbitMQ
- Enviar notificações via WebSocket
- Armazenar histórico de notificações

---

## 🏗️ Modelagem do Domínio

### Entidades Principais

#### **User**
```typescript
interface User {
  id: UUID;
  email: string;          // Único
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;       // Soft delete
}
```

#### **RefreshToken**
```typescript
interface RefreshToken {
  id: UUID;
  userId: UUID;
  token: string;          // Hash do token
  expiresAt: Date;
  createdAt: Date;
  revokedAt?: Date;       // Para revogação
}
```

#### **Task**
```typescript
interface Task {
  id: UUID;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'ARCHIVED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: Date;
  createdBy: UUID;        // FK User
  createdAt: Date;
  updatedAt: Date;
}
```

#### **TaskAssignment**
```typescript
interface TaskAssignment {
  id: UUID;
  taskId: UUID;           // FK Task
  userId: UUID;           // FK User
  assignedAt: Date;
  assignedBy: UUID;       // FK User (quem atribuiu)
}
```

#### **Comment**
```typescript
interface Comment {
  id: UUID;
  taskId: UUID;           // FK Task
  userId: UUID;           // FK User
  content: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### **TaskHistory**
```typescript
interface TaskHistory {
  id: UUID;
  taskId: UUID;           // FK Task
  changedBy: UUID;        // FK User
  changeType: 'CREATED' | 'UPDATED' | 'DELETED' | 'COMMENTED' | 'ASSIGNED';
  oldValue?: any;
  newValue?: any;
  timestamp: Date;
}
```

#### **Notification**
```typescript
interface Notification {
  id: UUID;
  userId: UUID;           // FK User
  type: 'TASK_ASSIGNED' | 'TASK_UPDATED' | 'COMMENT_ADDED' | 'TASK_COMPLETED';
  title: string;
  message: string;
  relatedTaskId?: UUID;
  read: boolean;
  createdAt: Date;
}
```

### Relacionamentos

```
User ─────┬────── RefreshToken (1:N)
          ├────── Task (1:N) [criador]
          ├────── TaskAssignment (1:N)
          ├────── Comment (1:N)
          ├────── TaskHistory (1:N)
          └────── Notification (1:N)

Task ─────┬────── Comment (1:N)
          ├────── TaskHistory (1:N)
          └────── TaskAssignment (1:N)
```

---

## 🎯 Arquitetura do Sistema

### Diagrama Lógico ASCII

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                               │
│                    React + TanStack Router                           │
│                   (Port 5173 - Vite Dev Server)                      │
└────────────────────────────────────┬─────────────────────────────────┘
                                     │
                    HTTP + WebSocket Upgrade
                                     │
┌────────────────────────────────────▼─────────────────────────────────┐
│                    API GATEWAY (NestJS)                              │
│                       Port 3000                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ • JWT Guard - Valida tokens em cada rota                    │   │
│  │ • Logging Interceptor - Log de todas as requisições         │   │
│  │ • Error Handler - Tratamento centralizado de erros          │   │
│  │ • WebSocket Gateway - Real-time notifications               │   │
│  └──────────────────────────────────────────────────────────────┘   │
└────┬────────────────────────────────────────────────────────────┬───┘
     │                                                             │
     │ HTTP                        ┌─────────────────────────────┬┘
     │ (REST)                      │ WebSocket Upgrade
     │                             │
     ▼                             ▼
┌──────────────┐          ┌─────────────────────────────────────┐
│ AUTH SERVICE │          │    MICROSERVICES LAYER              │
│  Port 3001   │          │                                     │
│              │          │ ┌──────────────┐  ┌──────────────┐ │
│ Endpoints:   │          │ │ TASKS        │  │ NOTIFICATIONS│ │
│ • POST /auth │          │ │ SERVICE      │  │ SERVICE      │ │
│   /register  │          │ │ Port 3002    │  │ Port 3003    │ │
│ • POST /auth │          │ │              │  │              │ │
│   /login     │          │ │ Endpoints:   │  │ Endpoints:   │ │
│ • POST /auth │          │ │ • GET /tasks │  │ • WS /notify │ │
│   /refresh   │          │ │ • POST /tasks│  │ • GET /notif │ │
│              │          │ │ • PUT /tasks │  │ • POST /notif│ │
│ RabbitMQ:    │          │ │ • DELETE     │  │   /mark-read │ │
│ • user.*     │          │ │ • POST /comm │  │              │ │
│              │          │ │ • GET /hist  │  │ RabbitMQ:    │ │
│              │          │ └──────────────┘  │ • task.*     │ │
│ Database:    │          │                   │   events     │ │
│ • users      │          │                   │              │ │
│ • refresh_   │          │                   │ Database:    │ │
│   tokens     │          │                   │ • notif's    │ │
└──────────────┘          │                   └──────────────┘ │
     │                    └─────────────────────────────────────┘
     │                                        │
     │                                        ▼ Consuma eventos
     │                    ┌─────────────────────────────┐
     │                    │      INFRASTRUCTURE         │
     │                    │                             │
     │        ┌───────────┼────────────────────────┐   │
     │        │           │                        │   │
     ▼        ▼           ▼                        ▼   │
  ┌─────────────────┐  ┌──────────┐  ┌────────────┐  │
  │   PostgreSQL    │  │RabbitMQ  │  │  Docker    │  │
  │   (Port 5432)   │  │(Port 5672)  │ Network    │  │
  │                 │  │(Management  └────────────┘  │
  │ • Databases     │  │ UI: 15672) │                │
  │ • Tables        │  │            │                │
  │ • Migrations    │  │ Queues:    │                │
  │                 │  │ • auth.*   │                │
  │ jungle_tasks    │  │ • task.*   │                │
  │                 │  │ • notif.*  │                │
  └─────────────────┘  └────────────┘                │
                                      └──────────────┘
```

---

## 📁 Estrutura de Monorepo

### Estrutura Ideal com Turborepo

```
management-system/
├── 📄 package.json                 # Root workspace
├── 📄 pnpm-workspace.yaml          # Definição do workspace
├── 📄 turbo.json                   # Configuração do Turborepo
├── 📄 tsconfig.base.json           # Config TS compartilhada
├── 📄 docker-compose.yml           # Orquestração dos containers
├── 📄 .dockerignore
├── 📄 .gitignore
├── 📄 README.md
│
├── 📁 apps/
│   ├── 📁 api-gateway/             # Porta 3000
│   │   ├── 📁 src/
│   │   │   ├── 📄 main.ts
│   │   │   ├── 📄 app.module.ts
│   │   │   ├── 📁 config/
│   │   │   ├── 📁 infra/
│   │   │   ├── 📁 modules/
│   │   │   │   ├── 📁 auth/
│   │   │   │   ├── 📁 tasks/
│   │   │   │   └── 📁 health/
│   │   │   └── 📁 websocket/
│   │   ├── 📄 tsconfig.json
│   │   ├── 📄 package.json
│   │   └── 📄 Dockerfile
│   │
│   ├── 📁 auth-service/            # Porta 3001
│   │   ├── 📁 src/
│   │   │   ├── 📄 main.ts
│   │   │   ├── 📄 app.module.ts
│   │   │   ├── 📁 config/
│   │   │   ├── 📁 database/
│   │   │   ├── 📁 modules/
│   │   │   │   ├── 📁 users/
│   │   │   │   ├── 📁 auth/
│   │   │   │   └── 📁 tokens/
│   │   │   └── 📁 infra/
│   │   ├── 📁 migrations/
│   │   ├── 📄 ormconfig.ts
│   │   ├── 📄 tsconfig.json
│   │   ├── 📄 package.json
│   │   └── 📄 Dockerfile
│   │
│   ├── 📁 tasks-service/           # Porta 3002
│   │   ├── 📁 src/
│   │   │   ├── 📄 main.ts
│   │   │   ├── 📄 app.module.ts
│   │   │   ├── 📁 config/
│   │   │   ├── 📁 database/
│   │   │   ├── 📁 modules/
│   │   │   │   ├── 📁 tasks/
│   │   │   │   ├── 📁 comments/
│   │   │   │   └── 📁 history/
│   │   │   ├── 📁 messaging/
│   │   │   └── 📁 infra/
│   │   ├── 📁 migrations/
│   │   ├── 📄 ormconfig.ts
│   │   ├── 📄 tsconfig.json
│   │   ├── 📄 package.json
│   │   └── 📄 Dockerfile
│   │
│   ├── 📁 notifications-service/   # Porta 3003
│   │   ├── 📁 src/
│   │   │   ├── 📄 main.ts
│   │   │   ├── 📄 app.module.ts
│   │   │   ├── 📁 modules/
│   │   │   ├── 📁 messaging/
│   │   │   └── 📁 gateway/
│   │   ├── 📄 tsconfig.json
│   │   ├── 📄 package.json
│   │   └── 📄 Dockerfile
│   │
│   └── 📁 web/                     # Porta 5173 (dev) / 80 (prod)
│       ├── 📁 src/
│       │   ├── 📄 main.tsx
│       │   ├── 📄 App.tsx
│       │   ├── 📁 pages/
│       │   │   ├── 📁 auth/
│       │   │   ├── 📁 tasks/
│       │   │   └── 📁 dashboard/
│       │   ├── 📁 components/
│       │   ├── 📁 hooks/
│       │   ├── 📁 store/
│       │   ├── 📁 services/
│       │   ├── 📁 types/
│       │   └── 📁 utils/
│       ├── 📄 vite.config.ts
│       ├── 📄 tsconfig.json
│       ├── 📄 package.json
│       ├── 📄 Dockerfile
│       └── 📄 nginx.conf
│
├── 📁 packages/                    # Código compartilhado
│   ├── 📁 types/                   # Tipos TypeScript compartilhados
│   │   ├── 📁 src/
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📁 entities/
│   │   │   ├── 📁 dtos/
│   │   │   └── 📁 events/
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   │
│   ├── 📁 utils/                   # Utilitários compartilhados
│   │   ├── 📁 src/
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📄 validators.ts
│   │   │   └── 📄 formatters.ts
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   │
│   ├── 📁 ui-kit/                  # Componentes React reutilizáveis
│   │   ├── 📁 src/
│   │   │   ├── 📄 index.ts
│   │   │   ├── 📁 Button/
│   │   │   ├── 📁 Input/
│   │   │   └── 📁 Modal/
│   │   ├── 📄 package.json
│   │   └── 📄 tsconfig.json
│   │
│   ├── 📁 tsconfig/                # Configurações TypeScript compartilhadas
│   │   ├── 📄 tsconfig.json
│   │   └── 📄 package.json
│   │
│   └── 📁 eslint-config/           # Configuração ESLint compartilhada
│       ├── 📄 index.cjs
│       └── 📄 package.json
```

### Workspace Configuration (pnpm-workspace.yaml)

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## 🔌 Especificação de Endpoints

### Auth Service (Port 3001)

#### **POST /auth/register**
```json
{
  "Request": {
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  },
  "Response": {
    "statusCode": 201,
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### **POST /auth/login**
```json
{
  "Request": {
    "email": "user@example.com",
    "password": "SecurePassword123!"
  },
  "Response": {
    "statusCode": 200,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "user@example.com",
        "firstName": "John"
      }
    }
  }
}
```

#### **POST /auth/refresh**
```json
{
  "Request": {
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "Response": {
    "statusCode": 200,
    "data": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

### API Gateway (Port 3000)

#### **GET /api/tasks** (Listar tarefas)
```json
{
  "Headers": {
    "Authorization": "Bearer <accessToken>"
  },
  "QueryParams": {
    "status": "TODO",
    "priority": "HIGH",
    "page": 1,
    "limit": 10
  },
  "Response": {
    "statusCode": 200,
    "data": {
      "items": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "title": "Implementar autenticação",
          "description": "Configurar JWT e guards",
          "status": "IN_PROGRESS",
          "priority": "HIGH",
          "dueDate": "2025-11-30T23:59:59Z",
          "createdBy": "550e8400-e29b-41d4-a716-446655440000",
          "createdAt": "2025-10-24T10:00:00Z"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
}
```

#### **POST /api/tasks** (Criar tarefa)
```json
{
  "Headers": {
    "Authorization": "Bearer <accessToken>"
  },
  "Request": {
    "title": "Implementar WebSocket",
    "description": "Adicionar real-time notifications",
    "priority": "MEDIUM",
    "dueDate": "2025-11-15T23:59:59Z"
  },
  "Response": {
    "statusCode": 201,
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "title": "Implementar WebSocket",
      "status": "TODO",
      "createdAt": "2025-10-24T10:05:00Z"
    }
  }
}
```

#### **PUT /api/tasks/:id** (Atualizar tarefa)
```json
{
  "Headers": {
    "Authorization": "Bearer <accessToken>"
  },
  "Request": {
    "status": "DONE",
    "priority": "LOW"
  },
  "Response": {
    "statusCode": 200,
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "status": "DONE",
      "priority": "LOW",
      "updatedAt": "2025-10-24T11:00:00Z"
    }
  }
}
```

#### **DELETE /api/tasks/:id** (Deletar tarefa)
```json
{
  "Headers": {
    "Authorization": "Bearer <accessToken>"
  },
  "Response": {
    "statusCode": 204
  }
}
```

#### **POST /api/tasks/:id/comments** (Adicionar comentário)
```json
{
  "Headers": {
    "Authorization": "Bearer <accessToken>"
  },
  "Request": {
    "content": "Essa tarefa requer mais validação"
  },
  "Response": {
    "statusCode": 201,
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "taskId": "550e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "content": "Essa tarefa requer mais validação",
      "createdAt": "2025-10-24T11:05:00Z"
    }
  }
}
```

#### **GET /api/tasks/:id/history** (Histórico de alterações)
```json
{
  "Headers": {
    "Authorization": "Bearer <accessToken>"
  },
  "Response": {
    "statusCode": 200,
    "data": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "taskId": "550e8400-e29b-41d4-a716-446655440001",
        "changeType": "UPDATED",
        "changedBy": "550e8400-e29b-41d4-a716-446655440000",
        "oldValue": { "status": "TODO" },
        "newValue": { "status": "IN_PROGRESS" },
        "timestamp": "2025-10-24T11:10:00Z"
      }
    ]
  }
}
```

#### **POST /api/tasks/:id/assign** (Atribuir tarefa)
```json
{
  "Headers": {
    "Authorization": "Bearer <accessToken>"
  },
  "Request": {
    "userId": "550e8400-e29b-41d4-a716-446655440005"
  },
  "Response": {
    "statusCode": 201,
    "data": {
      "id": "550e8400-e29b-41d4-a716-446655440006",
      "taskId": "550e8400-e29b-41d4-a716-446655440001",
      "userId": "550e8400-e29b-41d4-a716-446655440005",
      "assignedAt": "2025-10-24T11:15:00Z"
    }
  }
}
```

### WebSocket (Notifications)

#### **WS Connection**
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: accessToken
  }
});

// Receber notificações
socket.on('notification:new', (data) => {
  console.log('Nova notificação:', data);
  // {
  //   id: "...",
  //   type: "TASK_ASSIGNED",
  //   title: "Tarefa atribuída",
  //   message: "Você foi atribuído a 'Implementar WebSocket'",
  //   relatedTaskId: "..."
  // }
});

// Marcar notificação como lida
socket.emit('notification:mark-read', { notificationId: '...' });
```

---

## 📝 Plano de Implementação

### Fase 1: Fundação e Autenticação (Semana 1)
1. ✅ Setup do monorepo com Turborepo
2. ✅ Configuração do TypeORM e PostgreSQL
3. ✅ Modelagem do User entity
4. ✅ Endpoints de registro e login
5. ✅ JWT guards e middleware
6. ✅ Refresh token strategy

### Fase 2: Tasks CRUD (Semana 2)
7. Modelagem de Task entity
8. Endpoints de CRUD (GET, POST, PUT, DELETE)
9. Paginação e filtros
10. Validação com Zod/Class Validator

### Fase 3: Comentários e Histórico (Semana 3)
11. Modelagem de Comment entity
12. Endpoints para comentários
13. Modelagem de TaskHistory entity
14. Rastreamento automático de alterações

### Fase 4: RabbitMQ e Notificações (Semana 4)
15. Setup do RabbitMQ
16. Event listeners no Tasks Service
17. Notifications Service que consome eventos
18. Persistência de notificações no banco

### Fase 5: WebSocket em Tempo Real (Semana 5)
19. Socket.IO integration no API Gateway
20. Broadcast de eventos para clientes conectados
21. Autenticação via JWT nos sockets

### Fase 6: Frontend React (Semana 6-7)
22. Setup com Vite e TanStack Router
23. Páginas de auth (login/signup)
24. Dashboard com listagem de tarefas
25. CRUD interface para tarefas
26. Notificações em tempo real

### Fase 7: Docker e Deploy (Semana 8)
27. Dockerfiles otimizados
28. Docker Compose com todos os serviços
29. Variáveis de ambiente
30. Health checks e logging

---

## 🐳 Configuração Docker Compose

Arquivo: `docker-compose.yml`

```yaml
services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: jungle_tasks
      POSTGRES_USER: jungle
      POSTGRES_PASSWORD: jungle_pass
    ports:
      - '5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U jungle"]
      interval: 10s
      timeout: 5s
      retries: 5

  rabbitmq:
    image: rabbitmq:3.12-management
    restart: unless-stopped
    environment:
      RABBITMQ_DEFAULT_USER: jungle
      RABBITMQ_DEFAULT_PASS: jungle_pass
    ports:
      - '5672:5672'      # AMQP
      - '15672:15672'    # Management UI
    volumes:
      - rabbitmqdata:/var/lib/rabbitmq
    healthcheck:
      test: rabbitmq-diagnostics -q ping
      interval: 10s
      timeout: 5s
      retries: 5

  api-gateway:
    build:
      context: .
      dockerfile: apps/api-gateway/Dockerfile
    env_file: apps/api-gateway/.env
    depends_on:
      auth-service:
        condition: service_healthy
      tasks-service:
        condition: service_healthy
    ports:
      - '3000:3000'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  auth-service:
    build:
      context: .
      dockerfile: apps/auth-service/Dockerfile
    env_file: apps/auth-service/.env
    depends_on:
      postgres:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    ports:
      - '3001:3001'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  tasks-service:
    build:
      context: .
      dockerfile: apps/tasks-service/Dockerfile
    env_file: apps/tasks-service/.env
    depends_on:
      postgres:
        condition: service_healthy
      rabbitmq:
        condition: service_healthy
    ports:
      - '3002:3002'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3002/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  notifications-service:
    build:
      context: .
      dockerfile: apps/notifications-service/Dockerfile
    env_file: apps/notifications-service/.env
    depends_on:
      rabbitmq:
        condition: service_healthy
    ports:
      - '3003:3003'
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3003/health"]
      interval: 10s
      timeout: 5s
      retries: 5

  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - '5173:80'
    depends_on:
      - api-gateway

volumes:
  pgdata:
  rabbitmqdata:
```

### Variáveis de Ambiente Mínimas

**`.env.example` para cada serviço:**

```bash
# auth-service/.env
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=jungle_tasks
DATABASE_USER=jungle
DATABASE_PASSWORD=jungle_pass
JWT_SECRET=seu_super_secret_key_mudar_em_producao
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
RABBITMQ_URL=amqp://jungle:jungle_pass@rabbitmq:5672
```

---

## ✨ Boas Práticas

### 1. **Clean Code e DTOs**

```typescript
// ❌ ERRADO - Retornar entidade direto
@Get()
getTasks() {
  return this.tasksService.find();
}

// ✅ CORRETO - Usar DTO para exposição
@Get()
getTasks(): TaskResponseDto[] {
  const tasks = this.tasksService.find();
  return tasks.map(task => new TaskResponseDto(task));
}
```

### 2. **Validação com Zod/Class Validator**

```typescript
import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(5000).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.date().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
```

### 3. **Tratamento Centralizado de Erros**

```typescript
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = this.getStatus(exception);
    const message = this.getMessage(exception);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

### 4. **Logging Estruturado**

```typescript
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  async create(input: CreateTaskInput) {
    this.logger.log(`Creating task: ${input.title}`);
    try {
      const task = await this.repository.save(input);
      this.logger.log(`Task created with ID: ${task.id}`);
      return task;
    } catch (error) {
      this.logger.error(`Failed to create task`, error);
      throw error;
    }
  }
}
```

### 5. **Rate Limiting**

```typescript
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,    // 1 minuto
        limit: 100,    // 100 requisições
      },
    ]),
  ],
})
export class AppModule {}
```

### 6. **Testes Unitários**

```typescript
describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should create a task', async () => {
    const input: CreateTaskInput = {
      title: 'Test Task',
      priority: 'HIGH',
    };

    jest.spyOn(repository, 'save').mockResolvedValue({ id: '1', ...input } as Task);

    const result = await service.create(input);

    expect(result).toBeDefined();
    expect(result.title).toBe('Test Task');
  });
});
```

---

## ✅ Checklist de Entrega

### Backend
- [ ] Auth Service com JWT implementado
  - [ ] Registro de usuários
  - [ ] Login com access/refresh tokens
  - [ ] Refresh token strategy
  - [ ] Logout com revogação
- [ ] Tasks Service
  - [ ] CRUD completo de tarefas
  - [ ] Comentários funcionais
  - [ ] Histórico de alterações rastreado
  - [ ] Atribuição a múltiplos usuários
- [ ] Notifications Service
  - [ ] Consumo de eventos do RabbitMQ
  - [ ] Persistência de notificações
  - [ ] API de notificações
- [ ] API Gateway
  - [ ] Proxy reverso funcionando
  - [ ] JWT guard aplicado
  - [ ] WebSocket relay funcionando

### Frontend
- [ ] Autenticação
  - [ ] Página de login
  - [ ] Página de registro
  - [ ] Persistência de token
  - [ ] Refresh automático
- [ ] Dashboard de Tarefas
  - [ ] Listagem com filtros/paginação
  - [ ] Criar tarefa
  - [ ] Editar tarefa
  - [ ] Deletar tarefa
- [ ] Detalhes da Tarefa
  - [ ] Visualizar comentários
  - [ ] Adicionar comentários
  - [ ] Ver histórico
  - [ ] Atribuir a usuários
- [ ] Notificações em Tempo Real
  - [ ] WebSocket conectando
  - [ ] Notificações chegando
  - [ ] Marcar como lida

### Infraestrutura
- [ ] Docker
  - [ ] Todos os Dockerfiles criados
  - [ ] Images buildando sem erros
- [ ] Docker Compose
  - [ ] Todos os serviços subindo
  - [ ] Health checks funcionando
  - [ ] Volumes persistindo dados
  - [ ] Networking correto
- [ ] Banco de Dados
  - [ ] PostgreSQL conectando
  - [ ] Migrations rodando
  - [ ] Dados persistindo
- [ ] Message Broker
  - [ ] RabbitMQ conectando
  - [ ] Filas criadas
  - [ ] Mensagens enviadas/consumidas

### Documentação
- [ ] README atualizado
- [ ] Postman Collection exportada
- [ ] Decisões técnicas documentadas
- [ ] Trade-offs explicados
- [ ] Setup local documentado

---

## 🚀 Como Executar

### Localmente (Development)

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp apps/auth-service/.env.example apps/auth-service/.env
# Editar .env files conforme necessário

# 3. Subir infraestrutura (Docker)
docker-compose up -d postgres rabbitmq

# 4. Rodar migrations
pnpm --filter @jungle/auth-service run typeorm migration:run
pnpm --filter @jungle/tasks-service run typeorm migration:run

# 5. Rodar serviços em paralelo
pnpm run dev

# Acesso:
# - Frontend: http://localhost:5173
# - API Gateway: http://localhost:3000
# - RabbitMQ: http://localhost:15672 (jungle/jungle_pass)
# - PostgreSQL: localhost:5432
```

### Com Docker Compose (Production-like)

```bash
docker-compose up --build
```

---

## 💡 Melhorias Futuras

1. **Rate Limiting Avançado**: Usar Redis para distributed rate limiting
2. **Caching**: Implementar Redis para cache de tarefas
3. **Full-Text Search**: Elasticsearch para busca de tarefas
4. **Audit Trail**: Rastreamento completo de ações
5. **Two-Factor Auth**: Adicionar 2FA
6. **Team Support**: Suporte a times e permissões granulares
7. **File Uploads**: Anexos em tarefas/comentários
8. **Analytics**: Dashboard com métricas
9. **Mobile App**: React Native ou Flutter
10. **CI/CD**: GitHub Actions para deploy automático

---

## 📚 Recursos Úteis

- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [React Documentation](https://react.dev)
- [TanStack Router](https://tanstack.com/router)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices)
- [Turborepo](https://turbo.build/repo)

---

## 📄 Contexto Pessoal

Este projeto foi desenvolvido por um desenvolvedor em transição de suporte técnico para full-stack, com experiência em JavaScript e Python. O foco foi em consolidar conhecimentos de:

- Arquitetura de microserviços
- Autenticação e segurança JWT
- Message brokers e comunicação assíncrona
- Docker e infraestrutura
- Monorepos com Turborepo
- Boas práticas de código

### Decisões Técnicas e Trade-offs

**Por que NestJS?**
- Framework maduro para microserviços
- Built-in dependency injection
- Segurança integrada (guards, interceptors)
- Excelente documentação

**Por que TypeORM + PostgreSQL?**
- ORM robusta e escalável
- PostgreSQL é production-ready
- Migrations automáticas
- Relações complexas suportadas

**Por que RabbitMQ?**
- Padrão industria para message broker
- Durabilidade de mensagens
- Múltiplos padrões de routing
- Fácil monitoramento

**Por que Turborepo?**
- Sharing de tipos e utilitários
- Cache inteligente de builds
- Monorepo sem complexidade

**Por que React + TanStack Router?**
- SPA moderna e responsiva
- Router client-side avançado
- Ecosystem rico de bibliotecas
- Fácil de aprender e manter

---

Made with ❤️ for learning and growth.
