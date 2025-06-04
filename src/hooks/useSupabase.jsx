'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// (Keeps your old getUser function -- it just fetches one row from "users" by ID)
const getUser = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const useSupabase = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // Whenever we call this, we:
    // 1) setLoading(true)
    // 2) await getSession() → if there's a session.user, look up that "users" row
    // 3) finally setLoading(false)
    const fetchSessionUser = async () => {
      console.log('[useSupabase] fetchSessionUser → START');
      if (!isMounted) return;

      setLoading(true);

      try {
        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession();
        if (sessionError) {
          console.error('[useSupabase] getSession error:', sessionError);
        }

        if (session && session.user) {
          try {
            const profile = await getUser(session.user.id);
            if (isMounted) {
              setUser(profile);
              console.log('[useSupabase] got profile for', session.user.id);
            }
          } catch (err) {
            console.error('[useSupabase] getUser error:', err);
            if (isMounted) setUser(null);
          }
        } else {
          // no session (signed out)
          if (isMounted) {
            setUser(null);
            console.log('[useSupabase] no session → set user = null');
          }
        }
      } catch (outer) {
        console.error('[useSupabase] unexpected fetchSessionUser error:', outer);
        if (isMounted) setUser(null);
      }

      if (isMounted) {
        setLoading(false);
        console.log('[useSupabase] fetchSessionUser → DONE, loading=false');
      }
    };

    // 1) Run it once on mount
    fetchSessionUser();

    // 2) Subscribe to any auth changes (e.g. token refresh, sign in, sign out).
    //    Whenever Supabase fires an event, just re‐run fetchSessionUser().
    const { data: listener } = supabase.auth.onAuthStateChange((_event, _session) => {
      fetchSessionUser();
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // ——————————— rest of your API stays exactly the same ———————————

  const updateProfile = async (updates) => {
    if (!user) return;
    const { error } = await supabase
      .from('users')
      .update({ ...updates })
      .eq('id', user.id);
    if (error) throw error;
  };

  const changePassword = async (newPassword) => {
    console.log(`[useSupabase] changePassword → ${newPassword}`);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;

    // After password change, force a reload so Supabase’s session cookie is updated
    window.location.reload();
  };

  const logoutOtherSessions = async () => {
    const { error } = await supabase.auth.refreshSession();
    if (error) throw error;
  };

  const deleteAccount = async () => {
    if (!user) return;
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) throw error;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return {
    user,
    updateProfile,
    changePassword,
    logoutOtherSessions,
    deleteAccount,
    loading,
    logout,
  };
};
