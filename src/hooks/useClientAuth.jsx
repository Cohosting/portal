import { useState, useEffect } from 'react';
import { verifyToken } from '../services/clientAuthService'
import { useToggle } from 'react-use';
import axiosInstance from '../api/axiosConfig';
import { toast } from 'react-toastify';

export const useClientAuth = (portal_id) => {
    const [clientUser, setClientUser] = useState(null);
    const [error, setError] = useState(null);
    const [isOpen, toggleIsOpen] = useToggle(false);
    const [authenticationError, setAuthenticationError] = useState(null)

    useEffect(() => {
        const verifyStoredToken = async () => {
            const storedToken = localStorage.getItem('sessionToken');
            if (!storedToken || !portal_id) return;

            try {
                const data = await verifyToken(storedToken, portal_id);
                if (data.success) {
                    setClientUser(data.user);
                } else {
                    console.log('Invalid token');
                    clearSessionToken();
                }
            } catch (error) {
                setError(error);
            }
        };

        verifyStoredToken();
    }, [portal_id]);
    const authenticate = async (email, password, portalId) => {
        toggleIsOpen(true);
        try {

            const { data } = await axiosInstance.post('/auth/sign-in', {
                email,
                password,
                portalId
            })
            if (data.success) {
                // Handle success (e.g., set session token, redirect)
                setSessionToken(data.token);
                
                window.location.href = '/portal/messages';

            } else {
                setAuthenticationError('Email or password incorrect');
            }
        } catch (error) {
            setAuthenticationError('Email or password incorrect');
            toast.error('Email or password incorrect');
            console.error('Authentication error:', error);
        }
        toggleIsOpen(false);
    };

    const setSessionToken = (token) => {
        localStorage.setItem('sessionToken', token);
    };

    const clearSessionToken = () => {
        localStorage.removeItem('sessionToken');
        setClientUser(null);
    };

    return { clientUser, setSessionToken, clearSessionToken, error, authenticate, authenticationError, isOpen, isLoading: isOpen };
};