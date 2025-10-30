# System Architecture

Technical overview of the Jungle Task System architecture, design patterns, and technology stack.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture Pattern](#architecture-pattern)
3. [Technology Stack](#technology-stack)
4. [Service Details](#service-details)
5. [Data Flow](#data-flow)
6. [Database Schema](#database-schema)
7. [Design Decisions](#design-decisions)

---

## Overview

Jungle Task System follows a **microservices architecture** with the following characteristics:

- **Distributed**: Services run independently
- **Scalable**: Each service can scale independently
- **Fault-tolerant**: Service failure doesn't crash entire system
- **Event-driven**: Services communicate via message broker
- **API-first**: RESTful API design

---

## Architecture Pattern

### Layered Microservices

```
┌─────────────────────────────────────────────┐
│         Client / Frontend (React)           │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│    API Gateway (Request Router/Auth)        │
└────┬────────────────────────────┬───────────┘
     │                            │
┌────▼───────────┐    ┌──────────▼────────┐
│ Auth Service   │    │  Tasks Service    │
│                │    │                   │
│• Controllers   │    │• Controllers      │
│• Services      │    │• Services         │
│• Entities      │    │• Entities         │
│• Repos         │    │• Repos            │
└────┬───────────┘    └──────────┬────────┘
     │                           │
     └───────────┬───────────────┘
                 │
        ┌────────▼─────────┐
        │  Notifications   │
        │  Service (Event) │
        └────────┬─────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───┐  ┌────▼────┐  ┌───▼────┐
│ PostgreSQL│ RabbitMQ   │ Redis  │
│ (Data)    │ (Events)   │ (Cache)│
└──────────┘ └───────────┘ └────────┘
```

---

## Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: NestJS 10+
- **ORM**: TypeORM 0.3+
- **Message Broker**: RabbitMQ 3.12+
- **Language**: TypeScript 5.9+

### Database
- **Primary**: PostgreSQL 16+
- **Cache**: Redis 7+ (optional)
- **Search**: Elasticsearch (optional)

### Frontend
- **Framework**: React 18+
- **UI Library**: Tailwind CSS 3+
- **Build Tool**: Vite 5+
- **HTTP Client**: Axios

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Monitoring**: (To be configured)

---

## Service Details

### 1. API Gateway (Port 3000)

**Responsibility**: Request routing, authentication, load balancing

```typescript
// Route requests to appropriate services
POST /api/auth/*      → Auth Service
POST /api/tasks/*     → Tasks Service
GET  /api/tasks/*     → Tasks Service
```

**Key Features**:
- JWT token validation
- Request/response transformation
- Error handling & status codes
- CORS configuration
- Rate limiting

**Technologies**: NestJS, @nestjs/microservices

### 2. Auth Service (Port 3001)

**Responsibility**: User authentication, authorization, token management

**Endpoints**:
```
POST   /auth/register       - Register new user
POST   /auth/login          - Login & get tokens
POST   /auth/refresh        - Refresh access token
GET    /auth/profile        - Get current user
PUT    /auth/profile        - Update profile
```

**Database Tables**:
- `users` - User credentials & info
- `refresh_tokens` - Token refresh mechanism

**Key Features**:
- Password hashing (Argon2)
- JWT token generation
- Refresh token rotation
- Role-based access control

### 3. Tasks Service (Port 3002)

**Responsibility**: Task management, CRUD operations, history tracking

**Endpoints**:
```
GET    /tasks              - List all tasks
GET    /tasks/:id          - Get task details
POST   /tasks              - Create new task
PUT    /tasks/:id          - Update task
DELETE /tasks/:id          - Delete task
```

**Database Tables**:
- `tasks` - Task records
- `task_assignees` - User assignments
- `task_comments` - Comments on tasks
- `task_history` - Audit trail

**Key Features**:
- Task filtering & pagination
- Comment management
- History tracking
- Assignment management

### 4. Notifications Service (Port 3003)

**Responsibility**: Event processing, notification delivery

**Events**:
- User registered
- Task created/updated/deleted
- Task assigned
- Comment added

**Key Features**:
- RabbitMQ consumer
- Notification persistence
- Email/SMS integration (optional)

---

## Data Flow

### User Registration Flow
```
1. User POSTs /api/auth/register
   ↓
2. API Gateway validates request
   ↓
3. Auth Service creates user in DB
   ↓
4. Auth Service publishes "user.created" event
   ↓
5. Notifications Service receives event
   ↓
6. Send welcome notification
   ↓
7. Return tokens to client
```

### Task Creation Flow
```
1. User POSTs /api/tasks (with JWT token)
   ↓
2. API Gateway validates JWT
   ↓
3. Tasks Service creates task in DB
   ↓
4. Tasks Service publishes "task.created" event
   ↓
5. Notifications Service receives event
   ↓
6. Create history record
   ↓
7. Send notifications to assignees
   ↓
8. Return task data to client
```

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR UNIQUE NOT NULL,
  displayName VARCHAR NOT NULL,
  passwordHash VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'member',
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR NOT NULL,
  description TEXT,
  priority VARCHAR DEFAULT 'medium',
  status VARCHAR DEFAULT 'todo',
  dueDate DATE,
  createdById UUID REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);
```

### Task Assignees Table
```sql
CREATE TABLE task_assignees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taskId UUID REFERENCES tasks(id) ON DELETE CASCADE,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  assignedAt TIMESTAMP DEFAULT now()
);
```

### Task Comments Table
```sql
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taskId UUID REFERENCES tasks(id) ON DELETE CASCADE,
  authorId UUID REFERENCES users(id),
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT now(),
  updatedAt TIMESTAMP DEFAULT now()
);
```

### Task History Table
```sql
CREATE TABLE task_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taskId UUID REFERENCES tasks(id) ON DELETE CASCADE,
  action VARCHAR NOT NULL,
  metadata JSONB,
  performedById UUID REFERENCES users(id),
  createdAt TIMESTAMP DEFAULT now()
);
```

---

## Design Decisions

### 1. Why Microservices?
**Decision**: Use microservices architecture

**Reasoning**:
- Different scaling needs per service
- Independent deployment cycles
- Fault isolation
- Technology flexibility

**Tradeoff**: Added operational complexity

### 2. Why RabbitMQ?
**Decision**: Use RabbitMQ for async communication

**Reasoning**:
- Reliable message delivery
- Event sourcing capability
- Loose coupling between services
- Easy to scale consumers

**Alternative Considered**: Apache Kafka (for higher throughput)

### 3. Why PostgreSQL?
**Decision**: Use PostgreSQL as primary database

**Reasoning**:
- ACID compliance
- JSON support (JSONB)
- Strong query language
- Excellent NestJS/TypeORM support

**Alternative Considered**: MongoDB (for schema flexibility)

### 4. Why TypeORM?
**Decision**: Use TypeORM as ORM

**Reasoning**:
- Native TypeScript support
- Migration system
- Relation management
- Active Query Builder

**Alternative Considered**: Prisma (newer, but less mature)

### 5. Authentication Strategy
**Decision**: JWT with refresh tokens

**Reasoning**:
- Stateless authentication
- Scales well across services
- Secure token rotation
- Industry standard

**Flow**:
```
1. Login → Get access token (15m) + refresh token (7d)
2. Request with access token
3. Token expired → Use refresh token to get new one
4. Refresh token expired → Re-login required
```

---

## Deployment Considerations

### High Availability
1. Run multiple instances behind load balancer
2. Use managed PostgreSQL service
3. RabbitMQ cluster for resilience
4. Health checks on all services

### Monitoring
```typescript
// Add monitoring for:
- API response times
- Error rates
- Database query performance
- Message queue depth
- Service availability
```

### Scaling Strategy
```
1. Vertical: Increase resources (CPU/RAM)
2. Horizontal: Add more service instances
3. Database: Connection pooling, read replicas
4. Message Queue: Multiple consumers
```

---

## Security Considerations

1. **Authentication**: JWT with secure secrets
2. **Authorization**: Role-based access control
3. **Validation**: Input validation on all endpoints
4. **Encryption**: HTTPS in production
5. **Secrets**: Environment variables, not in code
6. **SQL Injection**: Use parameterized queries (TypeORM)
7. **CORS**: Whitelist allowed origins

---

## Future Enhancements

1. **GraphQL**: Add GraphQL layer
2. **Caching**: Redis for session/data caching
3. **Search**: Elasticsearch for full-text search
4. **Analytics**: Event tracking & analytics
5. **Real-time**: WebSocket for live updates
6. **Kubernetes**: Migrate to K8s from Docker Compose
7. **CI/CD**: Automated testing & deployment

---

**Last Updated**: October 30, 2025
