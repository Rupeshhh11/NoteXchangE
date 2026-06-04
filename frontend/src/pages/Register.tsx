import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthModal } from '../context/AuthModalContext';

/** Redirects to home and opens sign-up modal — single-page auth flow */
export default function Register() {
    const navigate = useNavigate();
    const { openAuth } = useAuthModal();

    useEffect(() => {
        openAuth('signup');
        navigate('/', { replace: true });
    }, [navigate, openAuth]);

    return null;
}
