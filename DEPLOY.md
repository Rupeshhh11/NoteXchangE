# NoteXchangE - Deployment Guide

## 🚀 Local Development with Docker

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ (for local testing)

### Run Locally
```bash
cd NoteXchangE
docker-compose up --build
```

**Endpoints:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Postgres: localhost:5432
- Redis: localhost:6379

---

## 📦 Deploy to Render.com (Free Tier)

### Backend Deployment

1. **Create Render Account** at https://render.com
2. **Create New Web Service**
   - Connect GitHub repo (Rupeshhh11/NoteXchangE)
   - Build Command: `cd backend && npm run build`
   - Start Command: `node dist/index.js`
   - Runtime: Node
   - Region: Choose closest

3. **Add PostgreSQL Database**
   - New → PostgreSQL
   - Name: `notexchange-db`
   - Region: Same as backend
   - Copy connection string

4. **Add Environment Variables** (in Render dashboard)
   ```
   DB_HOST=<postgres-host>
   DB_PORT=5432
   DB_NAME=notexchange_prod
   DB_USER=<postgres-user>
   DB_PASSWORD=<postgres-password>
   JWT_SECRET=<generate-random-secret>
   RAZORPAY_KEY_ID=<your-key>
   RAZORPAY_KEY_SECRET=<your-secret>
   FRONTEND_URL=https://notexchange.vercel.app
   NODE_ENV=production
   ```

5. **Deploy**: Push to GitHub, Render auto-deploys

---

## 🎨 Frontend Deployment

### Option A: Vercel (Recommended for React/Vite)

1. Go to https://vercel.com
2. Connect GitHub account
3. Select `NoteXchangE` repo
4. Root Directory: `frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add Environment Variable:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   ```
8. Deploy!

### Option B: Render Web Service

Same as backend, but:
- Build Command: `cd frontend && npm run build && npm run preview`
- Root Directory: `frontend`
- Environment Variable:
  ```
  VITE_API_URL=https://your-backend-url.onrender.com/api
  ```

---

## 🔧 Environment Variables Checklist

**Backend (.env or Render dashboard):**
- ✅ DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
- ✅ JWT_SECRET (generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- ✅ RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
- ✅ FRONTEND_URL
- ✅ NODE_ENV=production

**Frontend (.env or Vercel dashboard):**
- ✅ VITE_API_URL (your backend URL)
- ✅ VITE_SOCKET_URL (your backend URL)

---

## 📝 Post-Deployment

1. **Run Migrations** (Backend → Render dashboard → Shell)
   ```bash
   npx ts-node src/database/migrations.ts
   npx ts-node src/database/seed.ts
   ```

2. **Test API Health**
   ```bash
   curl https://your-backend.onrender.com/api/health
   ```

3. **Test Frontend**
   Open https://your-frontend.vercel.app

---

## 🔑 Razorpay Integration

1. Sign up at https://razorpay.com (India-focused, works worldwide)
2. Get API Keys from dashboard
3. Add to backend env variables
4. Payment endpoints at `/api/payments/create-order` and `/verify`

---

## 📞 Support

For issues:
- Check Render/Vercel deployment logs
- Verify environment variables are set
- Ensure database migrations ran
- Check backend health: `/api/health`

---

## 🎯 Quick Commands

**Local Dev:**
```bash
docker-compose up --build
```

**Local Build Test:**
```bash
cd backend && npm run build
cd ../frontend && npm run build
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🌐 Custom Domain (Optional)

1. Buy domain (Namecheap, GoDaddy, etc.)
2. Point to Vercel/Render nameservers
3. In Vercel/Render settings → add custom domain
4. SSL certificate auto-generated

---

**Status:** ✅ Ready for production deployment
