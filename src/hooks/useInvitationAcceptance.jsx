import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosConfig";
import { supabase } from "../lib/supabase";

export const useInvitationAcceptance = (token) => {
    const [invitationData, setInvitationData] = useState(null);
    const [showAuthForm, setShowAuthForm] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isValidatingToken, setIsValidatingToken] = useState(true);
    const [isCheckingUserExistence, setIsCheckingUserExistence] = useState(false);
    const [isExistingUser, setIsExistingUser] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [session, setSession] = useState(null);
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });

        return () => authListener.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        validateInvitation();
    }, [token]);

    const clearError = () => {
        setError(null);
    };

    const validateInvitation = async () => {
        try {
            setIsValidatingToken(true);
            const response = await axiosInstance.get(`/team/invitations/invite/verify/${token}`);
            setInvitationData(response.data);
            // await checkUserExistence(response.data.email);
        } catch (error) {
            setError('Invalid or expired invitation.');
        } finally {
            setIsValidatingToken(false);
        }
    };

    const checkUserExistence = async (email) => {
        setIsCheckingUserExistence(true);
        try {
            // Generate a unique, complex fake password
            const fakePassword = generateFakePassword();

            // Attempt to sign in with the email and the fake password
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: fakePassword
            });
            console.log({
                error: error.message,
                err: error.code,
                a: error.name
            })

            // If the error message indicates wrong password, the user exists
            setIsExistingUser(error && error.message.toLowerCase().includes('invalid login credentials'));
        } catch (error) {
            console.error("Error checking user existence:", error);
            setIsExistingUser(false);
        } finally {
            setIsCheckingUserExistence(false);
        }
    };

    const generateFakePassword = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
        const length = 32; // Long enough to be extremely unlikely to match
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result + Date.now(); // Add timestamp to ensure uniqueness
    };

    const initiateInvitationAcceptance = async () => {
        if (session) {
            await processInvitationAcceptance(session.user.id);
        } else {
            setShowAuthForm(true);
        }
    };

    const processInvitationAcceptance = async (userId) => {
        console.log({
            invitationData
        })
        setIsProcessing(true);
        try {
            await axiosInstance.post(`/team/invitations/invite/accept`, {
                token,
                userId,
                name: invitationData?.team_member?.name || 'New User'
            });
            setIsAccepted(true);
        } catch (error) {
            setError('Failed to accept invitation. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsProcessing(true);
        try {
            const authFunction = isLogin ? authenticateExistingUser : createAndAuthenticateNewUser;
            await authFunction();
        } catch (error) {
            setError('Authentication failed: ' + error.message);
        } finally {
            setIsProcessing(false);
        }
    };
    const authenticateExistingUser = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: invitationData.email,
            password: password,
        });
        if (error) throw error;
        await processInvitationAcceptance(data.user.id);
    };

    const createAndAuthenticateNewUser = async () => {
        const { data, error } = await supabase.auth.signUp({
            email: invitationData.email,
            password: password,
        });
        if (error) throw error;

        try {
            await processInvitationAcceptance(data.user.id);
        } catch (error) {
            throw error;
        }
    };

    return {
        invitationData,
        showAuthForm,
        isExistingUser,
        password,
        error,
        isValidatingToken,
        isCheckingUserExistence,
        isProcessing,
        isAccepted,
        initiateInvitationAcceptance,
        handleAuthSubmit,
        setPassword,
        setShowAuthForm,
        session,
        clearError,
        isLogin,
        toggleAuthMode
    };
};