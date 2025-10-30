# 📋 Auditoria: Código vs Desafio Júnior Jungle Gaming

**Data**: 29 de outubro de 2025  
**Objetivo**: Verificar se a implementação atual do sistema de gerenciamento de tarefas atende aos requisitos do desafio  
**Repositório Desafio**: https://github.com/junglegaming/fullstack-challenge

---

## ✅ ITENS IMPLEMENTADOS CORRETAMENTE

### 1. **Estrutura do Monorepo** ✅
- ✅ Monorepo com `pnpm workspaces` e Turborepo
- ✅ Apps: web, api-gateway, auth-service, tasks-service, notifications-service
- ✅ Packages: types, utils, ui-kit, tsconfig, eslint-config
- ✅ Docker Compose com todos os serviços

### 2. **Frontend (React)** ✅
- ✅ React 18 com Vite
- ✅ TanStack Router implementado
- ✅ Zustand para state management
- ✅ Tailwind CSS configurado
- ✅ shadcn/ui componentes (Button, Input, Dialog, Card, Skeleton)
- ✅ react-hook-form + Zod para validação
- ✅ Páginas: Login/Register, Tasks List, Task Detail
- ✅ WebSocket integration (Socket.IO)
- ✅ Filtros, busca e paginação no frontend
- ✅ Toast notifications (react-hot-toast)

### 3. **Backend - Autenticação** ✅
- ✅ JWT com tokens access (15min) e refresh (7d)
- ✅ Argon2 para hash de senha
- ✅ JWT Guards e Passport strategy
- ✅ Serviço de autenticação isolado

### 4. **Backend - Tarefas** ✅
- ✅ CRUD completo
- ✅ Campos: título, descrição, prazo, prioridade (LOW, MEDIUM, HIGH, URGENT), status (TODO, IN_PROGRESS, REVIEW, DONE)
- ✅ Múltiplas atribuições (TaskAssigneeEntity)
- ✅ Comentários (CommentEntity)
- ✅ Histórico de alterações (HistoryEntryEntity - audit log)

### 5. **Backend - Notificações em Tempo Real** ✅
- ✅ RabbitMQ broker
- ✅ Events publicados: task:created, task:updated, comment:new
- ✅ WebSocket Gateway no API Gateway
- ✅ Notifications Service consome da fila
- ✅ Persistência de notificações

### 6. **Microserviços e RabbitMQ** ✅
- ✅ 4 microserviços (Auth, Tasks, Notifications)
- ✅ API Gateway HTTP como entry point
- ✅ RabbitMQ como message broker
- ✅ ClientProxy para comunicação entre serviços
- ✅ Message Patterns definidos

### 7. **Docker & Docker Compose** ✅
- ✅ Dockerfile para todos os serviços
- ✅ docker-compose.yml completo
- ✅ Volumes para persistência
- ✅ Networks configuradas
- ✅ RabbitMQ management UI (15672)
- ✅ PostgreSQL configurado

---

## ❌ PROBLEMAS CRÍTICOS ENCONTRADOS

### 1. **Migrations não rodam - TypeORM Path Error** ❌

**Problema:**
```
As migrations não rodam, pois o TypeORM apresenta erro de path e nomes inválidos,
fora do padrão de timestamp.
```

**Localização:**
- `apps/auth-service/src/database/data-source.ts` (linhas 8-9)
- `apps/tasks-service/src/database/data-source.ts` (linhas 10-11)
- `apps/tasks-service/src/database/typeorm.config.ts` (linhas 11-12)

**Código Problemático:**
```typescript
const migrationsDir = join(__dirname, '..', '..', 'migrations', `*.${fileExtension}`);
```

**Problemas:**
1. Path relativo quebra após build (transpilação para `dist/`)
2. Glob pattern `*.ts` não funciona em produção (arquivos compilados são `.js`)
3. TypeORM CLI não consegue carregar migrations se o caminho está incorreto
4. Nomes das migrations **estão corretos** (e.g., `1700000001000-CreateUsersTable.ts`) mas o path impede o carregamento

**Status dos Arquivos de Migração:**
- ✅ Auth Service: 2 migrations (CreateUsersTable, CreateRefreshTokensTable)
- ✅ Tasks Service: 3 migrations (CreateTasksTable, CreateCommentsTable, CreateTaskHistoryTable)
- ✅ Notifications Service: 1 migration (CreateNotificationsTable)
- ✅ Nomes seguem padrão: `{timestamp}-{Descricao}.ts`

**Solução:**
Usar path absoluto ou dinâmico que funcione com build:
```typescript
const migrationsDir = process.env.NODE_ENV === 'production' 
  ? join(__dirname, 'migrations', '*.js')
  : join(__dirname, '..', 'migrations', '*.ts');
```

---

### 2. **Arquivo ormconfig.ts não necessário e causa confusion** ❌

**Problema:**
```
Durante o build, o path /apps/auth-service/ormconfig.ts é interpretado incorretamente,
gerando falhas adicionais.
```

**Localização:**
- `apps/auth-service/ormconfig.ts` (apenas um arquivo de reexportação)

**Conteúdo:**
```typescript
import { AuthDataSource } from './src/database/data-source';
export default AuthDataSource;
```

**Problemas:**
1. Arquivo é apenas uma reexportação, não agrega valor
2. TypeORM pode tentar usar este arquivo durante build
3. Path relativo pode causar erros de resolução
4. Tasks Service não tem este arquivo, causando inconsistência

**Solução:**
- Remover `ormconfig.ts` do Auth Service
- Usar apenas `src/database/data-source.ts` em todos os serviços

---

### 3. **pnpm run migration:run falha** ❌

**Problema:**
```
O comando pnpm run migration:run falha por não localizar o módulo de configuração do TypeORM.
```

**Localização:**
- `apps/auth-service/package.json` (linha 11)
- `apps/tasks-service/package.json` (linha 11)
- `package.json` root (linha 13)

**Comandos Problemáticos:**
```json
// Auth Service
"migration:run": "node --require ts-node/register ./node_modules/typeorm/cli.js migration:run -d src/database/data-source.ts"

// Tasks Service (IDÊNTICO)
"migration:run": "node --require ts-node/register ./node_modules/typeorm/cli.js migration:run -d src/database/data-source.ts"

// Root
"migration:run": "pnpm --filter @jungle/auth-service run migration:run && pnpm --filter @jungle/tasks-service run migration:run"
```

**Problemas:**
1. Em produção (build), o comando procura em `src/` mas os arquivos estão em `dist/`
2. TypeORM CLI pode não encontrar o DataSource em dev se o path estiver errado
3. `ts-node` pode ter problemas com alias do tsconfig
4. Não há distinção entre dev e prod

**Solução:**
```json
{
  "migration:run": "ts-node -r tsconfig-paths/register ./node_modules/.bin/typeorm migration:run -d src/database/data-source.ts",
  "migration:run:prod": "node ./dist/database/data-source.js migration:run",
  "migration:revert": "ts-node -r tsconfig-paths/register ./node_modules/.bin/typeorm migration:revert -d src/database/data-source.ts"
}
```

---

### 4. **Não há .env.example em nenhum serviço** ❌

**Problema:**
```
E não foi encontrado o .env.example
```

**Desafio exige:**
```
├── .env.example          # variáveis de ambiente de cada serviço
```

**Serviços afetados:**
- ❌ `apps/web/.env.example` - NÃO EXISTE
- ❌ `apps/api-gateway/.env.example` - NÃO EXISTE
- ❌ `apps/auth-service/.env.example` - NÃO EXISTE
- ❌ `apps/tasks-service/.env.example` - NÃO EXISTE
- ❌ `apps/notifications-service/.env.example` - NÃO EXISTE

**Variáveis necessárias por serviço:**

**Web:**
```
VITE_API_URL=http://localhost:3000
VITE_WS_URL=http://localhost:3000
```

**API Gateway:**
```
PORT=3000
NODE_ENV=development
AUTH_SERVICE_URL=http://localhost:3001
TASKS_SERVICE_URL=http://localhost:3002
NOTIFICATIONS_SERVICE_URL=http://localhost:3003
JWT_ACCESS_PUBLIC_KEY=your-public-key
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

**Auth Service:**
```
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/challenge_db
DATABASE_SSL=false
JWT_ACCESS_SECRET=access-secret-key
JWT_ACCESS_TTL=15m
JWT_REFRESH_SECRET=refresh-secret-key
JWT_REFRESH_TTL=7d
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

**Tasks Service:**
```
PORT=3002
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/challenge_db
DATABASE_SSL=false
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

**Notifications Service:**
```
PORT=3003
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/challenge_db
DATABASE_SSL=false
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

---

### 5. **README desatualizado e incompleto** ❌

**Problema:**
```
O README está desatualizado, e alguns comandos não funcionam conforme o descrito.
```

**Problemas Específicos:**

1. **Setup Local não menciona migração:**
   - Não há instrução clara de como rodar `pnpm run migration:run`
   - Não explica que migrations precisam de DB setup prévio

2. **Comandos não testados:**
   ```bash
   # README diz:
   pnpm run migration:run  # Isso provavelmente vai falhar
   ```

3. **Falta diagrama da arquitetura:**
   - Desafio exige: "diagrama simples ASCII ou imagem"
   - README tem um diagrama, mas não descreve fluxo de migrations

4. **Falta documentação de variáveis de ambiente:**
   - Não menciona que precisa de `.env` em cada serviço
   - Não explain como copiar `.env.example`

5. **Instruções desconexas:**
   - "Setup Local (Recomendado)" vs "Setup com Docker Compose"
   - Não fica claro qual escolher ou como fazer ambos

---

### 6. **Gateway retorna erro 400 ao comunicar com Auth** ❌

**Problema:**
```
O Gateway retorna erro 400 em todas as rotas, por não conseguir se comunicar com o
serviço de autenticação (Auth).
```

**Possíveis Causas:**

1. **RabbitMQ não está rodando:**
   - Se rodar sem Docker, RabbitMQ não inicializa
   - Gateway tenta enviar mensagem, falha, retorna 400

2. **Filas não existem:**
   - RabbitMQ pode requerer que filas sejam criadas previamente
   - `jungle_auth_service` queue pode estar vazia/inativa

3. **Timeout das requisições:**
   - `MicroservicesClientService` tem timeout de 30s
   - Se Auth não responde, retorna 400 (BadRequestException)

4. **Environment variables não configuradas:**
   - `RABBITMQ_URL` pode estar diferente em cada serviço
   - Gateway pode estar tentando conectar a URL inválida

**Localização:**
- `apps/api-gateway/src/infra/microservices/microservices.module.ts`
- `apps/api-gateway/src/infra/microservices/microservices-client.service.ts`

**Código:**
```typescript
// microservices.module.ts linha 13
urls: [process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672'],
queue: 'jungle_auth_service',
```

**Solução:**
1. Garantir RabbitMQ rodando: `docker-compose up rabbitmq`
2. Verificar logs do Gateway para mensagens de erro específicas
3. Adicionar health check no Gateway
4. Documentar configuração de RabbitMQ

---

### 7. **Tasks Service não tem ormconfig.ts (inconsistência)** ❌

**Problema:**
```
O Tasks Service falha ao importar o arquivo typeorm.config, e o TypeORM não encontra
as migrations, já que aponta para migrations/*.ts, mas os arquivos estão compilados.
```

**Inconsistência:**
- Auth Service tem `ormconfig.ts`
- Tasks Service NÃO tem `ormconfig.ts`
- Notifications Service NÃO tem `ormconfig.ts`

**Causa:**
Padrão inconsistente de arquitetura entre serviços.

**Solução:**
Remover `ormconfig.ts` de TODOS os serviços, usar apenas `src/database/data-source.ts`

---

## ⚠️ AVISOS & COMPORTAMENTOS ESPERADOS

### 1. **TypeScript Lint Errors** ⚠️
- Frontend tem erros de tipos não resolvidos (React, @tanstack/react-router)
- Aparentemente é issue de configuração do tsconfig ou das dependências
- Não bloqueia execução, mas bloqueia build

### 2. **Migrations com entities não sincronizadas** ⚠️
- Migrations criam tabelas manualmente (raw SQL)
- Entidades decoradas não refletem em migrations
- Para adicionar coluna nova: precisa criar nova migration
- Para dev rápido: usar `synchronize: true` (NUNCA em prod)

### 3. **Falta de validação no Docker Compose** ⚠️
- RabbitMQ Management UI em http://localhost:15672 (admin/admin)
- PostgreSQL pode não estar pronto quando serviços iniciam
- Sem health checks, migrations podem falhar

---

## 📋 RESUMO DE FALHAS vs REQUISITOS DO DESAFIO

| Requisito | Status | Descrição |
|-----------|--------|-----------|
| React + TanStack Router | ✅ | Implementado |
| shadcn/ui (5+ componentes) | ✅ | Implementado |
| Zustand + localStorage | ✅ | Implementado |
| JWT com refresh tokens | ✅ | Implementado |
| Argon2 hash | ✅ | Implementado |
| TypeORM + PostgreSQL | ✅ | Implementado |
| Migrations | ⚠️ **BROKEN** | Paths errados, nomes inválidos |
| RabbitMQ microservices | ✅ | Implementado |
| WebSocket notificações | ✅ | Implementado |
| Docker Compose | ✅ | Implementado |
| **`.env.example` em todos serviços** | ❌ **FALTA** | 0 arquivos |
| **README documentação** | ⚠️ **INCOMPLETO** | Falta setup correto |
| **pnpm run migration:run** | ❌ **FALHA** | Paths incorretos |
| **Gateway comunica com Auth** | ⚠️ **PODE FALHAR** | RabbitMQ ou config |
| HTTP Endpoints (desafio) | ✅ | Implementado |
| WebSocket Events (desafio) | ✅ | Implementado |

---

## 🔧 PRÓXIMOS PASSOS (ORDENADO POR PRIORIDADE)

### 🔴 CRÍTICO (Bloqueia tudo)
1. **Corrigir migrations paths** → Permite rodar migrations
2. **Criar .env.example em todos os serviços** → Permite setup
3. **Corrigir scripts de migration** → Permite automação

### 🟠 IMPORTANTE (Bloqueia alguns fluxos)
4. **Remover ormconfig.ts inconsistente**
5. **Atualizar README com instruções reais**
6. **Adicionar health checks no docker-compose**

### 🟡 DESEJÁVEL (Melhora DX)
7. **Adicionar validação de ambiente**
8. **Adicionar logs informativos**
9. **Adicionar docker-compose down safeguard**

---

## ✅ CONCLUSÃO

**Status Geral: 70% COMPLETO, 30% COM PROBLEMAS CRÍTICOS**

- ✅ Arquitetura está bem desenhada
- ✅ Componentes estão implementados
- ❌ **Migrations quebradas** - não rodam
- ❌ **`.env.example` faltando** - não permite onboarding
- ⚠️ **README desatualizado** - confunde nova pessoas
- ⚠️ **Gateway pode falhar** - depende de RabbitMQ estar perfect

O projeto **não está pronto para submissão** enquanto as migrations não rodarem.

