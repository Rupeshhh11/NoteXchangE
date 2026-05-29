# NoteXchangE Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React + Vite)                 │
│                      http://localhost:3000                      │
├─────────────────────────────────────────────────────────────────┤
│  - Responsive UI (Mobile, Tablet, Desktop)                      │
│  - Real-time updates via Socket.io                              │
│  - State management with Zustand                                │
│  - API calls via Axios with JWT auth                            │
└────────────────┬──────────────────────────────────────────────┬─┘
                 │                                              │
           HTTP/REST                                    WebSocket (Socket.io)
                 │                                              │
┌────────────────▼──────────────────────────────────────────────▼─┐
│                  Backend (Node.js + Express)                    │
│                    http://localhost:5000                        │
├──────────────────────────────────────────────────────────────────┤
│  Authentication → JWT Verification → Route Handler              │
│  ├─ /api/auth     (Login, Register, Logout)                     │
│  ├─ /api/users    (Profile Management)                          │
│  ├─ /api/tasks    (Task CRUD)                                   │
│  ├─ /api/bids     (Bidding System)                              │
│  ├─ /api/payments (Razorpay Integration)                        │
│  ├─ /api/messages (Real-time Messaging)                         │
│  ├─ /api/reviews  (Rating System)                               │
│  └─ /api/admin    (Admin Dashboard)                             │
│                                                                  │
│  Services Layer:                                                │
│  ├─ Auth Service (JWT, Password hashing)                        │
│  ├─ Payment Service (Razorpay integration)                      │
│  ├─ Email Service (Nodemailer)                                  │
│  └─ File Service (Multer uploads)                               │
└────────────────┬──────────────────────────────────────────────┬─┘
                 │                                              │
                 └──────────────────┬───────────────────────────┘
                                    │
                          PostgreSQL (Database)
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
    ┌───▼────┐  ┌────────┐  ┌──────▼────┐  ┌────────┐  ┌───────▼──┐
    │  Users │  │  Tasks │  │   Bids    │  │Payment │  │  Reviews │
    └────────┘  └────────┘  └───────────┘  └────────┘  └──────────┘
    ┌──────────┐  ┌──────────┐  ┌──────────┐
    │ Wallets  │  │ Messages │  │ Sessions │
    └──────────┘  └──────────┘  └──────────┘
```

## Request/Response Flow

### Example: Task Creation Flow

```
1. User clicks "Create Task" in Frontend
              │
              ▼
2. React Form collects data
              │
              ▼
3. Sends POST /api/tasks with JWT token
              │
              ▼
4. Express receives request
              │
              ▼
5. Authentication middleware verifies JWT
              │
              ▼
6. Task Controller validates data with Joi
              │
              ▼
7. Service layer creates task in database
              │
              ▼
8. Task created successfully
              │
              ▼
9. Response sent back to frontend with task ID
              │
              ▼
10. Frontend updates UI and redirects
```

## Authentication Flow

```
1. User enters email/password
        │
        ▼
2. Frontend sends POST /auth/login
        │
        ▼
3. Backend finds user by email
        │
        ▼
4. Compares password with bcrypt
        │
        ▼
5. Generate JWT tokens
   - accessToken (expires in 7 days)
   - refreshToken (expires in 30 days)
        │
        ▼
6. Return tokens to frontend
        │
        ▼
7. Frontend stores tokens in localStorage
        │
        ▼
8. Subsequent requests include JWT in Authorization header
   Authorization: Bearer <accessToken>
        │
        ▼
9. Middleware verifies token before allowing access
```

## Real-time Communication (Socket.io)

```
Frontend                              Backend
  │                                     │
  ├─────── socket.emit('join-chat') ──→│
  │                                     │
  │   ← socket.on('joined-chat') ──────┤
  │                                     │
  ├─ socket.emit('send-message') ────→│
  │                                     ├─ store message
  │                                     ├─ broadcast to room
  │   ← socket.on('receive-message') ──┤
  │                                     │
  └─────── socket.disconnect() ──────→│
```

## Database Schema Relationships

```
User
├── 1:N → Task (as clientId)
├── 1:N → Bid (as serviceProviderId)
├── 1:N → Message (as senderId or recipientId)
├── 1:N → Review (as fromUserId or toUserId)
├── 1:1 → Wallet (userId)
└── 1:N → Payment (as clientId or serviceProviderId)

Task
├── N:1 ← User (clientId)
├── 1:N → Bid (taskId)
├── 1:N → Message (taskId)
├── 1:N → Payment (taskId)
└── 1:N → Review (taskId)

Bid
├── N:1 ← Task (taskId)
├── N:1 ← User (serviceProviderId)
└── 1:N → Payment (implied through Task)

Payment
├── N:1 ← Task (taskId)
├── N:1 ← User (clientId & serviceProviderId)
└── Reference → Bid (via Task)
```

## Middleware Stack

```
Express Application
    │
    ├─ Helmet (Security headers)
    │
    ├─ CORS (Cross-origin requests)
    │
    ├─ Morgan (Request logging)
    │
    ├─ JSON Parser (Parse request bodies)
    │
    ├─ Static files (/uploads)
    │
    ├─ Routes
    │   │
    │   ├─ Public Routes
    │   │   ├─ POST /auth/register
    │   │   └─ POST /auth/login
    │   │
    │   ├─ Protected Routes (auth middleware)
    │   │   ├─ POST /tasks (any authenticated user)
    │   │   ├─ GET /tasks/:id
    │   │   ├─ POST /messages
    │   │   └─ ...more routes
    │   │
    │   └─ Admin Routes (auth + authorize middleware)
    │       ├─ GET /admin/users
    │       └─ GET /admin/tasks
    │
    ├─ Error Handler
    │
    └─ 404 Handler
```

## File Upload Flow

```
1. User selects file in frontend form
              │
              ▼
2. FormData created with file
              │
              ▼
3. Sent to backend: POST /upload
              │
              ▼
4. Multer middleware processes upload
              │
              ▼
5. File saved to /uploads directory
              │
              ▼
6. File path/URL returned
              │
              ▼
7. Path saved in database
              │
              ▼
8. File accessible via /uploads/filename
```

## Payment Integration (Razorpay)

```
Client                  Frontend              Backend              Razorpay
  │                       │                     │                    │
  ├─ Initiates Payment   │                     │                    │
  │                       │                     │                    │
  │   POST /create-order │                     │                    │
  ├──────────────────────→│                     │                    │
  │                       │                     │                    │
  │   POST /create-order  │                     │                    │
  │  (with amount)        ├────────────────────→│                    │
  │                       │                     │                    │
  │                       │   POST /orders      │                    │
  │                       │  (with auth)        ├───────────────────→│
  │                       │                     │                    │
  │                       │                     │← Order Created     │
  │                       │← Order ID           │                    │
  │                       │←────────────────────┤                    │
  │                       │←────────────────────┤                    │
  │                       │                     │                    │
  │ Opens Razorpay Modal  │                     │                    │
  │←──────────────────────┤                     │                    │
  │                       │                     │                    │
  │  Enters Card Details  │                     │                    │
  ├──────────────────────→│                     │                    │
  │  Completes Payment    │                     │                    │
  │                       │                     │                    │
  │ Razorpay Callback     │                     │                    │
  │  with signature       │                     │                    │
  ├──────────────────────→│                     │                    │
  │                       │ POST /verify        │                    │
  │                       │  (paymentId,        │                    │
  │                       │   signature)        │                    │
  │                       ├────────────────────→│                    │
  │                       │                     │ Verify Signature   │
  │                       │                     │                    │
  │                       │← Payment Verified   │                    │
  │                       │←────────────────────┤                    │
  │                       │                     │                    │
  │ Payment Success       │                     │                    │
  │←──────────────────────┤                     │                    │
  │                       │                     │ Save to Database   │
  │                       │                     │ Update Wallet      │
  │                       │                     │ Send Email         │
```

## State Management (Zustand)

```
useAuthStore
├── State
│   ├── user (current logged-in user)
│   ├── accessToken
│   ├── refreshToken
│   └── isLoading
│
└── Actions
    ├── login(user, tokens)
    ├── logout()
    ├── setUser(user)
    └── setLoading(bool)

Usage in Components:
const { user, accessToken, login, logout } = useAuthStore();
```

## Error Handling

```
Frontend
  │
  ├─ Try-catch in async functions
  │
  ├─ Axios interceptors catch HTTP errors
  │
  ├─ Display toast notifications
  │
  └─ Redirect on 401 (unauthorized)

Backend
  │
  ├─ Joi validation on requests
  │
  ├─ Try-catch in controllers
  │
  ├─ Throw custom errors
  │
  ├─ Error middleware catches errors
  │
  └─ Returns structured error response
     {
       success: false,
       statusCode: 400,
       message: "Error description"
     }
```

## Deployment Architecture

```
┌──────────────────────────────────────┐
│            Vercel (CDN)              │
│      Frontend (React App)            │
│      - Static files                  │
│      - Auto deployments              │
│      - Environment variables         │
│      https://notexchange.vercel.app  │
└────────────────┬─────────────────────┘
                 │
                 │ HTTP/REST requests
                 │
┌────────────────▼─────────────────────┐
│     Railway/Render App Hosting       │
│      Backend (Node.js/Express)       │
│      - API server                    │
│      - Environment variables         │
│      - Auto deployments              │
│      https://api.notexchange.app     │
└────────────────┬─────────────────────┘
                 │
                 │ Connection pool
                 │
┌────────────────▼─────────────────────┐
│    Railway/Render Database Service   │
│          PostgreSQL                  │
│      - Automated backups             │
│      - High availability             │
│      - Connection pooling            │
└──────────────────────────────────────┘
```

---

This architecture provides a solid foundation for a scalable, secure, and professional academic marketplace platform.
