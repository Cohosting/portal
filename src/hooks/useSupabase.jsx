'use client'
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';


const getUser = async (id) => {
    const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
}

export const useSupabase = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = supabase.auth.getSession();
        setUser(session?.user ?? null);

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            const user = session?.user;
            if (user) {
                setLoading(true);
                console.log(`Getting user ${user.id}`)
                const currentUser = await getUser(user.id)
                setUser(currentUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const updateProfile = async (updates) => {
        if (!user) return;
        const { error } = await supabase.from('users').update({
            ...updates,
        }).eq('id', user.id);

        if (error) throw error;
    };

    const changePassword = useCallback(async (newPassword) => {
        console.log(`newPassword from hook: ${newPassword}`)
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        }).then(() => {
            window.location.reload();
        });

        if (error) throw error;
        console.log('password changed')
    }, []);

    const logoutOtherSessions = async () => {
        const { error } = await supabase.auth.refreshSession();
        if (error) throw error;
    };

    const deleteAccount = async () => {
        const { error } = await supabase.auth.admin.deleteUser(user.id);
        if (error) throw error;
    };

    const logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    return { user, updateProfile, changePassword, logoutOtherSessions, deleteAccount, loading: !user && loading, logout };
};