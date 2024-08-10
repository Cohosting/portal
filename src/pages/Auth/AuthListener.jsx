import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setError, setIsAuthenticated, setStatus, setStep, setUser } from '../../store/slices/authSlice';
import { supabase } from '../../lib/supabase';

const AuthListener = ({ children }) => {
    const dispatch = useDispatch();
    const [session, setSession] = useState(null);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {

            if (session) {
                setSession(session)

            } else {
                console.log('No session found');
                dispatch(setUser(null));
                dispatch(setIsAuthenticated(false));
                dispatch(setStatus('succeeded'));
            }
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [dispatch]);

    useEffect(() => {

        const fetchUserData = async () => {
            try {
                if (session) {
                    // console.log('session found', session)
                    const { data, error } = await supabase
                        .from('users')
                        .select('*')
                        .eq('id', session.user.id)
                        .single(); // Assuming you want a single user record

                    // console.log('Supabase query result:', { data, error });

                    if (error) {
                        throw new Error(error.message);
                    }

                    if (!data) {
                        throw new Error('No user data found');
                    }

                    const userData = { ...data };
                    if (userData.is_profile_completed === false) {
                        dispatch(setStep(2));
                    }
                    dispatch(setUser(userData));
                    dispatch(setIsAuthenticated(true));
                    dispatch(setStatus('succeeded'));
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                dispatch(setError(err.message));
                dispatch(setStatus('failed'));
            }
        };


        fetchUserData();
    }, [session, dispatch]);
    console.log(session)
    return <>{children}</>;
};

export default AuthListener;
