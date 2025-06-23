import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentSelectedPortal, setError, setIsAuthenticated, setStatus, setUser } from '../../store/slices/authSlice';
import { supabase } from '../../lib/supabase';
import { useSelector } from 'react-redux';



export const AuthListenerContext = React.createContext();

const AuthListener = ({ children }) => {
    const dispatch = useDispatch();
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { currentSelectedPortal } = useSelector(state => state.auth);

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            // await supabase.auth.signOut()

            if (session) {
                console.log('Session found:', session);
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
                    setIsLoading(true)
                    // console.log('session found', session)
                    const { data, error } = await supabase
                        .rpc('get_user_with_nested_portals', { input_user_id: session.user.id })

                    if (error) console.error('Error:', error)
                    else console.log('User data with portals:', data)

                    console.log('Supabase query result:', { data, error });

                    if (error) {
                        throw new Error(error.message);
                    }

                    if (!data) {
                        console.log(` no user data`)
                        if (window.location.pathname !== '/quick-setup' && !window.location.pathname.includes('invitation')) {
                            window.location.href = '/quick-setup'
                        }
                        setIsLoading(false)

                        // throw new Error('No user data found');
                    }

                    let userData = null;

                    if (data) {
                        userData = {
                            ...data?.user,
                            portals: data?.portals,
                            default_portal: data?.user?.default_portal,
                        };
                    }



                    if (userData?.is_profile_completed === false) {

                        if (window.location.pathname !== '/quick-setup') {
                            window.location.href = '/quick-setup'
                        }
                    }
                    console.log({
                        userData
                    })
                    dispatch(setUser(userData));
                    dispatch(setCurrentSelectedPortal(!currentSelectedPortal ? userData?.default_portal : currentSelectedPortal));
                    dispatch(setIsAuthenticated(true));
                    dispatch(setStatus('succeeded'));
                    setIsLoading(false)
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
                dispatch(setError(err.message));
                dispatch(setStatus('failed'));
            }
        };


        fetchUserData();
    }, [session, dispatch]);

    const refetchUserData = async () => {
        const { data, error } = await supabase
            .rpc('get_user_with_nested_portals', { input_user_id: session.user.id })

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }



    return <AuthListenerContext.Provider value={{ isLoading, refetchUserData }}>{children}</AuthListenerContext.Provider>;
};

export default AuthListener;
