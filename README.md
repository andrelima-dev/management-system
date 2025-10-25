# 🌴 Jungle Tasks - Sistema de Gerenciamento de Tarefas em Tempo Real

<div align="center">

![Status](https://img.shields.io/badge/Status-✅%20Operacional-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Node](https://img.shields.io/badge/Node-22+-brightgreen?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square)

**Uma aplicação full-stack moderna com microserviços, autenticação JWT, comunicação assíncrona e notificações em tempo real.**

[📖 Documentação](#-documentação) • [🚀 Quick Start](#-quick-start) • [📝 Exemplos](#-exemplos) • [🏗️ Arquitetura](#-arquitetura)

</div>

---

## 🎯 Sobre o Projeto

**Jungle Tasks** é um desafio de desenvolvimento completo que demonstra competência full-stack. O projeto implementa um sistema profissional de gerenciamento de tarefas com:

- ✅ **Autenticação Segura**: JWT com access/refresh tokens
- ✅ **CRUD de Tarefas**: Completo com filtros e paginação
- ✅ **Comentários e Histórico**: Rastreamento de alterações
- ✅ **Notificações Real-time**: WebSocket integrado
- ✅ **Microserviços**: Auth, Tasks, Notifications, Gateway
- ✅ **Message Broker**: RabbitMQ para comunicação assíncrona
- ✅ **Docker Compose**: Infraestrutura containerizada
- ✅ **Monorepo**: Turborepo com código compartilhado
- ✅ **React Frontend**: Modern UI com TanStack Router

---

## 🏗️ Arquitetura

### Componentes Principais

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (React)                   │
│              http://localhost:5173                 │
└────────────────────────┬────────────────────────────┘
                         │
          ┌──────────────┴──────────────┐
          │ HTTP + WebSocket            │
          ▼                             ▼
    ┌─────────────────┐        ┌──────────────────┐
    │  API Gateway    │────►   │  WebSocket       │
    │  Port 3000      │        │  Notifications   │
    └────────┬────────┘        └──────────────────┘
             │
     ┌───────┼───────┐
     │       │       │
     ▼       ▼       ▼
 ┌────────┐┌────────┐┌──────────┐
 │ Auth   ││ Tasks  ││Notif     │
 │Service ││Service ││Service   │
 │3001    ││3002    ││3003      │
 └────────┘└────────┘└──────────┘
     │       │       │
     └───────┼───────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
┌──────────────┐  ┌──────────────┐
│ PostgreSQL   │  │ RabbitMQ     │
│ Port 5432    │  │ Port 5672    │
└──────────────┘  └──────────────┘
```

### Stack Tecnológico

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 18+, TanStack Router, Tailwind CSS, Zustand, TanStack Query |
| **Backend** | NestJS, TypeORM, PostgreSQL, RabbitMQ |
| **Autenticação** | JWT (access + refresh tokens), bcrypt |
| **Real-time** | Socket.IO, WebSocket |
| **Infraestrutura** | Docker, Docker Compose |
| **Monorepo** | Turborepo, pnpm |
| **Qualidade** | TypeScript, ESLint, Prettier |

---

## 📚 Documentação

Este projeto inclui documentação completa:

| Documento | Conteúdo |
|-----------|----------|
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Documentação técnica detalhada, modelagem de domínio, endpoints, plano de implementação |
| **[GETTING_STARTED.md](./GETTING_STARTED.md)** | Guia prático de setup local, execução com Docker, troubleshooting |
| **[CODE_EXAMPLES.md](./CODE_EXAMPLES.md)** | Exemplos concretos de código: entidades, DTOs, serviços, componentes React |
| **[SUMMARY.md](./SUMMARY.md)** | Resumo executivo, estatísticas, fluxos principais, checklist |

---

## 🚀 Quick Start

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
psql -U postgres -c "CREATE DATABASE jungle_tasks;"
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

## 📖 Referências

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentação técnica
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Guia de setup
- [CODE_EXAMPLES.md](./CODE_EXAMPLES.md) - Exemplos de código
- [SUMMARY.md](./SUMMARY.md) - Resumo executivo

---

<div align="center">

Desenvolvido com ❤️ para aprendizado e crescimento profissional.

</div>
