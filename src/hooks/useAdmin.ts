import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { signInWithEmail, signOut } from '../services/auth';

export function useAdmin() {
  const [session, setSession] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string) => {
    await signInWithEmail(email);
  };

  const logout = async () => {
    await signOut();
    setSession(null);
  };

  return {
    isAdmin: Boolean(session),
    loading,
    login,
    logout,
  };
}
