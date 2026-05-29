export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    role: 'client' | 'service_provider' | 'admin';
    isEmailVerified: boolean;
    isIdentityVerified: boolean;
    profileImage?: string;
    bio?: string;
    rating: number;
    ratingCount: number;
    totalEarnings: number;
    totalSpent: number;
}

export interface Task {
    id: string;
    clientId: string;
    title: string;
    description: string;
    category: string;
    subcategory?: string;
    budget: number;
    budgetType: 'fixed' | 'hourly';
    deadline: string;
    files: string[];
    status: 'open' | 'in_progress' | 'completed' | 'cancelled';
    acceptedBidId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Bid {
    id: string;
    taskId: string;
    serviceProviderId: string;
    amount: number;
    deliveryTime: number;
    description?: string;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
}

export interface Message {
    id: string;
    senderId: string;
    recipientId: string;
    taskId?: string;
    message: string;
    attachments: string[];
    isRead: boolean;
    createdAt: string;
}

export interface Review {
    id: string;
    taskId: string;
    fromUserId: string;
    toUserId: string;
    rating: number;
    comment?: string;
    createdAt: string;
}

export interface Wallet {
    id: string;
    userId: string;
    balance: number;
    totalEarned: number;
    totalWithdrawn: number;
}

export interface Payment {
    id: string;
    taskId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    createdAt: string;
}
