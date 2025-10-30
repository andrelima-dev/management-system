# 📖 Documentation Index

Quick navigation to all documentation.

---

## 🚀 Getting Started

**New to the project?** Start here:

1. **[README.md](./README.md)** - Overview and quick start (5 min)
2. **[SETUP.md](./SETUP.md)** - Complete setup guide (30 min)
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - How it works (20 min)

---

## 📚 Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| **README.md** | Project overview, features, quick start | Everyone |
| **SETUP.md** | Installation, configuration, deployment | Developers, DevOps |
| **ARCHITECTURE.md** | System design, tech stack, decisions | Architects, Tech Leads |
| **API.md** | Endpoint reference, examples | Developers, Frontend |
| **CHANGELOG.md** | Version history, what changed | Everyone |

---

## 🔍 By Role

### I'm a Developer
1. README.md → SETUP.md → Start coding!
2. Reference API.md for endpoints
3. Check CHANGELOG.md for updates

### I'm a DevOps Engineer
1. SETUP.md → Deployment section
2. ARCHITECTURE.md → Infrastructure
3. Docker Compose configuration

### I'm a Tech Lead / Architect
1. ARCHITECTURE.md → Full overview
2. API.md → Integration points
3. CHANGELOG.md → Version status

### I'm QA / Tester
1. SETUP.md → Local development
2. API.md → Endpoints to test
3. README.md → Features overview

---

## 🔗 Quick Links

### Setup & Installation
- [Local Development](./SETUP.md#local-setup)
- [Docker Setup](./SETUP.md#docker-deployment)
- [Environment Variables](./SETUP.md#setup-environment)

### Development
- [Architecture Overview](./ARCHITECTURE.md#overview)
- [Service Details](./ARCHITECTURE.md#service-details)
- [Database Schema](./ARCHITECTURE.md#database-schema)

### API Integration
- [Authentication](./API.md#authentication)
- [Tasks Endpoints](./API.md#tasks)
- [Error Handling](./API.md#error-handling)

### Operations
- [Docker Commands](./SETUP.md#docker-commands)
- [Database Management](./SETUP.md#database-management)
- [Troubleshooting](./SETUP.md#troubleshooting)

---

## ✅ What's Included

### Core Features
- ✅ User Authentication (JWT)
- ✅ Task Management (CRUD)
- ✅ User Notifications
- ✅ History Tracking
- ✅ Role-Based Access

### Technology
- ✅ NestJS Microservices
- ✅ PostgreSQL Database
- ✅ RabbitMQ Messaging
- ✅ React Frontend
- ✅ Docker Deployment

### Documentation
- ✅ README (overview)
- ✅ SETUP (installation)
- ✅ ARCHITECTURE (design)
- ✅ API (reference)
- ✅ CHANGELOG (history)

---

## 🚀 Quick Start

### 5 Minutes (Docker)
```bash
docker-compose up -d
# Open http://localhost:5173
```

### 15 Minutes (Development)
```bash
pnpm install
docker-compose up -d postgres
pnpm run migration:run
pnpm dev
```

### 30 Minutes (Full Setup)
See [SETUP.md](./SETUP.md)

---

## 📞 Support

1. **Installation Issues** → [SETUP.md Troubleshooting](./SETUP.md#troubleshooting)
2. **Architecture Questions** → [ARCHITECTURE.md](./ARCHITECTURE.md)
3. **API Questions** → [API.md](./API.md)
4. **Version Info** → [CHANGELOG.md](./CHANGELOG.md)

---

## 📦 Files Structure

```
├── README.md              👈 Start here!
├── SETUP.md               📖 How to setup
├── ARCHITECTURE.md        🏗️  System design
├── API.md                 🔌 API reference
├── CHANGELOG.md           📝 Version history
├── INDEX.md              🗂️  This file
├── .env.example          ⚙️  Configuration
│
├── apps/                 📦 Microservices
│   ├── api-gateway/
│   ├── auth-service/
│   ├── tasks-service/
│   ├── notifications-service/
│   └── web/
│
└── packages/             📚 Shared code
    ├── types/
    ├── ui-kit/
    └── utils/
```

---

## 🎯 Next Steps

1. **Learn**: Read the documentation relevant to your role
2. **Setup**: Follow SETUP.md for your environment
3. **Build**: Start developing with the guidance in README.md
4. **Reference**: Use API.md and ARCHITECTURE.md when needed

---

**Last Updated**: October 30, 2025
