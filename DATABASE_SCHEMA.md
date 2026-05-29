# Database Schema Reference

## Complete Database Structure

### 1. Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  phoneNumber VARCHAR(20),
  role ENUM('client', 'service_provider', 'admin') DEFAULT 'client',
  
  -- Verification Status
  isEmailVerified BOOLEAN DEFAULT FALSE,
  isPhoneVerified BOOLEAN DEFAULT FALSE,
  isIdentityVerified BOOLEAN DEFAULT FALSE,
  
  -- Profile Information
  profileImage VARCHAR(255),
  bio TEXT,
  
  -- Ratings
  rating DECIMAL(3,2) DEFAULT 0,
  ratingCount INTEGER DEFAULT 0,
  
  -- Statistics
  totalEarnings DECIMAL(12,2) DEFAULT 0,
  totalSpent DECIMAL(12,2) DEFAULT 0,
  
  -- Status
  isActive BOOLEAN DEFAULT TRUE,
  lastLogin TIMESTAMP,
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### 2. Tasks Table

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clientId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Task Details
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  
  -- Budget
  budget DECIMAL(12,2) NOT NULL,
  budgetType ENUM('fixed', 'hourly') DEFAULT 'fixed',
  
  -- Timeline
  deadline TIMESTAMP NOT NULL,
  
  -- Files
  files JSON DEFAULT '[]',
  
  -- Status
  status ENUM('open', 'in_progress', 'completed', 'cancelled') DEFAULT 'open',
  acceptedBidId UUID,
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_tasks_clientId ON tasks(clientId);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_category ON tasks(category);
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
```

### 3. Bids Table

```sql
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taskId UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  serviceProviderId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Bid Details
  amount DECIMAL(12,2) NOT NULL,
  deliveryTime INTEGER NOT NULL, -- in days
  description TEXT,
  
  -- Status
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_bids_taskId ON bids(taskId);
CREATE INDEX idx_bids_serviceProviderId ON bids(serviceProviderId);
CREATE INDEX idx_bids_status ON bids(status);
```

### 4. Payments Table

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taskId UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  clientId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  serviceProviderId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Payment Details
  amount DECIMAL(12,2) NOT NULL,
  
  -- Razorpay Integration
  razorpayOrderId VARCHAR(255) NOT NULL,
  razorpayPaymentId VARCHAR(255),
  razorpaySignature VARCHAR(255),
  
  -- Status
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  paymentMethod VARCHAR(50) DEFAULT 'razorpay',
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_payments_taskId ON payments(taskId);
CREATE INDEX idx_payments_clientId ON payments(clientId);
CREATE INDEX idx_payments_serviceProviderId ON payments(serviceProviderId);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_razorpayOrderId ON payments(razorpayOrderId);
```

### 5. Wallets Table

```sql
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- Balances
  balance DECIMAL(12,2) DEFAULT 0,
  totalEarned DECIMAL(12,2) DEFAULT 0,
  totalWithdrawn DECIMAL(12,2) DEFAULT 0,
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_wallets_userId ON wallets(userId);
```

### 6. Reviews Table

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  taskId UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  fromUserId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  toUserId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  -- Review Details
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_reviews_taskId ON reviews(taskId);
CREATE INDEX idx_reviews_fromUserId ON reviews(fromUserId);
CREATE INDEX idx_reviews_toUserId ON reviews(toUserId);
```

### 7. Messages Table

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  senderId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipientId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  taskId UUID REFERENCES tasks(id) ON DELETE SET NULL,
  
  -- Message Content
  message TEXT NOT NULL,
  attachments JSON DEFAULT '[]',
  
  -- Status
  isRead BOOLEAN DEFAULT FALSE,
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_messages_senderId ON messages(senderId);
CREATE INDEX idx_messages_recipientId ON messages(recipientId);
CREATE INDEX idx_messages_taskId ON messages(taskId);
CREATE INDEX idx_messages_conversation ON messages(senderId, recipientId);
CREATE INDEX idx_messages_isRead ON messages(isRead);
```

## Relationships

```
User (1) ─── (N) Task (as clientId)
        ─── (N) Bid (as serviceProviderId)
        ─── (N) Message (as senderId)
        ─── (N) Message (as recipientId)
        ─── (N) Review (as fromUserId)
        ─── (N) Review (as toUserId)
        ─── (1) Wallet (userId unique)
        ─── (N) Payment (as clientId)
        ─── (N) Payment (as serviceProviderId)

Task (1) ─── (N) Bid
     ─── (N) Payment
     ─── (N) Review
     ─── (N) Message (optional)

Bid (N) ─── (1) Task
    ─── (1) User (serviceProviderId)
```

## Query Examples

### Get Tasks Posted by User
```sql
SELECT * FROM tasks WHERE clientId = ? ORDER BY createdAt DESC;
```

### Get All Bids for Task
```sql
SELECT b.*, u.firstName, u.lastName, u.rating 
FROM bids b
JOIN users u ON b.serviceProviderId = u.id
WHERE b.taskId = ?
ORDER BY b.createdAt DESC;
```

### Get User's Wallet and Earnings
```sql
SELECT w.*, COUNT(p.id) as completedTasks, SUM(p.amount) as totalEarnings
FROM wallets w
LEFT JOIN payments p ON w.userId = p.serviceProviderId AND p.status = 'completed'
WHERE w.userId = ?
GROUP BY w.id;
```

### Get User's Reviews
```sql
SELECT r.*, u.firstName, u.lastName
FROM reviews r
JOIN users u ON r.fromUserId = u.id
WHERE r.toUserId = ?
ORDER BY r.createdAt DESC;
```

### Get Recent Messages in Conversation
```sql
SELECT * FROM messages
WHERE (senderId = ? AND recipientId = ?) 
   OR (senderId = ? AND recipientId = ?)
ORDER BY createdAt ASC
LIMIT 50;
```

### Get User Statistics
```sql
SELECT 
  u.id,
  u.firstName,
  u.lastName,
  u.rating,
  u.ratingCount,
  w.balance,
  w.totalEarned,
  COUNT(DISTINCT t.id) as tasksPosted,
  COUNT(DISTINCT b.id) as bidsPlaced,
  SUM(CASE WHEN p.status = 'completed' THEN 1 ELSE 0 END) as completedTasks
FROM users u
LEFT JOIN wallets w ON u.id = w.userId
LEFT JOIN tasks t ON u.id = t.clientId
LEFT JOIN bids b ON u.id = b.serviceProviderId
LEFT JOIN payments p ON (u.id = p.serviceProviderId OR u.id = p.clientId)
WHERE u.id = ?
GROUP BY u.id, w.id;
```

## Data Types Reference

- **UUID**: Primary keys for distributed systems
- **ENUM**: Fixed set of values (roles, status)
- **DECIMAL(12,2)**: Monetary amounts (12 digits, 2 decimals)
- **JSON**: Arrays (files, attachments)
- **TEXT**: Large text content (descriptions, comments)
- **VARCHAR(n)**: Fixed-length strings
- **TIMESTAMP**: Date and time with timezone
- **BOOLEAN**: True/False

## Constraints & Rules

- Users must have unique email
- Wallets have 1:1 relationship with users
- Tasks are deleted when client is deleted (CASCADE)
- Bids are deleted when task is deleted (CASCADE)
- Messages are deleted when either user is deleted (CASCADE)
- Reviews can exist without task (SET NULL)
- Payment status is immutable (create new for changes)
- Ratings must be between 1-5

## Indexing Strategy

Indexes created on:
- Foreign keys (for joins)
- Status columns (for filtering)
- Date columns (for sorting)
- Commonly searched fields (email, category)
- Conversation lookups (composite index)

This ensures optimal query performance for the marketplace operations.
