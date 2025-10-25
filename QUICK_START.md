# 🚀 Quick Start - Jungle Tasks

## ⚡ 30 Segundos para Começar

```bash
# Já está rodando! Acesse:
http://localhost:5173
```

---

## 📱 Testando a Aplicação

### 1. Criar Conta
```
1. Clique em "Registrar"
2. Preencha: Nome, Email, Senha
3. Clique "Registrar"
4. Pronto! Você está autenticado
```

### 2. Criar Tarefa
```
1. Clique no botão "+ Nova Tarefa"
2. Preencha: Título, Descrição (opcional)
3. Escolha: Prioridade, Data limite
4. Clique "Criar Tarefa"
```

### 3. Editar Tarefa
```
1. Clique em uma tarefa
2. Clique botão "Editar"
3. Modifique: Status, Prioridade, Título
4. Clique "Atualizar"
```

### 4. Adicionar Comentário
```
1. Na página de detalhe da tarefa
2. Digite seu comentário
3. Clique "Enviar"
4. Seu comentário aparecerá na lista
```

### 5. Deletar Tarefa
```
1. Na página de detalhe
2. Clique "Deletar"
3. Confirme a deleção
```

---

## 🔄 Fluxos Completos

### Fluxo Usuário: Do Zero à Tarefa em 2 Minutos

```
┌─────────────────┐
│ Frontend Load   │  http://localhost:5173
└────────┬────────┘
         │
      ✅ Carrega Auth Page
         │
┌────────▼────────┐
│ Registrar       │  Email: your@email.com
│ Nome + Senha    │  Senha: password123
└────────┬────────┘
         │
      ✅ POST /auth/register
         │
      ✅ Token salvo em localStorage
         │
┌────────▼────────────────┐
│ Redirect para /tasks    │
└────────┬────────────────┘
         │
      ✅ Carrega TasksPage (vazio)
         │
┌────────▼──────────────┐
│ Clica "Nova Tarefa"   │
└────────┬──────────────┘
         │
      ✅ CreateTaskModal abre
         │
┌────────▼──────────────────────┐
│ Preenche Título + Prioridade  │
│ Clica "Criar Tarefa"          │
└────────┬──────────────────────┘
         │
      ✅ POST /tasks
         │
      ✅ WebSocket: task:created event
         │
      ✅ Toast: "Tarefa criada com sucesso!"
         │
      ✅ Tarefa aparece na lista
         │
         ✅ CONCLUÍDO! (Total: ~60 segundos)
```

---

## 🌐 Endpoints Principais

### Auth
```
POST /auth/register       Criar conta
POST /auth/login          Fazer login
GET  /auth/me             Dados do usuário (requer token)
```

### Tasks
```
GET    /tasks                Listar tarefas
POST   /tasks                Criar tarefa
GET    /tasks/:id            Detalhe da tarefa
PUT    /tasks/:id            Atualizar tarefa
DELETE /tasks/:id            Deletar tarefa
```

### Comments
```
GET    /tasks/:id/comments   Listar comentários
POST   /tasks/:id/comments   Adicionar comentário
DELETE /comments/:id         Deletar comentário
```

### History
```
GET /tasks/:id/history       Histórico de alterações
```

---

## 🔑 Variáveis de Ambiente

### Frontend (.env)
```
VITE_API_GATEWAY_URL=http://localhost:3000
```

### Backend (já configurado)
```
AUTH_SERVICE_URL=http://auth-service:3001
TASKS_SERVICE_URL=http://tasks-service:3002
NOTIFICATIONS_SERVICE_URL=http://notifications-service:3003
DATABASE_URL=postgresql://jungle:jungle_pass@postgres:5432/jungle_tasks
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
JWT_SECRET=your_secret_key_here
```

---

## 🐳 Comandos Docker Úteis

```bash
# Verificar status dos containers
docker-compose ps

# Ver logs de um serviço
docker logs management-system-web-1 -f
docker logs management-system-api-gateway-1 -f

# Reconstruir container
docker-compose build web --no-cache
docker-compose up -d web

# Parar tudo
docker-compose down

# Remover volumes (limpar banco de dados)
docker-compose down -v
docker-compose up -d
```

---

## 🧪 Testando APIs com cURL

### Registrar Usuário
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "displayName": "John Doe"
  }'

# Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "displayName": "John Doe"
  },
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here"
}
```

### Fazer Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

# Response: Mesmo formato da resposta de registrar
```

### Listar Tarefas (com Token)
```bash
curl -X GET http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Response:
{
  "items": [
    {
      "id": "uuid",
      "title": "Tarefa 1",
      "description": "Descrição",
      "status": "todo",
      "priority": "high",
      "createdAt": "2025-10-24T12:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "pageSize": 10
}
```

### Criar Tarefa
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nova Tarefa",
    "description": "Descrição da tarefa",
    "priority": "high",
    "dueDate": "2025-10-31T23:59:59Z"
  }'
```

---

## 🎯 Checklist de Teste Completo

- [ ] **Login/Registro**: Criar conta nova com sucesso
- [ ] **Autenticação**: Token salvo em localStorage
- [ ] **Listar Tarefas**: Página carrega tarefas existentes
- [ ] **Criar Tarefa**: Modal abre e tarefa é criada
- [ ] **Badges**: Status e prioridade mostram corretamente
- [ ] **Editar Tarefa**: Dados são atualizados
- [ ] **Deletar Tarefa**: Tarefa é removida com confirmação
- [ ] **Comentários**: Adicionar comentário funciona
- [ ] **Histórico**: Alterações aparecem no histórico
- [ ] **Skeleton Loader**: Aparecem durante carregamento
- [ ] **Toast Notifications**: Sucessos e erros aparecem
- [ ] **WebSocket**: 2 abas conectadas recebem eventos
- [ ] **Logout**: Sessão é limpa corretamente
- [ ] **Error Handling**: Erros são mostrados ao usuário
- [ ] **Validação**: Zod valida formulários corretamente

---

## 🆘 Troubleshooting

### Frontend não carrega
```bash
# Verificar se Vite está rodando
docker logs management-system-web-1

# Se der erro, reconstruir
docker-compose down
docker-compose build web --no-cache
docker-compose up -d web

# Acessar novamente
http://localhost:5173
```

### Erros ao criar tarefa
```bash
# Verificar se API Gateway está rodando
docker logs management-system-api-gateway-1

# Verificar se Auth Service está rodando
docker logs management-system-auth-service-1

# Verificar se Tasks Service está rodando
docker logs management-system-tasks-service-1
```

### WebSocket não conecta
```bash
# Verificar se Socket.IO está rodando
# Abrir DevTools (F12) → Console
# Procurar por: "WebSocket connected" ou "WebSocket error"

# Se não conectar, checar:
docker logs management-system-api-gateway-1 | grep Socket
```

### Banco de dados vazio
```bash
# Confirmar que migrations rodaram
docker logs management-system-postgres-1 | grep migration

# Se necessário, limpar e reconstruir
docker-compose down -v
docker-compose up -d
```

---

## 📊 Arquitetura Resumida

```
Browser (React App)
    ↓ HTTP + WebSocket
API Gateway (Port 3000)
    ↓
├── Auth Service (3001)
├── Tasks Service (3002)
└── Notifications Service (3003)
    ↓
├── PostgreSQL (5432)
└── RabbitMQ (5672)
```

---

## 🎓 Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, TanStack Router, Zustand, Tailwind |
| **Backend** | NestJS, TypeORM, PostgreSQL, RabbitMQ |
| **Auth** | JWT, bcrypt |
| **Real-time** | Socket.IO |
| **DevOps** | Docker, Docker Compose |

---

## ✅ Tudo Funcionando?

```
✅ Frontend: http://localhost:5173
✅ API Gateway: http://localhost:3000
✅ Auth Service: http://localhost:3001
✅ Tasks Service: http://localhost:3002
✅ Notifications: http://localhost:3003
✅ PostgreSQL: localhost:5432
✅ RabbitMQ: amqp://localhost:5672

🚀 Você está pronto para usar!
```

---

## 📞 Próximas Etapas

1. **Explorar**: Criar algumas tarefas, adicionar comentários
2. **Testar**: Abra 2 abas e veja WebSocket em ação
3. **Customizar**: Modifique componentes no código
4. **Deploy**: Docker já está configurado, basta fazer push

---

**Desenvolvido com ❤️ - Jungle Tasks v1.0.0**
