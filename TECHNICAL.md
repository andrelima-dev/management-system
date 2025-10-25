# 📚 Documentação Técnica - Tasks

Guia detalhado da arquitetura, padrões de código e implementação técnica do projeto.

---

## 📑 Índice

1. [Arquitetura](#-arquitetura)
2. [Padrões de Desenvolvimento](#-padrões-de-desenvolvimento)
3. [Backend - Microserviços](#-backend---microserviços)
4. [Frontend - React](#-frontend---react)
5. [Fluxos Principais](#-fluxos-principais)
6. [Boas Práticas](#-boas-práticas)

---

## 🏗️ Arquitetura

### Visão Geral

O projeto segue um padrão de **microserviços com API Gateway**, garantindo escalabilidade e separação de responsabilidades.

```
┌────────────────────────────────────────────────────────┐
│                    Cliente (React)                      │
│                  http://localhost:5174                 │
└────────────────────┬─────────────────────────────────┘
                     │ HTTP/REST
                     │
        ┌────────────▼──────────────┐
        │   API Gateway (NestJS)    │
        │   http://localhost:3000   │
        └┬───────────┬──────────┬───┘
         │           │          │
    ┌────▼──┐  ┌────▼───┐  ┌──▼──────┐
    │Auth   │  │ Tasks  │  │Notif.   │
    │:3001  │  │ :3002  │  │ :3003   │
    └────┬──┘  └────┬───┘  └──┬──────┘
         │          │         │
         └──────────┼─────────┘
                    │
         ┌──────────┴─────────┐
         │                    │
    ┌────▼────┐          ┌───▼─────┐
    │PostgreSQL          │RabbitMQ │
    │ :5432   │          │ :5672   │
    └─────────┘          └─────────┘
```

### Componentes

#### **API Gateway** (Port 3000)
- Proxy reverso centralizado
- Autenticação via JWT
- Roteamento de requisições
- Agregação de respostas

#### **Auth Service** (Port 3001)
- Registro e login de usuários
- Geração de JWT tokens
- Refresh de tokens
- Gestão de credenciais

#### **Tasks Service** (Port 3002)
- CRUD de tarefas
- Gerenciamento de status
- Histórico de alterações
- Comentários em tarefas

#### **Notifications Service** (Port 3003)
- Notificações real-time
- Consumidor de eventos (RabbitMQ)
- WebSocket para clientes

---

## 🎯 Padrões de Desenvolvimento

### Autenticação JWT

**Fluxo:**
```
1. User faz login com email + senha
2. Backend valida credenciais com Argon2
3. Gera JWT com sub (user ID) + exp
4. Frontend armazena token no localStorage
5. Cliente envia Authorization: Bearer <token> em requests
6. API Gateway valida e injeta user context
```

**Estrutura do Token:**
```typescript
interface AccessTokenPayload {
  sub: string;        // User ID (UUID)
  email: string;      // User email
  iat: number;        // Issued at
  exp: number;        // Expiration
}
```

### DTO (Data Transfer Objects)

Validação em tempo de requisição usando `class-validator`:

```typescript
// create-task.dto.ts
export class CreateTaskDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['low', 'medium', 'high'])
  priority: 'low' | 'medium' | 'high';

  @IsArray()
  @IsUUID('4', { each: true })
  assigneeIds: string[];
}
```

### Entidades TypeORM

Mapeamento de banco de dados com relacionamentos:

```typescript
// task.entity.ts
@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('enum', { enum: ['pending', 'in_progress', 'done'] })
  status: TaskStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'task_assignees',
    joinColumn: { name: 'task_id' },
    inverseJoinColumn: { name: 'user_id' }
  })
  assignees: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 🔧 Backend - Microserviços

### Estrutura de Pastas (Serviço de Tarefas)

```
apps/tasks-service/
├── src/
│   ├── config/          # Configurações (BD, env vars)
│   ├── database/        # TypeORM connection, seeds
│   ├── messaging/       # Consumidores RabbitMQ
│   ├── migrations/      # Migrações de BD
│   └── modules/
│       ├── tasks/
│       │   ├── dto/     # Data Transfer Objects
│       │   ├── entities/# TypeORM entities
│       │   ├── tasks.controller.ts
│       │   ├── tasks.service.ts
│       │   └── tasks.module.ts
│       └── comments/
│           └── ...
│   ├── app.module.ts    # Root module
│   └── main.ts          # Entry point
├── ormconfig.ts         # Configuração TypeORM
└── tsconfig.json
```

### Exemplo: Criar Tarefa

**Controller:**
```typescript
@Post()
@UseGuards(JwtAuthGuard)
async create(
  @Body() dto: CreateTaskDto,
  @Req() req: AuthenticatedRequest
) {
  const userId = req.user.sub;
  return this.tasksService.create(userId, dto);
}
```

**Service:**
```typescript
async create(userId: string, dto: CreateTaskDto) {
  const task = this.taskRepository.create({
    title: dto.title,
    description: dto.description,
    priority: dto.priority,
    createdById: userId,
    status: 'pending'
  });

  await this.taskRepository.save(task);

  // Publicar evento para outras soluções
  await this.messagingService.publish('tasks.created', { taskId: task.id });

  return task;
}
```

### Tratamento de Erros

Uso de exceções customizadas:

```typescript
@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      statusCode: 400,
      message: 'Validation failed',
      errors: exception.getResponse()
    });
  }
}
```

---

## ⚛️ Frontend - React

### Estrutura de Pastas

```
apps/web/src/
├── components/        # Componentes React reutilizáveis
│   ├── Header.tsx
│   ├── CreateTaskModal.tsx
│   └── ui/            # Componentes de UI (Button, Dialog, etc)
├── hooks/            # Custom React hooks
│   ├── useAuth.ts
│   └── useTasks.ts
├── lib/              # Utilitários e configurações
│   ├── api.ts        # Cliente HTTP
│   ├── router.ts     # Configuração de rotas
│   └── validators.ts # Validação com Zod
├── routes/           # Páginas/Views
│   ├── auth.tsx      # Login/Register
│   ├── tasks.tsx     # Lista de tarefas
│   └── team.tsx      # Gestão de equipe
├── stores/           # Estado global (Zustand)
│   ├── authStore.ts
│   └── tasksStore.ts
├── types/            # TypeScript types
│   └── index.ts
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

### Gerenciamento de Estado (Zustand)

```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: localStorage.getItem('user') ? 
    JSON.parse(localStorage.getItem('user')!) : null,
  token: localStorage.getItem('token'),

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, user } = response.data;

    localStorage.setItem('token', access_token);
    localStorage.setItem('user', JSON.stringify(user));

    set({ token: access_token, user });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ token: null, user: null });
  }
}));
```

### Cliente HTTP com Interceptadores

```typescript
// lib/api.ts
const api = axios.create({
  baseURL: 'http://localhost:3000'
});

// Adicionar token em todas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirecionar para login
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);
```

### Componente de Formulário com Validação

```typescript
// auth.tsx
interface LoginForm {
  email: string;
  password: string;
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export function AuthPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await useAuth.getState().login(data.email, data.password);
      navigate({ to: '/tasks' });
    } catch (error) {
      toast.error('Falha ao fazer login');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" placeholder="Senha" />
      {errors.password && <span>{errors.password.message}</span>}

      <button type="submit">Entrar</button>
    </form>
  );
}
```

---

## 🔄 Fluxos Principais

### 1. Autenticação (Login)

```
Frontend                          Backend
   │                               │
   ├─ POST /auth/login ──────────►│
   │  { email, password }          │
   │                               ├─ Hash senha com Argon2
   │                               ├─ Comparar com BD
   │◄─────── JWT Token ───────────┤
   │                               │
   ├─ Salvar no localStorage       │
   ├─ Navegar para /tasks         │
```

### 2. Criar Tarefa

```
Frontend                          Backend
   │                               │
   ├─ POST /tasks ────────────────►│
   │  { title, description, ... }  │
   │  Authorization: Bearer JWT    │
   │                               ├─ Validar JWT
   │                               ├─ Salvar no BD
   │                               ├─ Publicar evento (RabbitMQ)
   │◄─────── Task Object ──────────┤
   │                               │
   ├─ Atualizar estado local       │
   ├─ Mostrar toast de sucesso     │
```

### 3. Listar Tarefas

```
Frontend                          Backend
   │                               │
   ├─ GET /tasks?page=1 ──────────►│
   │  Authorization: Bearer JWT    │
   │                               ├─ Validar JWT
   │                               ├─ Filtrar por userId
   │                               ├─ Aplicar paginação
   │◄─────── PaginatedResponse ────┤
   │                               │
   ├─ Atualizar store (Zustand)    │
   ├─ Renderizar lista             │
```

---

## ✅ Boas Práticas

### 1. Separação de Responsabilidades

- **Controllers** - Lidam com HTTP (params, body, headers)
- **Services** - Contêm lógica de negócio
- **Repositories** - Acesso a dados (via TypeORM)

### 2. Validação em Camadas

```typescript
// DTOs validam estrutura
// Business rules validam lógica
// Database constraints validam integridade

if (!task) throw new NotFoundException();
if (task.createdById !== userId) throw new ForbiddenException();
```

### 3. Tratamento de Erros Consistente

```typescript
try {
  await this.tasksService.delete(id, userId);
} catch (error) {
  if (error instanceof NotFoundException) {
    throw new HttpException('Task not found', 404);
  }
  throw error;
}
```

### 4. Tipagem TypeScript Rigorosa

```typescript
// ✅ Bom - Type-safe
const userId: string = req.user.sub;
const tasks: Task[] = await this.taskRepository.find();

// ❌ Evitar - Any é perigoso
const userId = req.user.sub;
const tasks = await this.taskRepository.find();
```

### 5. Testes

```typescript
describe('TasksService', () => {
  it('should create a task', async () => {
    const dto = { title: 'Test', priority: 'high' };
    const task = await service.create(userId, dto);
    expect(task.title).toBe('Test');
  });
});
```

---

## 🚀 Deployment

### Com Docker Compose

```bash
# Build e iniciar todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar serviços
docker-compose down
```

### Variáveis de Ambiente

**`.env` (raiz)**
```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@postgres:5432/tasks
RABBITMQ_URL=amqp://rabbit:pass@rabbitmq:5672
JWT_SECRET=seu-secret-super-seguro
```

---

## 📞 Suporte

Dúvidas sobre a implementação? Consulte:

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Design técnico
- [CODE_EXAMPLES.md](./CODE_EXAMPLES.md) - Exemplos de código
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Setup e troubleshooting

---

**Última atualização**: Outubro 2025
