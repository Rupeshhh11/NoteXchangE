import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MathBackground from './components/MathBackground';
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
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (requiredRole && userRole !== requiredRole) return <Navigate to="/" />;
    return <>{children}</>;
};

function App() {
    const { isAuthenticated, user } = useAuth();

    return (
        <Router>
            <div className="flex flex-col min-h-screen relative">
                <MathBackground />
                <Navbar />
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
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </main>
                <Footer />
                <Toaster position="bottom-right" />
            </div>
        </Router>
    );
}

export default App;
