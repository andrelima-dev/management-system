# Setup & Deployment Guide

Complete guide for setting up, configuring, and deploying the Jungle Task System.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Setup](#local-setup)
3. [Docker Deployment](#docker-deployment)
4. [Database Management](#database-management)
5. [Migrations](#migrations)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- **Node.js**: 18.x or higher
- **pnpm**: 9.x (`npm install -g pnpm@9`)
- **Docker**: 24.x or higher
- **Docker Compose**: 2.20.x or higher
- **Git**: 2.40.x or higher

### Verify Installation
```bash
node --version
pnpm --version
docker --version
docker-compose --version
```

---

## Local Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd management-system
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
DATABASE_URL=postgresql://jungle:jungle_pass@localhost:5432/jungle
RABBITMQ_URL=amqp://guest:guest@localhost:5672
JWT_SECRET=your-secret-key-change-in-production
```

### 4. Start Services

**Option A: Full Docker Setup (Recommended)**
```bash
docker-compose up -d
```

**Option B: Manual Setup**
```bash
# Terminal 1: Start PostgreSQL
docker-compose up -d postgres

# Terminal 2: Start RabbitMQ
docker-compose up -d rabbitmq

# Terminal 3: Run migrations and start services
pnpm run migration:run
pnpm dev
```

### 5. Verify Setup
```bash
# Check running services
docker-compose ps

# Access frontend
open http://localhost:5173

# Test API
curl http://localhost:3000/api/health
```

---

## Docker Deployment

### Quick Start
```bash
# Build and start all services
docker-compose up -d

# Watch logs
docker-compose logs -f

# Verify all services are running
docker-compose ps
```

### Service Ports
| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| API Gateway | 3000 | http://localhost:3000 |
| Auth Service | 3001 | http://localhost:3001 |
| Tasks Service | 3002 | http://localhost:3002 |
| Notifications | 3003 | http://localhost:3003 |
| PostgreSQL | 5432 | localhost:5432 |
| RabbitMQ | 5672 | amqp://localhost:5672 |

### Common Docker Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs of all services
docker-compose logs -f

# View logs of specific service
docker-compose logs -f auth-service

# Restart a service
docker-compose restart tasks-service

# Rebuild images
docker-compose build --no-cache

# Remove everything (⚠️ data loss)
docker-compose down -v
```

---

## Database Management

### PostgreSQL Access
```bash
# Access database CLI
docker-compose exec postgres psql -U jungle -d jungle

# Useful psql commands
\dt                           # List tables
\d+ users                     # Describe table
SELECT * FROM users LIMIT 5;  # Query data
```

### Database Backup
```bash
# Backup database
docker-compose exec postgres pg_dump -U jungle jungle > backup.sql

# Restore database
docker-compose exec postgres psql -U jungle jungle < backup.sql
```

### Reset Database
```bash
# ⚠️ WARNING: This deletes all data
docker-compose down -v
docker-compose up -d postgres
pnpm run migration:run
```

---

## Migrations

### Understanding Migrations
Migrations are TypeScript files that manage database schema changes:
- Located in: `apps/*/migrations/`
- Named with timestamp: `1700000001000-CreateUsersTable.ts`
- Auto-discovered by TypeORM

### Run Migrations
```bash
# Run pending migrations
pnpm run migration:run

# Run for specific service
cd apps/auth-service && pnpm run migration:run
cd apps/tasks-service && pnpm run migration:run
```

### Create Migration
```bash
cd apps/auth-service
pnpm run migration:generate -- -n CreateNewTable
# Edit the generated file in migrations/
pnpm run migration:run
```

### Revert Migration
```bash
cd apps/auth-service
pnpm run migration:revert
```

### Migration Files
```typescript
// migrations/1700000001000-CreateUsersTable.ts
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1700000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          { name: "id", type: "uuid", isPrimary: true },
          { name: "email", type: "varchar", isUnique: true },
          // ... more columns
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users");
  }
}
```

---

## Testing API Endpoints

### Using cURL
```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Password123",
    "displayName":"Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"Password123"
  }'

# Create task (requires token)
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"My Task",
    "description":"Task description"
  }'
```

### Using Postman
1. Import endpoints from API reference
2. Set `Authorization` header with bearer token
3. Test each endpoint

---

## Troubleshooting

### Services won't start
```bash
# Check Docker status
docker ps
docker-compose ps

# View error logs
docker-compose logs

# Restart Docker daemon
# macOS: Restart Docker Desktop
# Linux: systemctl restart docker
```

### Database connection errors
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check database exists
docker-compose exec postgres psql -U jungle -d jungle -c "\dt"

# Restart PostgreSQL
docker-compose restart postgres
```

### Port already in use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in .env or docker-compose.yml
```

### Migration failures
```bash
# Check migration files
ls apps/auth-service/migrations/

# Run migrations with output
pnpm run migration:run -- --verbose

# Reset and re-run
docker-compose exec postgres psql -U jungle jungle -c "DELETE FROM migrations;"
pnpm run migration:run
```

### TypeScript compilation errors
```bash
# Clear cache and rebuild
rm -rf node_modules/.pnpm
pnpm install
pnpm build
```

---

## Production Deployment

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backed up
- [ ] SSL certificates configured
- [ ] CORS settings configured
- [ ] Rate limiting enabled

### Deploy Steps
```bash
# 1. Build images
docker-compose build --no-cache

# 2. Start services
docker-compose up -d

# 3. Verify health
curl http://localhost:3000/health

# 4. Check logs
docker-compose logs
```

### Health Checks
```bash
# API Gateway
curl http://localhost:3000/health

# Auth Service
curl http://localhost:3001/health

# Tasks Service
curl http://localhost:3002/health
```

---

## Performance Tips

1. **Database**: Add indexes on frequently queried columns
2. **Caching**: Implement Redis for session caching
3. **Rate Limiting**: Configure in API Gateway
4. **Monitoring**: Setup logs aggregation
5. **Scaling**: Use Kubernetes for horizontal scaling

---

## Support

For issues or questions:
1. Check logs: `docker-compose logs`
2. Review troubleshooting section above
3. Check GitHub Issues
4. Review ARCHITECTURE.md for design decisions

---

**Last Updated**: October 30, 2025
