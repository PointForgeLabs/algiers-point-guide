import { supabase } from './supabase';

export async function signInWithEmail(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + '/admin',
    },
  });
  if (error) throw error;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function onAuthStateChange(callback: (session: unknown) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => callback(session));
}
