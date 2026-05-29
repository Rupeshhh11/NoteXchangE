# NoteXchangE Development Guide

## Quick Start

### Step 1: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
# Update these lines in .env:
# DB_PASSWORD=your_postgres_password
# RAZORPAY_KEY_ID=your_key (get from Razorpay)
# RAZORPAY_KEY_SECRET=your_secret
# SMTP_PASSWORD=your_gmail_app_password (generate from Google Account)

# Run database migrations (creates tables)
npm run migrate

# Start development server
npm run dev
```

**Expected Output:**
```
🚀 Server is running on port 5000
📊 Environment: development
```

### Step 2: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5000/api" > .env

# Start development server
npm run dev
```

**Expected Output:**
```
VITE v5.0.8 ready in 123 ms

➜  Local:   http://localhost:3000/
```

## Database Setup

### Prerequisites
- PostgreSQL installed and running

### Creating the Database

```bash
# Using psql (PostgreSQL command line)
psql -U postgres

# In psql prompt, run:
CREATE DATABASE notexchange_dev;
\q
```

Or if you have PostgreSQL GUI tools, create a new database named `notexchange_dev`.

## Environment Variables

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=notexchange_dev
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_secret
REFRESH_TOKEN_EXPIRY=30d

# Razorpay (Get from https://dashboard.razorpay.com/)
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxx

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password (generate at https://myaccount.google.com/apppasswords)

# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## Key API Endpoints

### Authentication
```
POST http://localhost:5000/api/auth/register
POST http://localhost:5000/api/auth/login
POST http://localhost:5000/api/auth/logout
```

### Example: Register a New User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "role": "client"
  }'
```

### Example: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

## Available NPM Scripts

### Backend
```bash
npm run dev       # Development server with hot reload
npm run build     # Compile TypeScript to JavaScript
npm start         # Run production build
npm run migrate   # Run database migrations
npm run seed      # Populate database with sample data
npm run lint      # Check code for errors
npm run format    # Format code with Prettier
```

### Frontend
```bash
npm run dev       # Development server with hot reload
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Check code for errors
npm run format    # Format code with Prettier
npm run type-check # Check TypeScript types
```

## Database Models

### User
- id (UUID, primary key)
- email (unique)
- password (hashed)
- firstName, lastName
- role (client | service_provider | admin)
- profileImage, bio
- rating, ratingCount
- totalEarnings, totalSpent
- isEmailVerified, isPhoneVerified, isIdentityVerified
- isActive, lastLogin
- timestamps

### Task
- id (UUID)
- clientId (references User)
- title, description
- category, subcategory
- budget, budgetType (fixed | hourly)
- deadline
- files, status
- acceptedBidId
- timestamps

### Bid
- id (UUID)
- taskId (references Task)
- serviceProviderId (references User)
- amount, deliveryTime
- description, status (pending | accepted | rejected)
- timestamps

### Payment
- id (UUID)
- taskId, clientId, serviceProviderId
- amount, status
- razorpay order/payment IDs
- timestamps

### Wallet
- id (UUID)
- userId (references User, unique)
- balance, totalEarned, totalWithdrawn
- timestamps

### Message
- id (UUID)
- senderId, recipientId
- taskId (optional)
- message, attachments, isRead
- timestamps

### Review
- id (UUID)
- taskId, fromUserId, toUserId
- rating (1-5), comment
- timestamps

## Testing the Application

### Test Flow: Client Posting a Task

1. **Register as Client**
   - Go to http://localhost:3000/register
   - Select "Post tasks" role
   - Fill in details and submit

2. **Login**
   - Go to http://localhost:3000/login
   - Use registered email and password

3. **View Dashboard**
   - You should see your dashboard at http://localhost:3000/dashboard

### Test Flow: Service Provider Browsing Tasks

1. **Register as Service Provider**
   - Go to http://localhost:3000/register
   - Select "Offer services" role

2. **Browse Available Tasks**
   - Navigate to /browse (route to be implemented)

3. **Place a Bid**
   - Select a task and place a bid

## Troubleshooting

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Ensure PostgreSQL is running
```bash
# Windows
pg_isready

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Change the PORT in .env or kill the process using the port

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
npm run type-check
```

## Development Workflow

### Making Changes

1. **Backend Changes**
   - Edit files in `backend/src/`
   - Server auto-reloads with nodemon
   - Check terminal for errors

2. **Frontend Changes**
   - Edit files in `frontend/src/`
   - Browser auto-refreshes with HMR
   - Check console for errors

3. **Database Changes**
   - Create new model in `backend/src/models/`
   - Create migration in `backend/src/database/migrations/`
   - Run `npm run migrate`

### Code Style

```bash
# Format all files
npm run format

# Check for linting errors
npm run lint
```

## Docker Setup (Optional)

To run PostgreSQL in Docker:

```bash
docker run --name notexchange-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=notexchange_dev \
  -p 5432:5432 \
  -d postgres:15
```

## Production Deployment

### Backend (Railway/Render)

1. Push code to GitHub
2. Connect repository to Railway/Render
3. Set environment variables
4. Deploy

### Frontend (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Vercel auto-detects Vite configuration
4. Deploy

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Sequelize ORM](https://sequelize.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Razorpay API](https://razorpay.com/docs/api/)

## Support

For issues or questions, please refer to the main README.md or create an issue on GitHub.
