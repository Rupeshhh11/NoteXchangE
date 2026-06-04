import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { AuthModalProvider, useAuthModal } from './context/AuthModalContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MathBackground from './components/MathBackground';
import Preloader from './components/Preloader';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';
import Browse from './pages/Browse';
import PlaceBid from './pages/PlaceBid';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';

interface ProtectedRouteProps {
    children: React.ReactNode;
    isAuthenticated: boolean;
    requiredRole?: string;
    userRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    isAuthenticated,
    requiredRole,
    userRole,
}) => {
    if (!isAuthenticated) return <Navigate to="/?auth=login" replace />;
    if (requiredRole && userRole !== requiredRole) return <Navigate to="/" replace />;
    return <>{children}</>;
};

function AuthRouteHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const { openAuth } = useAuthModal();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const auth = params.get('auth');
        if (auth === 'login' || auth === 'signup') {
            openAuth(auth);
            navigate('/', { replace: true });
        }
    }, [location.search, openAuth, navigate]);

    return null;
}

function AppShell() {
    const { isAuthenticated, user } = useAuth();
    const [showPreloader, setShowPreloader] = useState(true);

    return (
        <>
            {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
            <MathBackground />
            <Navbar />
            <AuthRouteHandler />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/browse" element={<Browse />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/tasks/:id"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <TaskDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/bid/:taskId"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <PlaceBid />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/messages/:userId"
                        element={
                            <ProtectedRoute isAuthenticated={isAuthenticated}>
                                <Messages />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute
                                isAuthenticated={isAuthenticated}
                                requiredRole="admin"
                                userRole={user?.role}
                            >
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            <Footer />
            <AuthModal />
            <Toaster position="bottom-right" />
        </>
    );
}

function App() {
    return (
        <Router>
            <AuthModalProvider>
                <div className="flex flex-col min-h-screen relative app-root">
                    <AppShell />
                </div>
            </AuthModalProvider>
        </Router>
    );
}

export default App;
