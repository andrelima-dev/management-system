# 🚀 Guia de Execução Local - Jungle Tasks

## Status Atual do Projeto

O projeto está em **fase inicial de desenvolvimento** com a estrutura base criada. Todos os serviços têm Dockerfiles configurados, mas estamos refinando as dependências.

---

## ⚡ Execução Local (Recomendado para Desenvolvimento)

### Pré-requisitos

```bash
# Node.js v22+
node --version

# pnpm (recomendado)
npm install -g pnpm

# PostgreSQL rodando localmente
# Downloads: https://www.postgresql.org/download/

# RabbitMQ rodando localmente (opcional para testes iniciais)
# Downloads: https://www.rabbitmq.com/download.html
# Ou use Docker: docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management
```

### Instalação e Setup

```bash
# 1. Clonar repositório
cd management-system

# 2. Instalar dependências (será feito em todos os packages)
pnpm install

# 3. Criar banco de dados PostgreSQL
# Windows (CMD/PowerShell):
psql -U postgres -c "CREATE DATABASE jungle_tasks;"
psql -U postgres -c "CREATE USER jungle WITH PASSWORD 'jungle_pass';"
psql -U postgres -c "ALTER ROLE jungle CREATEDB;"

# 4. Criar arquivos .env para cada serviço
cp apps/auth-service/.env.example apps/auth-service/.env
cp apps/tasks-service/.env.example apps/tasks-service/.env
cp apps/notifications-service/.env.example apps/notifications-service/.env
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/web/.env.example apps/web/.env

# 5. Editar .env files com valores reais
# - DATABASE_HOST: localhost
# - RABBITMQ_URL: amqp://localhost:5672 (se rodando localmente)
```

### Rodando os Serviços

**Terminal 1 - Auth Service**
```bash
pnpm --filter @jungle/auth-service run dev
# Saída esperada:
# ✓ Auth Service rodando em http://localhost:3001
```

**Terminal 2 - Tasks Service**
```bash
pnpm --filter @jungle/tasks-service run dev
# Saída esperada:
# ✓ Tasks Service rodando em http://localhost:3002
```

**Terminal 3 - Notifications Service**
```bash
pnpm --filter @jungle/notifications-service run dev
# Saída esperada:
# ✓ Notifications Service rodando em http://localhost:3003
```

**Terminal 4 - API Gateway**
```bash
pnpm --filter @jungle/api-gateway run dev
# Saída esperada:
# ✓ API Gateway rodando em http://localhost:3000
```

**Terminal 5 - Frontend**
```bash
pnpm --filter @jungle/web run dev
# Saída esperada:
# ✓ Web app rodando em http://localhost:5173
```

### Verificando se Tudo Está Rodando

```bash
# Terminal 6 - Testar Health Checks
curl http://localhost:3000/health      # API Gateway
curl http://localhost:3001/health      # Auth Service
curl http://localhost:3002/health      # Tasks Service
curl http://localhost:3003/health      # Notifications Service

# Acesso às aplicações
# Frontend: http://localhost:5173
# RabbitMQ (se local): http://localhost:15672
# PostgreSQL: localhost:5432
```

---

## 🐳 Execução com Docker Compose

### Pré-requisitos

```bash
# Docker Desktop instalado
docker --version
docker-compose --version
```

### Comando

```bash
# Construir e subir todos os serviços
docker-compose up --build

# Ou apenas subir
docker-compose up

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Remover volumes (limpar dados)
docker-compose down -v
```

### Acessar Serviços

```bash
# Frontend: http://localhost:5173
# API Gateway: http://localhost:3000
# RabbitMQ: http://localhost:15672 (jungle/jungle_pass)
# PostgreSQL: localhost:5432
```

---

## 🛠️ Troubleshooting

### Erro: "Cannot find module '@nestjs/common'"

**Solução**: Certifique-se de ter rodado `pnpm install`

```bash
pnpm install
pnpm run build
```

### Erro: "Cannot connect to PostgreSQL"

**Solução**: Verificar se PostgreSQL está rodando

```bash
# Windows
# 1. Abrir Services (services.msc)
# 2. Procurar por "PostgreSQL" e iniciar

# Ou via terminal:
psql -U postgres -c "SELECT version();"
```

### Erro: "Port 3000 already in use"

**Solução**: Matar processo na porta

```bash
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Ou mudar portas nos .env files
```

### Erro: "RABBITMQ_URL not configured"

**Solução**: Se não estiver usando RabbitMQ ainda, pode:
1. Comentar imports de RabbitMQ nos .env
2. Ou rodar RabbitMQ via Docker: `docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3.12-management`

---

## 📝 Próximos Passos

### Semana 1
- [ ] Testar Auth Service local
- [ ] Testar criação de usuário
- [ ] Testar login

### Semana 2
- [ ] Implementar Tasks CRUD
- [ ] Testar endpoints

### Semana 3
- [ ] Implementar comentários
- [ ] Testar histórico

### Semana 4
- [ ] RabbitMQ events
- [ ] Notifications Service

### Semana 5
- [ ] WebSocket integração
- [ ] Real-time updates

### Semana 6-7
- [ ] Frontend React
- [ ] UI completa

### Semana 8
- [ ] Docker otimizado
- [ ] Deploy preparation

---

## 🧪 Testando Endpoints

### Usar Postman ou Insomnia

**Collection disponível:** (será criada em breve)

### Ou via cURL

```bash
# 1. Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# 2. Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# 3. Copiar accessToken da resposta e usar em:
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <SEU_TOKEN_AQUI>"
```

---

## 📊 Estrutura de Pastas Importante

```
management-system/
├── apps/
│   ├── auth-service/        ← Autenticação JWT
│   ├── api-gateway/         ← Proxy reverso (http://localhost:3000)
│   ├── tasks-service/       ← CRUD de tarefas (http://localhost:3002)
│   ├── notifications-service/ ← Notificações (http://localhost:3003)
│   └── web/                 ← Frontend React (http://localhost:5173)
├── packages/
│   ├── types/               ← Tipos compartilhados
│   ├── utils/               ← Utilitários compartilhados
│   ├── ui-kit/              ← Componentes React
│   ├── tsconfig/            ← Config TypeScript
│   └── eslint-config/       ← Config ESLint
├── docker-compose.yml       ← Orquestração dos containers
├── pnpm-workspace.yaml      ← Workspace pnpm
├── turbo.json               ← Turborepo config
└── ARCHITECTURE.md          ← Documentação completa
```

---

## 🎯 Objetivo Final

Quando tudo estiver rodando corretamente:

1. **Frontend**: Você consegue acessar http://localhost:5173
2. **Auth**: Você consegue fazer login/signup
3. **Tasks**: Você consegue criar, listar, editar tarefas
4. **Comments**: Você consegue comentar em tarefas
5. **History**: Você consegue ver histórico de alterações
6. **Notifications**: Você recebe notificações em tempo real
7. **WebSocket**: Notificações chegam via WebSocket

---

## 💡 Dicas Importantes

- Sempre rodar `pnpm install` após puxar mudanças do git
- Use `pnpm run build` para verificar erros de compilação
- Use `pnpm run lint` para verificar qualidade do código
- Use `pnpm run test` para rodar testes (quando disponível)
- Commitso com padrão: `feat:`, `fix:`, `chore:`, `docs:`

---

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs dos serviços
2. Confirmar variáveis de ambiente
3. Verificar se portas estão livres
4. Verificar conexão com PostgreSQL e RabbitMQ

---

**Status**: 🟡 Em Desenvolvimento - Funcionalidade básica em construção
