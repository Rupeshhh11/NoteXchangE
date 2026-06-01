import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    register: (data: any) => api.post('/auth/register', data),
    login: (email: string, password: string) => api.post('/auth/login', { email, password }),
    logout: () => api.post('/auth/logout'),
};

export const userService = {
    getProfile: (id: string) => api.get(`/users/${id}`),
    updateProfile: (id: string, data: any) => api.put(`/users/${id}`, data),
};

export const taskService = {
    getAllTasks: (params?: any) => api.get('/tasks', { params }),
    createTask: (data: any) => api.post('/tasks', data),
    getTaskById: (id: string) => api.get(`/tasks/${id}`),
    updateTask: (id: string, data: any) => api.put(`/tasks/${id}`, data),
};

export const bidService = {
    placeBid: (data: any) => api.post('/bids', data),
    getBidsForTask: (taskId: string) => api.get(`/bids/${taskId}`),
};

export const paymentService = {
    createOrder: (data: any) => api.post('/payments/create-order', data),
    verifyPayment: (data: any) => api.post('/payments/verify', data),
};

export const messageService = {
    sendMessage: (data: any) => api.post('/messages', data),
    getMessages: (recipientId: string) => api.get(`/messages/${recipientId}`),
};

export const reviewService = {
    createReview: (data: any) => api.post('/reviews', data),
    getUserReviews: (userId: string) => api.get(`/reviews/user/${userId}`),
};

export default api;
