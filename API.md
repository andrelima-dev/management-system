# API Reference

Complete API documentation for the Jungle Task System.

**Base URL**: `http://localhost:3000`

---

## Table of Contents

1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Tasks](#tasks)
4. [Notifications](#notifications)
5. [Error Handling](#error-handling)
6. [Status Codes](#status-codes)

---

## Authentication

### Register User

Create a new user account.

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "displayName": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "member"
  }
}
```

**Errors**:
- `400` - Invalid email or weak password
- `409` - Email already exists

---

### Login

Authenticate and receive tokens.

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "displayName": "John Doe",
    "role": "member"
  }
}
```

**Errors**:
- `401` - Invalid credentials
- `404` - User not found

---

### Refresh Token

Get a new access token using refresh token.

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- `401` - Invalid or expired refresh token

---

## User Management

### Get Profile

Get current user profile information.

```http
GET /api/auth/profile
Authorization: Bearer <accessToken>
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "displayName": "John Doe",
  "role": "member",
  "createdAt": "2025-10-30T14:09:10.641Z",
  "updatedAt": "2025-10-30T14:09:10.641Z"
}
```

**Errors**:
- `401` - Unauthorized
- `404` - User not found

---

### Update Profile

Update current user information.

```http
PUT /api/auth/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "displayName": "Jane Doe",
  "email": "newemail@example.com"
}
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "newemail@example.com",
  "displayName": "Jane Doe",
  "role": "member",
  "updatedAt": "2025-10-30T15:30:00.000Z"
}
```

**Errors**:
- `401` - Unauthorized
- `400` - Invalid data
- `409` - Email already in use

---

## Tasks

### List Tasks

Retrieve all tasks with pagination.

```http
GET /api/tasks?page=1&pageSize=10&status=todo&priority=high
Authorization: Bearer <accessToken>
```

**Query Parameters**:
- `page` (optional) - Page number (default: 1)
- `pageSize` (optional) - Items per page (default: 10, max: 100)
- `status` (optional) - Filter by status (todo, in_progress, done)
- `priority` (optional) - Filter by priority (low, medium, high)
- `search` (optional) - Search in title/description

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Complete project",
      "description": "Finish the new feature",
      "priority": "high",
      "status": "in_progress",
      "dueDate": "2025-11-15",
      "createdById": "550e8400-e29b-41d4-a716-446655440001",
      "createdAt": "2025-10-30T14:09:10.641Z",
      "updatedAt": "2025-10-30T15:30:00.000Z",
      "assignees": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "displayName": "John Doe"
        }
      ],
      "commentsCount": 3
    }
  ],
  "total": 25,
  "page": 1,
  "pageSize": 10
}
```

**Errors**:
- `401` - Unauthorized

---

### Get Task

Retrieve a specific task by ID.

```http
GET /api/tasks/:id
Authorization: Bearer <accessToken>
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project",
  "description": "Finish the new feature",
  "priority": "high",
  "status": "in_progress",
  "dueDate": "2025-11-15",
  "createdById": "550e8400-e29b-41d4-a716-446655440001",
  "createdAt": "2025-10-30T14:09:10.641Z",
  "updatedAt": "2025-10-30T15:30:00.000Z",
  "assignees": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "displayName": "John Doe"
    }
  ],
  "comments": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "content": "Progress update: 50% complete",
      "authorId": "550e8400-e29b-41d4-a716-446655440001",
      "createdAt": "2025-10-30T14:30:00.000Z"
    }
  ],
  "history": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440003",
      "action": "task.created",
      "performedById": "550e8400-e29b-41d4-a716-446655440001",
      "createdAt": "2025-10-30T14:09:10.641Z"
    }
  ]
}
```

**Errors**:
- `401` - Unauthorized
- `404` - Task not found

---

### Create Task

Create a new task.

```http
POST /api/tasks
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "New task",
  "description": "Task description",
  "priority": "medium",
  "dueDate": "2025-11-15"
}
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "New task",
  "description": "Task description",
  "priority": "medium",
  "status": "todo",
  "dueDate": "2025-11-15",
  "createdById": "550e8400-e29b-41d4-a716-446655440001",
  "createdAt": "2025-10-30T14:09:10.641Z",
  "updatedAt": "2025-10-30T14:09:10.641Z",
  "assignees": [],
  "comments": [],
  "history": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "action": "task.created",
      "performedById": "550e8400-e29b-41d4-a716-446655440001",
      "createdAt": "2025-10-30T14:09:10.641Z"
    }
  ]
}
```

**Errors**:
- `401` - Unauthorized
- `400` - Invalid data

---

### Update Task

Update an existing task.

```http
PUT /api/tasks/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2025-11-20"
}
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Updated title",
  "status": "in_progress",
  "priority": "high",
  "dueDate": "2025-11-20",
  "updatedAt": "2025-10-30T15:30:00.000Z",
  "history": [
    {
      "action": "task.updated",
      "metadata": {
        "title": "Updated title",
        "status": "in_progress"
      },
      "performedById": "550e8400-e29b-41d4-a716-446655440001",
      "createdAt": "2025-10-30T15:30:00.000Z"
    }
  ]
}
```

**Errors**:
- `401` - Unauthorized
- `404` - Task not found
- `400` - Invalid data

---

### Delete Task

Delete a task.

```http
DELETE /api/tasks/:id
Authorization: Bearer <accessToken>
```

**Response** (204 No Content)

**Errors**:
- `401` - Unauthorized
- `404` - Task not found

---

## Notifications

### List Notifications

Get all notifications for current user.

```http
GET /api/notifications?page=1&pageSize=20&unreadOnly=false
Authorization: Bearer <accessToken>
```

**Query Parameters**:
- `page` (optional) - Page number (default: 1)
- `pageSize` (optional) - Items per page (default: 20)
- `unreadOnly` (optional) - Show only unread (default: false)

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "task.created",
      "message": "New task assigned to you",
      "data": {
        "taskId": "550e8400-e29b-41d4-a716-446655440001"
      },
      "isRead": false,
      "createdAt": "2025-10-30T15:30:00.000Z"
    }
  ],
  "total": 5,
  "unreadCount": 3
}
```

**Errors**:
- `401` - Unauthorized

---

### Mark Notification as Read

Mark a notification as read.

```http
PUT /api/notifications/:id/read
Authorization: Bearer <accessToken>
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "isRead": true
}
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Invalid input",
  "error": "Bad Request"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 204 | No Content - Success, no content to return |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource conflict (e.g., duplicate email) |
| 500 | Server Error - Internal server error |

---

## Authentication Headers

All protected endpoints require:

```http
Authorization: Bearer <accessToken>
```

**Token Example**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NTBlODQwMC1lMjliLTQxZDQtYTcxNi00NDY2NTU0NDAwMDAiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE2OTkwMDA0MDB9.signature
```

---

## Rate Limiting

API requests are rate limited:

- **Default**: 100 requests per minute per IP
- **Headers**:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1699000500
  ```

---

## Testing the API

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "displayName": "Test User"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'

# Create task (save token first)
TOKEN="your_access_token_here"
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My first task",
    "priority": "high"
  }'
```

### Using Postman

1. Import this collection into Postman
2. Set `{{baseUrl}}` variable to `http://localhost:3000`
3. Run endpoints in order
4. Tokens are automatically saved to variables

---

**Last Updated**: October 30, 2025
