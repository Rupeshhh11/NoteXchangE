import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/api';
import toast from 'react-hot-toast';

export const useAuth = () => {
    const { user, accessToken, login, logout, setLoading, isLoading } =
        useAuthStore();

    const handleLogin = useCallback(
        async (email: string, password: string) => {
            try {
                setLoading(true);
                const response = await authService.login(email, password);
                const { user, accessToken, refreshToken } = response.data;
                login(user, accessToken, refreshToken);
                toast.success('Logged in successfully');
                return response.data;
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Login failed');
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [login, setLoading]
    );

    const handleLogout = useCallback(async () => {
        try {
            await authService.logout();
            logout();
            toast.success('Logged out successfully');
        } catch (error: any) {
            toast.error('Logout failed');
        }
    }, [logout]);

    const handleRegister = useCallback(
        async (
            email: string,
            password: string,
            firstName: string,
            lastName: string,
            role: string
        ) => {
            try {
                setLoading(true);
                const response = await authService.register({
                    email,
                    password,
                    firstName,
                    lastName,
                    role,
                });
                const { user, accessToken, refreshToken } = response.data;
                login(user, accessToken, refreshToken);
                toast.success('Registration successful');
                return response.data;
            } catch (error: any) {
                toast.error(error.response?.data?.message || 'Registration failed');
                throw error;
            } finally {
                setLoading(false);
            }
        },
        [login, setLoading]
    );

    return {
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
    };
};
