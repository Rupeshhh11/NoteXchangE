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
        <header className="main-header">
            <div className="header-container">
                {/* Logo Group */}
                <Link to="/" className="logo-group" style={{ textDecoration: 'none' }}>
                    <span className="logo-text">
                        Note<span className="logo-x">X</span><span className="logotext">changE</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="main-nav">
                    <a href="#" className="nav-link">
                        About
                    </a>
                    <a href="#" className="nav-link">
                        How it Works
                    </a>
                    <a href="#" className="nav-link">
                        Community
                    </a>
                    {isAuthenticated && (
                        <Link to="/dashboard" className="nav-link">
                            Dashboard
                        </Link>
                    )}
                </nav>

                {/* Right / Auth Buttons */}
                <div className="auth-buttons">
                    {isAuthenticated ? (
                        <>
                            <div className="flex items-center gap-2" style={{ marginRight: '1rem' }}>
                                <User className="w-5 h-5" />
                                <span className="text-sm font-medium">{user?.firstName}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-secondary"
                                style={{ color: 'red' }}
                            >
                                <LogOut className="w-4 h-4 mr-1" />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="btn btn-secondary"
                            >
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-primary"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                    
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden ml-2 btn btn-secondary"
                        onClick={() => setIsOpen(!isOpen)}
                        style={{ padding: '0 0.5rem', width: '2.5rem' }}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden border-t px-4 py-4 space-y-3" style={{ background: 'var(--clr-card-bg)', backdropFilter: 'blur(5px)' }}>
                    <a
                        href="#"
                        className="block hover:text-primary transition font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        About
                    </a>
                    <a
                        href="#"
                        className="block hover:text-primary transition font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        How it Works
                    </a>
                    <a
                        href="#"
                        className="block hover:text-primary transition font-medium"
                        onClick={() => setIsOpen(false)}
                    >
                        Community
                    </a>
                    {isAuthenticated ? (
                        <>
                            <Link
                                to="/dashboard"
                                className="block hover:text-primary transition font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsOpen(false);
                                }}
                                className="w-full text-left text-red-600 hover:bg-red-50 px-2 py-1 rounded transition font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="block hover:text-primary transition font-medium" onClick={() => setIsOpen(false)}>
                                Log In
                            </Link>
                            <Link to="/register" className="block hover:text-primary transition font-medium" onClick={() => setIsOpen(false)}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            )}
        </header>
    );
}
