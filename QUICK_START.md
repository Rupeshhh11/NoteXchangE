# 🚀 NoteXchangE - Quick Start Guide

## **Fastest Way to Run Locally (5 minutes)**

### **Option 1: Using the Setup Script (Recommended)**

**Windows (PowerShell):**
```powershell
cd c:\Users\Deepak\OneDrive\Documents\NoteXchangE
.\setup-local.ps1
```

**Windows (CMD):**
```cmd
cd c:\Users\Deepak\OneDrive\Documents\NoteXchangE
setup-local.bat
```

---

## **Option 2: Manual Setup**

### **Step 1: Install Backend Dependencies**
```bash
cd backend
npm install --legacy-peer-deps
```

### **Step 2: Start Backend (Keep this Terminal Open)**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✓ Server running on http://localhost:5000
✓ Socket.io ready
```

### **Step 3: Install Frontend Dependencies (New Terminal)**
```bash
cd frontend
npm install --legacy-peer-deps
```

### **Step 4: Start Frontend (New Terminal)**
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## **🌐 Access Your App**

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

---

## **📝 Environment Variables**

**Backend (.env created automatically):**
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=notexchange_dev
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```

**Frontend (.env created automatically):**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## **🛠️ Common Issues**

### **Issue: "npm command not found"**
- Make sure Node.js is installed: `node --version`
- Download from: https://nodejs.org/

### **Issue: Port 5000 already in use (Backend)**
- Either close the app using port 5000, or edit `backend/src/index.ts` and change `PORT=5001`

### **Issue: Port 5173 already in use (Frontend)**
- Vite will automatically use the next available port (5174, 5175, etc.)

### **Issue: Database connection errors**
- Make sure you have PostgreSQL installed locally, or comment out database code temporarily
- Or skip it - API will still respond with mock data

---

## **🎯 Next Steps**

1. ✅ Run both backend and frontend
2. Go to http://localhost:5173
3. Click **"Register"** to create an account
4. Explore the dashboard
5. Browse tasks, place bids, send messages

---

## **📦 To Deploy to Production**

See **DEPLOY.md** for:
- Docker Compose deployment
- Render.com backend deployment
- Vercel frontend deployment
- GitHub Actions CI/CD

---

## **📞 Need Help?**

- Check logs in your terminal
- Verify ports 5000 and 5173 are available
- Make sure Node.js v18+ is installed

**Enjoy! 🎉**
