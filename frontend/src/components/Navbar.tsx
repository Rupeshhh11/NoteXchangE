import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold font-display"
                >
                    <span className="text-primary">Note</span>
                    <span className="text-primary">X</span>
                    <span className="text-gray-800">changE</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/" className="hover:text-primary transition">
                        Home
                    </Link>
                    <Link to="/browse" className="hover:text-primary transition">
                        Browse Tasks
                    </Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/dashboard" className="hover:text-primary transition">
                                Dashboard
                            </Link>
                            <Link to="/messages" className="hover:text-primary transition">
                                Messages
                            </Link>
                        </>
                    )}
                </div>

                {/* Right Section */}
                <div className="hidden md:flex gap-3 items-center">
                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5" />
                                <span className="text-sm">{user?.firstName}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t px-4 py-4 space-y-3">
                    <Link
                        to="/"
                        className="block hover:text-primary transition"
                        onClick={() => setIsOpen(false)}
                    >
                        Home
                    </Link>
                    <Link
                        to="/browse"
                        className="block hover:text-primary transition"
                        onClick={() => setIsOpen(false)}
                    >
                        Browse Tasks
                    </Link>
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="block hover:text-primary transition"
                                onClick={() => setIsOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left text-red-600 hover:bg-red-50 px-2 py-1 rounded transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block" onClick={() => setIsOpen(false)}>
                                Login
                            </Link>
                            <Link to="/register" className="block" onClick={() => setIsOpen(false)}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
