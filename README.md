# 📋 Tasks - Sistema de Gerenciamento de Tarefas

<div align="center">

![Status](https://img.shields.io/badge/Status-✅%20Operacional-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square)
![NestJS](https://img.shields.io/badge/NestJS-10+-red?style=flat-square)
![React](https://img.shields.io/badge/React-18+-61dafb?style=flat-square)

**Uma aplicação full-stack profissional para gerenciamento de tarefas com arquitetura de microserviços, autenticação segura e interface moderna.**

[ Quick Start](#-quick-start) • [� Documentação](#-documentação) • [🏗️ Arquitetura](#-arquitetura) • [👤 Demo](#-demo)

</div>

---

## ✨ Funcionalidades

- 🔐 **Autenticação Segura** - JWT com tokens de acesso e refresh
- ✅ **Gerenciamento de Tarefas** - CRUD completo com status e prioridades
- 👥 **Gestão de Equipes** - Convide e gerencie membros da equipe
- 🎨 **Interface Moderna** - Design responsivo com tema claro e escuro
- 🏗️ **Arquitetura de Microserviços** - Serviços desacoplados e escaláveis
- 📦 **Monorepo** - Código compartilhado entre aplicações
- 🐳 **Docker Ready** - Deploy com Docker Compose em um comando

---

## 👤 Demo

Use as credenciais abaixo para testar a aplicação:

```
📧 Email: andre@teste.com
🔑 Senha: 12345678
```

**URL**: http://localhost:5174/tasks

---

## 🏗️ Arquitetura

### Microserviços com NestJS

Este projeto implementa uma **arquitetura completa de microserviços** utilizando:
- ✅ **NestJS Microservices** - Framework para criar serviços distribuídos
- ✅ **RabbitMQ** - Transportador de mensagens para comunicação assíncrona
- ✅ **ClientProxy** - Cliente para comunicação entre serviços no Gateway
- ✅ **Message Patterns** - Request/Response entre microserviços
- ✅ **Event Patterns** - Pub/Sub para eventos distribuídos

```
                    ┌─────────────────┐
                    │   Web (React)   │
                    │ Port 5174       │
                    └────────┬────────┘
                             │ HTTP/REST
                    ┌────────▼────────┐
                    │  API Gateway    │
                    │  Port 3000      │
                    │  (HTTP Server)  │
                    └────────┬────────┘
                             │ AMQP/RabbitMQ (ClientProxy)
            ┌────────────────┼────────────────┐
            │                │                │
    ┌───────▼────────┐   ┌───▼────────────┐  ┌──────▼─────────────┐
    │ Auth Service   │   │ Tasks Service  │  │ Notifications      │
    │ Port: N/A      │   │ Port: N/A      │  │ Service Port: N/A  │
    │ Queue: auth    │   │ Queue: tasks   │  │ Queue: notif       │
    │ (Microservice) │   │ (Microservice) │  │ (Microservice)     │
    └───────┬────────┘   └───┬────────────┘  └──────┬─────────────┘
            │                │                      │
            └────────────────┼──────────────────────┘
                             │
         ┌───────────────────┼──────────────────┐
         │                   │                  │
      ┌──▼────────┐      ┌───▼───────────┐  ┌─▼──────────┐
      │PostgreSQL │      │  RabbitMQ     │  │  Redis     │
      │:5432      │      │ :5672 / :15672│  │ (opcional) │
      └───────────┘      └────────────────┘  └────────────┘
```

📚 **Consulte [MICROSERVICES_GUIDE.md](./MICROSERVICES_GUIDE.md) para documentação completa da arquitetura!**

### Stack Tecnológico

| Componente | Tecnologia |
|-----------|-----------|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Zustand |
| **Backend** | NestJS, TypeORM, PostgreSQL |
| **Microserviços** | NestJS Microservices, RabbitMQ |
| **Autenticação** | JWT, Argon2 |
| **Mensageria** | RabbitMQ (AMQP Transport) |
| **Infraestrutura** | Docker, Docker Compose |
| **Build** | Turborepo, pnpm |

---

## 🏗️ Arquitetura

### Microserviços
# 1. Clonar repositório
git clone https://github.com/seu-usuario/management-system.git
cd management-system

# 2. Instalar dependências
pnpm install

# 3. Iniciar serviços com Docker Compose
docker-compose up -d

# 4. Executar migrações do banco de dados
pnpm run migration:run

# 5. Iniciar desenvolvimento (Frontend)
cd apps/web
pnpm run dev
```

A aplicação estará disponível em: **http://localhost:5174**

### Parar os serviços

```bash
docker-compose down
```

---

## � Estrutura do Projeto

```
management-system/
├── apps/
│   ├── web/                 # Frontend React
│   ├── api-gateway/         # API Gateway NestJS
│   ├── auth-service/        # Serviço de Autenticação
│   ├── tasks-service/       # Serviço de Tarefas
│   └── notifications-service/ # Serviço de Notificações
├── packages/
│   ├── types/               # Tipos TypeScript compartilhados
│   ├── utils/               # Utilitários compartilhados
│   ├── ui-kit/              # Componentes de UI reutilizáveis
│   └── eslint-config/       # Configuração ESLint
├── docker-compose.yml       # Configuração de containers
└── package.json             # Workspace root
```

---

## 📖 Documentação

Para documentação detalhada, consulte:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Design técnico, APIs, fluxos
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** - Guia de setup local
- **[CODE_EXAMPLES.md](./CODE_EXAMPLES.md)** - Exemplos de código

---

## 🔌 APIs Principais

### Autenticação
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Login
- `POST /auth/refresh` - Renovar token

### Tarefas
- `GET /tasks` - Listar tarefas do usuário
- `POST /tasks` - Criar tarefa
- `PATCH /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa

### Equipe
- `GET /team/members` - Listar membros da equipe
- `POST /team/invite` - Convidar membro
- `DELETE /team/members/:id` - Remover membro

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run dev          # Iniciar servidor de desenvolvimento

# Build
pnpm run build        # Fazer build de todos os packages

# Linting
pnpm run lint         # Executar ESLint
pnpm run format       # Formatar código com Prettier

# Database
pnpm run migration:run     # Executar migrações (Auth e Tasks)
pnpm run migration:revert  # Reverter última migração executada
```

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👨‍� Autor

Desenvolvido com ❤️ por [André Hunter](https://github.com/andrelima-dev)

**Conecte-se comigo:**
- GitHub: [@andrelima-dev](https://github.com/andrelima-dev)
- Email: andre@exemplo.com

### Pré-requisitos

```bash
# Node.js 22+
node --version

# pnpm
npm install -g pnpm

# PostgreSQL (local ou Docker)
# RabbitMQ (local ou Docker)
```

### Setup Local (Recomendado)

```bash
# 1. Clonar e instalar dependências
git clone <repo>
cd management-system
pnpm install

# 2. Criar banco de dados
psql -U postgres -c "CREATE DATABASE tasks;"
psql -U postgres -c "CREATE USER jungle WITH PASSWORD 'jungle_pass';"

# 3. Copiar variáveis de ambiente
cp apps/auth-service/.env.example apps/auth-service/.env
cp apps/tasks-service/.env.example apps/tasks-service/.env
cp apps/api-gateway/.env.example apps/api-gateway/.env
cp apps/web/.env.example apps/web/.env

# 4. Rodar serviços (em terminais separados)
pnpm --filter @jungle/auth-service run dev         # Terminal 1
pnpm --filter @jungle/tasks-service run dev        # Terminal 2
pnpm --filter @jungle/api-gateway run dev          # Terminal 3
pnpm --filter @jungle/web run dev                  # Terminal 4

# 5. Acessar
# Frontend: http://localhost:5173
# API Gateway: http://localhost:3000
```

### Setup com Docker Compose

```bash
docker-compose up --build
```

---

## 🎨 Frontend (React + Vite)

O frontend foi construído com as tecnologias mais modernas e práticas recomendadas:

### Tecnologias
- **React 18** com Vite (dev server rápido)
- **TanStack Router** para roteamento type-safe
- **Zustand** para state management com persistência localStorage
- **react-hook-form + Zod** para validação de formulários
- **Tailwind CSS** para styling responsivo
- **shadcn/ui** componentes reutilizáveis
- **Socket.IO** para notificações em tempo real
- **react-hot-toast** para feedback visual

### Páginas Implementadas
- 🔐 **Login/Registar** (`/`) - Autenticação com tabs
- 📋 **Tarefas** (`/tasks`) - Listagem, filtros, criar tarefa
- 📄 **Detalhe da Tarefa** (`/tasks/:id`) - Editar, deletar, comentários

### Recursos
- ✅ Autenticação persistida (localStorage)
- ✅ JWT interceptor automático
- ✅ Skeleton loaders durante carregamento
- ✅ Modal para criar/editar tarefas
- ✅ Comentários com validação
- ✅ Histórico de alterações
- ✅ WebSocket para atualizações reais
- ✅ Tratamento de erros robusto

### Componentes UI Criados
- `Button` com 6 variantes
- `Input` estilizado
- `Dialog` (modal) completo
- `Card` com subcomponentes
- `Skeleton` com shimmer animation

Veja mais detalhes em [apps/web/README-COMPLETE.md](./apps/web/README-COMPLETE.md)

---

## 📝 Exemplos

### Registrar Usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Veja mais exemplos em [CODE_EXAMPLES.md](./CODE_EXAMPLES.md)

---

## 📁 Estrutura do Projeto

```
management-system/
├── apps/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── tasks-service/
│   ├── notifications-service/
│   └── web/
├── packages/
│   ├── types/
│   ├── utils/
│   ├── ui-kit/
│   ├── tsconfig/
│   └── eslint-config/
├── docker-compose.yml
├── pnpm-workspace.yaml
└── turbo.json
```

---

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Password Hashing (bcrypt)
- ✅ Validação de entrada
- ✅ JWT Guards
- ✅ CORS configurado
- ✅ Rate limiting

---

## 🛠️ Comandos Úteis

```bash
pnpm run dev           # Rodar todos os serviços
pnpm run build         # Build de tudo
pnpm run lint          # Lint em tudo
docker-compose up      # Docker Compose
```

---


Desenvolvido com ❤️ para aprendizado e crescimento profissional.

</div>
