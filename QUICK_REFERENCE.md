# NoteXchangE - Quick Reference Card

## 🚀 Quick Start (Copy & Paste)

### Terminal 1: Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database password and Razorpay keys
npm run dev
# Wait for: "Server is running on port 5000"
```

### Terminal 2: Frontend
```bash
cd frontend
npm install
npm run dev
# Wait for: "Local: http://localhost:3000"
```

### Open in Browser
```
http://localhost:3000
```

---

## 📁 Key File Locations

### Backend Models
- `backend/src/models/User.ts` - User management
- `backend/src/models/Task.ts` - Task posting
- `backend/src/models/Bid.ts` - Bidding system
- `backend/src/models/Payment.ts` - Payment handling

### Backend Routes
- `backend/src/routes/authRoutes.ts` - Authentication
- `backend/src/routes/taskRoutes.ts` - Task operations
- `backend/src/routes/bidRoutes.ts` - Bidding operations

### Frontend Components
- `frontend/src/components/Navbar.tsx` - Navigation
- `frontend/src/pages/Home.tsx` - Landing page
- `frontend/src/pages/Login.tsx` - Login form
- `frontend/src/pages/Register.tsx` - Registration form
- `frontend/src/pages/Dashboard.tsx` - User dashboard

### Configuration
- `backend/.env.example` - Backend config template
- `frontend/vite.config.ts` - Frontend build config
- `backend/tsconfig.json` - TypeScript config (backend)
- `frontend/tsconfig.json` - TypeScript config (frontend)

---

## 🔐 Environment Variables Needed

### Backend (.env)
```bash
DB_PASSWORD=your_postgres_password
JWT_SECRET=any-random-string-here
RAZORPAY_KEY_ID=from_dashboard_razorpay_com
RAZORPAY_KEY_SECRET=from_dashboard_razorpay_com
SMTP_PASSWORD=google_app_password_not_your_password
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5000/api
```

---

## 🧪 Testing Endpoints with cURL

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "firstName":"John",
    "lastName":"Doe",
    "role":"client"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```

### Get User Profile
```bash
curl -X GET http://localhost:5000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get All Tasks
```bash
curl -X GET http://localhost:5000/api/tasks
```

---

## 📊 Database Connection

### PostgreSQL Connection String
```
postgresql://username:password@localhost:5432/notexchange_dev
```

### Create Database
```bash
psql -U postgres -c "CREATE DATABASE notexchange_dev;"
```

### Connect to Database
```bash
psql -U postgres -d notexchange_dev
```

---

## 🛠️ Common Commands

### Backend Development
```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run migrate          # Run database migrations
npm run lint             # Check code quality
npm run format           # Auto-format code
```

### Frontend Development
```bash
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run preview          # Preview production build
npm run type-check       # Check TypeScript errors
npm run lint             # Check code quality
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Protected | Description |
|--------|----------|-----------|-------------|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login user |
| POST | /api/auth/logout | Yes | Logout user |
| GET | /api/users/:id | No | Get user profile |
| PUT | /api/users/:id | Yes | Update profile |
| GET | /api/tasks | No | List all tasks |
| POST | /api/tasks | Yes | Create task |
| GET | /api/tasks/:id | No | Get task details |
| POST | /api/bids | Yes | Place bid |
| GET | /api/bids/:taskId | No | Get task bids |
| POST | /api/payments/create-order | Yes | Create payment order |
| POST | /api/payments/verify | Yes | Verify payment |
| POST | /api/messages | Yes | Send message |
| GET | /api/messages/:recipientId | Yes | Get messages |
| POST | /api/reviews | Yes | Create review |
| GET | /api/reviews/user/:userId | No | Get user reviews |

---

## 🐛 Debugging

### Backend Not Running?
```bash
# Check if port 5000 is in use
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Change port in .env:
PORT=5001
```

### Frontend Not Starting?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Database Connection Error?
```bash
# Verify PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check credentials in .env match your setup
# Username: postgres (default)
# Password: (what you set during installation)
```

### TypeScript Errors?
```bash
# Check all TypeScript files
npm run type-check

# Fix formatting
npm run format
```

---

## 📚 Important Paths

```
Root: /NoteXchangE/
├── Backend: /backend/src/
│   ├── Controllers: /controllers/ → handles requests
│   ├── Models: /models/ → database schemas
│   ├── Routes: /routes/ → API endpoints
│   └── Services: /services/ → business logic
│
├── Frontend: /frontend/src/
│   ├── Components: /components/ → reusable UI
│   ├── Pages: /pages/ → full page components
│   ├── Services: /services/ → API calls
│   ├── Store: /store/ → state management
│   └── Types: /types/ → TypeScript interfaces
│
└── Docs: /
    ├── README.md → Overview
    ├── DEVELOPMENT_GUIDE.md → Setup guide
    ├── ARCHITECTURE.md → System design
    ├── DATABASE_SCHEMA.md → Database reference
    └── SETUP_COMPLETE.md → What's been done
```

---

## 🚀 Deployment Checklist

### Before Deploying

**Backend:**
```bash
npm run lint          # No errors
npm run build         # Compiles successfully
npm run type-check    # No type errors
```

**Frontend:**
```bash
npm run type-check    # No type errors
npm run build         # Builds successfully
```

### Environment Variables

**Production Backend (.env.production):**
```bash
NODE_ENV=production
DB_NAME=notexchange_prod
DB_HOST=your_railway_host
JWT_SECRET=long_random_string_min_32_chars
RAZORPAY_KEY_ID=your_prod_key
# ... other configs
```

**Production Frontend (.env.production):**
```bash
VITE_API_URL=https://your_api_domain.com/api
```

### Deployment Platforms

- **Frontend**: Vercel (GitHub integration)
- **Backend**: Railway or Render
- **Database**: Railway PostgreSQL

---

## 💡 Pro Tips

1. **Use environment variables** - Never hardcode secrets
2. **Test locally first** - Before pushing to production
3. **Read error messages** - They usually tell you the problem
4. **Use TypeScript** - Catch errors at compile time
5. **Format code** - Run `npm run format` before committing
6. **Check logs** - Both frontend console and backend terminal
7. **Use postman** - Test API endpoints easily
8. **Read documentation** - DEVELOPMENT_GUIDE.md has detailed info

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Format code: `npm run format`
4. Lint code: `npm run lint`
5. Commit: `git commit -m "Describe change"`
6. Push: `git push origin feature/name`
7. Create Pull Request

---

## 📞 Need Help?

1. Check **DEVELOPMENT_GUIDE.md** for setup issues
2. Check **ARCHITECTURE.md** for design questions
3. Check **DATABASE_SCHEMA.md** for database questions
4. Review existing code for patterns
5. Check error messages carefully

---

## ⚡ Performance Tips

### Frontend
- Use React.memo for expensive components
- Lazy load pages with React.lazy()
- Optimize images
- Cache API responses

### Backend
- Add database indexes
- Use connection pooling
- Cache frequently accessed data with Redis
- Implement pagination for large datasets
- Use CDN for static files

---

**Remember: Start simple, test often, deploy when ready!** 🎯
