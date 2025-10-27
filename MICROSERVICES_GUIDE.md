# 🔄 Guia de Migração para NestJS Microservices

## Visão Geral da Arquitetura Implementada

Este projeto foi refatorado para usar **NestJS Microservices** com **RabbitMQ** como transportador de mensagens, implementando um padrão de arquitetura distribuída e escalável.

### Diagrama da Arquitetura

```
┌──────────────────┐
│   Cliente Web    │
│   (React)        │
└────────┬─────────┘
         │ HTTP/REST
         ▼
┌────────────────────────────┐
│   API Gateway (NestJS)     │◄──┐ Híbrido
│   Port 3000                │   │ HTTP + RabbitMQ Client
└────────┬────────────────────┘   │
         │ AMQP (RabbitMQ)        │
         │                        │
    ┌────┴──────┬──────────┬──────┴──────┐
    │            │          │             │
    ▼            ▼          ▼             ▼
┌────────┐  ┌────────┐  ┌──────────┐  ┌─────────────┐
│ Auth   │  │ Tasks  │  │Notifs    │  │ RabbitMQ    │
│:3001   │  │ :3002  │  │ :3003    │  │ Message     │
│        │  │        │  │          │  │ Broker      │
└────────┘  └────────┘  └──────────┘  └─────────────┘
    │            │          │
    └────────────┼──────────┘
                 │
         ┌───────▼────────┐
         │  PostgreSQL    │
         │  :5432         │
         └────────────────┘
```

## Componentes da Arquitetura

### 1. **API Gateway (HTTP + RabbitMQ Client)**
- **Port**: 3000
- **Tipo**: Aplicação NestJS Express tradicional (não é microservice)
- **Responsabilidade**: 
  - Receber requisições HTTP dos clientes
  - Comunicar com microserviços via `ClientProxy`
  - Validação de JWT
  - Roteamento inteligente de requisições

### 2. **Auth Microservice (RabbitMQ)**
- **Port**: Não escuta porta HTTP
- **Fila RabbitMQ**: `jungle_auth_service`
- **Tipo**: `createMicroservice()` com `Transport.RMQ`
- **Message Patterns**:
  - `auth.user.register` - Registrar novo usuário
  - `auth.user.login` - Fazer login
  - `auth.token.refresh` - Renovar token
  - `auth.token.validate` - Validar token
  - `auth.user.get_by_id` - Buscar usuário por ID
  - `auth.user.get_by_email` - Buscar usuário por email

### 3. **Tasks Microservice (RabbitMQ)**
- **Port**: Não escuta porta HTTP
- **Fila RabbitMQ**: `jungle_tasks_service`
- **Tipo**: `createMicroservice()` com `Transport.RMQ`
- **Message Patterns**:
  - `tasks.task.create` - Criar tarefa
  - `tasks.task.get_by_id` - Obter tarefa
  - `tasks.task.update` - Atualizar tarefa
  - `tasks.task.delete` - Deletar tarefa
  - `tasks.task.get_by_user` - Listar tarefas do usuário
  - `tasks.task.update_status` - Alterar status da tarefa
  - `tasks.comment.create` - Criar comentário
  - `tasks.comment.get_by_task` - Listar comentários da tarefa

### 4. **Notifications Microservice (RabbitMQ)**
- **Port**: Não escuta porta HTTP
- **Fila RabbitMQ**: `jungle_notifications_service`
- **Tipo**: `createMicroservice()` com `Transport.RMQ`
- **Message Patterns** (Request/Response):
  - `notifications.notification.send` - Enviar notificação
  - `notifications.notification.get_by_user` - Obter notificações do usuário
  - `notifications.notification.mark_as_read` - Marcar como lida
- **Event Patterns** (Pub/Sub):
  - `user.created` - Usuário criado
  - `task.created` - Tarefa criada
  - `task.updated` - Tarefa atualizada
  - `task.deleted` - Tarefa deletada
  - `task.status_changed` - Status da tarefa mudou
  - `comment.created` - Comentário criado

## Padrões de Comunicação

### 1. **Request/Response (Message Patterns)**
Usado quando o gateway precisa de uma resposta imediata:

```typescript
// No controller do microservice
@MessagePattern(AUTH_PATTERNS.USER_LOGIN)
async login(@Payload() dto: LoginUserDto) {
  return this.authService.login(dto);
}

// No gateway
async loginUser(dto: LoginUserDto) {
  const result = await firstValueFrom(
    this.authService.send(AUTH_PATTERNS.USER_LOGIN, dto).pipe(
      timeout(30000)
    )
  );
  return result;
}
```

### 2. **Publish/Subscribe (Event Patterns)**
Usado para eventos assíncronos entre serviços:

```typescript
// Publicador (ex: Tasks Service)
await this.messagingService.publish('task.created', { taskId: created.id });

// Assinante (ex: Notifications Service)
@EventPattern(EVENTS.TASK_CREATED)
async onTaskCreated(@Payload() data: any) {
  // Enviar notificação para o usuário
}
```

## Instalação e Setup

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose
- pnpm (ou npm/yarn)

### Passo 1: Instalar Dependências
```bash
pnpm install
```

### Passo 2: Configurar Variáveis de Ambiente
Cada serviço precisa de um arquivo `.env` com:

```env
RABBITMQ_URL=amqp://guest:guest@localhost:5672
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=tasks
POSTGRES_USER=jungle
POSTGRES_PASSWORD=jungle_pass
JWT_ACCESS_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### Passo 3: Executar com Docker Compose
```bash
docker-compose up -d
```

### Passo 4: Executar Migrações
```bash
# Auth Service
cd apps/auth-service
pnpm run migration:run

# Tasks Service
cd ../tasks-service
pnpm run migration:run
```

## Começando a Usar

### 1. Registrar Novo Usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "12345678",
    "displayName": "John Doe"
  }'
```

### 2. Fazer Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "12345678"
  }'
```

### 3. Criar Tarefa (Requer JWT)
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Implementar feature X",
    "description": "Descrição da tarefa",
    "priority": "high"
  }'
```

## Escalabilidade

Um dos principais benefícios dos microserviços é a escalabilidade:

```bash
# Executar múltiplas instâncias do Auth Service
docker run -e RABBITMQ_URL=amqp://localhost:5672 \
           jungle/auth-service:latest &
docker run -e RABBITMQ_URL=amqp://localhost:5672 \
           jungle/auth-service:latest &

# RabbitMQ automaticamente distribuirá as mensagens entre as instâncias
```

## Monitoramento RabbitMQ

Acesse o dashboard de gerenciamento do RabbitMQ:
- **URL**: http://localhost:15672
- **Usuário**: jungle
- **Senha**: jungle_pass

## Estrutura de Pastas

```
apps/
├── api-gateway/
│   ├── src/
│   │   ├── infra/
│   │   │   └── microservices/
│   │   │       ├── microservices.module.ts        # Configuração ClientProxy
│   │   │       └── microservices-client.service.ts # Service para chamar microserviços
│   │   └── modules/
│   │       ├── auth/
│   │       ├── tasks/
│   │       └── notifications/
│   └── main.ts                                     # HTTP Server
│
├── auth-service/
│   ├── src/
│   │   ├── modules/
│   │   │   └── auth/
│   │   │       └── auth.controller.ts              # @MessagePattern decorators
│   │   └── main.ts                                 # createMicroservice(Transport.RMQ)
│
├── tasks-service/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── tasks/
│   │   │   │   ├── tasks.controller.ts             # REST endpoints
│   │   │   │   └── tasks.microservice.controller.ts # @MessagePattern decorators
│   │   │   └── comments/
│   │   └── main.ts                                 # createMicroservice(Transport.RMQ)
│
└── notifications-service/
    ├── src/
    │   ├── modules/
    │   │   └── notifications/
    │   │       └── notifications.microservice.controller.ts # @MessagePattern + @EventPattern
    │   └── main.ts                                # createMicroservice(Transport.RMQ)

packages/
└── types/
    ├── microservices.patterns.ts    # Constantes de message patterns
    ├── microservices.dto.ts         # DTOs para comunicação
    └── rabbitmq.config.ts           # Configuração centralizada RabbitMQ
```

## Troubleshooting

### Erro: "Cannot connect to RabbitMQ"
1. Verificar se RabbitMQ está rodando: `docker ps`
2. Verificar se a URL de conexão está correta
3. Logs: `docker logs <container-name>`

### Erro: "Timeout waiting for response"
1. Aumentar o timeout em `microservices-client.service.ts`
2. Verificar se o microservice está rodando
3. Verificar logs do microservice

### Erro: "Message timed out"
1. Verificar tamanho das mensagens
2. Aumentar o `prefetch` em RabbitMQ se houver muitas mensagens

## Próximos Passos

1. ✅ Implementar persistência de notificações em banco de dados
2. ✅ Adicionar WebSocket para notificações real-time
3. ✅ Implementar circuit breaker pattern com fallback
4. ✅ Adicionar observabilidade (Prometheus + Grafana)
5. ✅ Configurar health checks para cada microservice
6. ✅ Implementar distributed tracing com Jaeger

## Referências

- [NestJS Microservices Documentation](https://docs.nestjs.com/microservices/basics)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [NestJS Message Patterns](https://docs.nestjs.com/microservices/basics#request-response)
- [Microservices Architecture Pattern](https://microservices.io/)
