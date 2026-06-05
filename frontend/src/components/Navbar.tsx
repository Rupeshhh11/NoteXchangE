import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAuthModal } from '../context/AuthModalContext';

export default function Navbar() {
    const navigate = useNavigate();
    const { isAuthenticated, user, logout } = useAuth();
    const { openAuth } = useAuthModal();


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
                            <button type="button" className="btn btn-secondary" onClick={() => openAuth('login')}>
                                Log In
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => openAuth('signup')}>
                                Sign Up
                            </button>
                        </>
                    )}

                    {/* Mobile menu removed per request */}
                </div>
            </div>
            {/* Mobile menu removed */}
        </header>
    );
}
