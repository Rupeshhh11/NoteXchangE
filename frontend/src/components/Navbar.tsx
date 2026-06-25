import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, ChevronDown, Sun, Moon, Home as HomeIcon, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAuthModal } from '../context/AuthModalContext';
import { getUserAvatarUrl } from '../utils/avatarHelper';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuth();
    const { openAuth } = useAuthModal();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark-mode');
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

    const handleLogout = async () => {
        setDropdownOpen(false);
        await logout();
        navigate('/');
    };

    const avatarUrl = getUserAvatarUrl(user);
    const isHome = location.pathname === '/';
    const isDashboard = location.pathname === '/dashboard';
    const isMessages = location.pathname.startsWith('/messages');

    return (
        <>
            <header className="main-header">
                <div className="header-container">
                    {/* Logo Group */}
                    <Link to="/" className="logo-group" style={{ textDecoration: 'none' }}>
                        <span className="logo-text">
                            Note<span className="logo-x">X</span><span className="logotext">changE</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="main-nav" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <a href="/#about" className="nav-link" style={{ fontWeight: 500 }}>
                            About
                        </a>
                        <a href="/#how-it-works" className="nav-link" style={{ fontWeight: 500 }}>
                            How it Works
                        </a>
                        <a href="/#community" className="nav-link" style={{ fontWeight: 500 }}>
                            Community
                        </a>
                    </nav>

                    {/* Right / Auth Buttons */}
                    <div className="auth-buttons" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="theme-toggle-btn"
                            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                        </button>

                        {isAuthenticated ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="nav-user-btn"
                                >
                                    <div className="nav-avatar">
                                        {avatarUrl ? (
                                            <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            user?.firstName?.charAt(0).toUpperCase() || 'U'
                                        )}
                                    </div>
                                    <span className="desktop-only-name">{user?.firstName}</span>
                                    <ChevronDown size={14} className="desktop-only-chevron" />
                                </button>

                                {dropdownOpen && (
                                    <div className="navbar-dropdown">
                                        <Link 
                                            to="/dashboard" 
                                            onClick={() => setDropdownOpen(false)}
                                            className="nav-dropdown-item"
                                        >
                                            <LayoutDashboard size={16} />
                                            <span>Dashboard</span>
                                        </Link>
                                        <div className="dropdown-divider" />
                                        <button
                                            onClick={handleLogout}
                                            className="nav-dropdown-item-logout"
                                        >
                                            <LogOut size={16} />
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="desktop-auth-btns">
                                <button type="button" className="btn btn-secondary" onClick={() => openAuth('login')}>
                                    Log In
                                </button>
                                <button type="button" className="btn btn-primary" onClick={() => openAuth('signup')}>
                                    Sign Up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Bottom Navigation Bar - only on mobile */}
            <nav className="mobile-bottom-nav">
                <Link to="/" className={`mobile-nav-item${isHome ? ' active' : ''}`}>
                    <HomeIcon size={20} />
                    <span>Home</span>
                </Link>
                {isAuthenticated ? (
                    <>
                        <Link to="/messages/admin" className={`mobile-nav-item${isMessages ? ' active' : ''}`}>
                            <MessageSquare size={20} />
                            <span>Chats</span>
                        </Link>
                        <Link to="/dashboard" className={`mobile-nav-item${isDashboard ? ' active' : ''}`}>
                            <div className="mobile-nav-avatar">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                ) : (
                                    user?.firstName?.charAt(0).toUpperCase() || 'U'
                                )}
                            </div>
                            <span>Profile</span>
                        </Link>
                    </>
                ) : (
                    <button onClick={() => openAuth('login')} className="mobile-nav-item" style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <User size={20} />
                        <span>Login</span>
                    </button>
                )}
            </nav>
        </>
    );
}
