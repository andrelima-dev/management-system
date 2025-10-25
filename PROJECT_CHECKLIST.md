<!-- PROJECT_CHECKLIST.md -->

# 🎯 Jungle Tasks - Project Checklist

## Backend Services

### 1️⃣ Auth Service ⚙️
- [ ] User entity (id, email, username, password_hash, createdAt, updatedAt)
- [ ] Register endpoint with email validation & bcrypt
- [ ] Login endpoint returning JWT tokens
- [ ] Refresh token endpoint with separate table
- [ ] Unit tests for Auth logic
- [ ] Error handling (duplicate email, wrong password, etc)

### 2️⃣ Tasks Service 📝
- [ ] Task entity (id, title, description, deadline, priority, status, assignee_id, creator_id)
- [ ] GET /tasks with filters & pagination
- [ ] POST /tasks (create)
- [ ] PUT /tasks/:id (update)
- [ ] DELETE /tasks/:id
- [ ] Validation: title min 3 chars, valid deadline, valid priority/status
- [ ] Publish events to RabbitMQ
- [ ] Unit tests

### 3️⃣ Comments Service 💬
- [ ] Comment entity (id, task_id, user_id, content, createdAt)
- [ ] GET /tasks/:id/comments
- [ ] POST /tasks/:id/comments
- [ ] Comment validation
- [ ] Publish comment.added event

### 4️⃣ Task History 📊
- [ ] TaskHistory entity (id, task_id, user_id, change_type, old_value, new_value, timestamp)
- [ ] Auto-log all changes
- [ ] GET /tasks/:id/history endpoint

### 5️⃣ Notifications Service 🔔
- [ ] Notifications entity (id, user_id, message, type, read, createdAt)
- [ ] RabbitMQ consumer for events
- [ ] GET /notifications (with read filter)
- [ ] PATCH /notifications/:id/read
- [ ] Cleanup old notifications

### 6️⃣ API Gateway 🚪
- [ ] HTTP proxy to all services
- [ ] JWT auth middleware
- [ ] Socket.IO setup
- [ ] Rate limiter (@nestjs/throttler)
- [ ] Swagger/OpenAPI docs
- [ ] Global error handler
- [ ] Logging middleware
- [ ] CORS configuration

---

## Frontend Pages

### 1️⃣ Login Page 🔐
- [ ] Email input with validation
- [ ] Password input
- [ ] Submit button
- [ ] Error messages display
- [ ] Loading state
- [ ] Redirect to dashboard after login
- [ ] Remember me (localStorage)

### 2️⃣ Tasks List Page 📋
- [ ] Display all tasks in cards/table
- [ ] Filter by: status, priority, assignee
- [ ] Sort by: deadline, priority, created date
- [ ] Pagination
- [ ] Create new task button
- [ ] Edit task button (inline or modal)
- [ ] Delete task button with confirmation
- [ ] Loading states
- [ ] Empty state

### 3️⃣ Task Detail Page 🔍
- [ ] Display all task fields
- [ ] Edit title, description, deadline, priority, status
- [ ] Assign to user dropdown
- [ ] Comments section
  - [ ] List comments with user avatar & timestamp
  - [ ] Add comment form
  - [ ] Delete comment
- [ ] History/timeline of changes
- [ ] Back button
- [ ] Loading states

### 4️⃣ Notifications UI 🔔
- [ ] Notification bell icon with red badge (unread count)
- [ ] Dropdown menu showing last 5 notifications
- [ ] Mark as read button
- [ ] Toast notifications for real-time updates
- [ ] Click notification to go to related task
- [ ] Notification types: task assigned, status changed, comment added

### 5️⃣ Navigation & Auth 🛣️
- [ ] Header with logo, menu, user dropdown
- [ ] User dropdown: Profile, Settings, Logout
- [ ] Sidebar with links: Tasks, Notifications, Settings
- [ ] PrivateRoute wrapper for protected pages
- [ ] Redirect to login if no token
- [ ] Auto-refresh token before expiry
- [ ] Logout clears localStorage and redirects

---

## Real-Time & Integration

### WebSocket 🔌
- [ ] Socket.IO client in React
- [ ] Connect to API Gateway on mount
- [ ] Listen for: task_assigned, task_status_changed, comment_added events
- [ ] Auto-reconnect on disconnect
- [ ] Update UI when events received
- [ ] Disconnect on unmount

### RabbitMQ 🐰
- [ ] Tasks Service publishes task events
- [ ] Notifications Service consumes events
- [ ] Event schema defined for each type:
  - [ ] task.created (title, id, creator_id)
  - [ ] task.updated (task_id, changed_fields)
  - [ ] task.assigned (task_id, assigned_to_id, assigned_by_id)
  - [ ] comment.added (task_id, comment_id, user_id)

---

## Data Persistence

### Migrations & Schema ✅
- [ ] Users table
- [ ] Tasks table
- [ ] Comments table
- [ ] TaskHistory table
- [ ] Notifications table
- [ ] RefreshTokens table
- [ ] Relationships & foreign keys
- [ ] Indexes for performance
- [ ] Auto-run on service startup

### Seed Data 🌱
- [ ] Create test users: user1@test.com, user2@test.com
- [ ] Create sample tasks
- [ ] Script: `pnpm run seed`

---

## Quality Assurance

### Unit Tests ✅
- [ ] Auth Service (register, login, refresh)
- [ ] Tasks Service (CRUD, validations)
- [ ] Comments Service
- [ ] Notifications Service
- [ ] Target: 70%+ coverage

### E2E Tests 🧪
- [ ] Login flow
- [ ] Create task
- [ ] Assign task to user
- [ ] Add comment
- [ ] See notification update
- [ ] Logout

### Manual Testing ✔️
- [ ] Test login with invalid credentials
- [ ] Test task deadline validation
- [ ] Test concurrent task updates
- [ ] Test WebSocket reconnection
- [ ] Test browser back/forward buttons

---

## DevOps & Deployment

### Docker 🐳
- [ ] Each service runs successfully in Docker
- [ ] Health checks configured
- [ ] Environment variables properly passed
- [ ] Volumes for development (hot reload)
- [ ] Production-ready multi-stage builds

### CI/CD 🚀
- [ ] GitHub Actions: lint on PR
- [ ] GitHub Actions: tests on PR
- [ ] GitHub Actions: build Docker images
- [ ] Auto-deploy on merge to main

### Monitoring 📊
- [ ] Logs aggregated (Winston or similar)
- [ ] Error tracking (Sentry or similar)
- [ ] Performance metrics
- [ ] Uptime monitoring

---

## Documentation 📚

- [x] ARCHITECTURE.md - Technical design
- [x] GETTING_STARTED.md - Local setup
- [x] CODE_EXAMPLES.md - Implementation patterns
- [x] README.md - Project overview
- [x] STATUS.md - Current progress
- [ ] API.md - API endpoint documentation
- [ ] TROUBLESHOOTING.md - Common issues & solutions
- [ ] CONTRIBUTING.md - How to contribute
- [ ] DEPLOYMENT.md - Production deployment guide

---

## Security 🔐

- [ ] JWT token validation in every request
- [ ] Password hashing with bcrypt (rounds >= 10)
- [ ] CORS configured properly
- [ ] Helmet headers enabled
- [ ] Rate limiting on auth endpoints
- [ ] SQL injection prevention (TypeORM parameterized)
- [ ] XSS protection in React
- [ ] CSRF tokens for state-changing operations
- [ ] Environment variables not in git (.env.example only)

---

## Performance ⚡

- [ ] Database queries optimized (proper indexes)
- [ ] N+1 query prevention
- [ ] Pagination on large lists
- [ ] Image compression/lazy loading (if applicable)
- [ ] Code splitting in React
- [ ] Caching headers configured
- [ ] Gzip compression enabled

---

## Summary Statistics 📈

```
Total Tasks: 80+
Completed: ~5 (infrastructure & docs)
In Progress: 0
Not Started: 75+

By Category:
- Backend Services: 20 tasks
- Frontend Pages: 15 tasks
- Real-Time: 10 tasks
- Data Layer: 8 tasks
- Quality: 12 tasks
- DevOps: 10 tasks
- Documentation: 7 tasks

Estimated Total Time: 54-70 hours
Current Progress: ~10%
```

---

**Last Updated:** 24 de outubro de 2025  
**Next Review:** After implementing Auth Service
