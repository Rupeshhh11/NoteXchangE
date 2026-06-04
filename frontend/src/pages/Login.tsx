import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';

/** Redirects to home and opens login modal — single-page auth flow */
export default function Login() {
    const navigate = useNavigate();
    const { openAuth } = useAuthModal();

    useEffect(() => {
        openAuth('login');
        navigate('/', { replace: true });
    }, [navigate, openAuth]);

    return null;
}
