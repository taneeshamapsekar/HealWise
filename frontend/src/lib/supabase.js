import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

export const isSupabaseConfigured = () => {
  return (
    supabaseUrl.length > 0 &&
    supabaseAnonKey.length > 0 &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your_supabase_anon_key')
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback auth storage for testing when Supabase keys are not yet provided
const LOCAL_STORAGE_KEY = 'healwise_current_user';

export async function signUpUser({ email, password, name, role = 'patient' }) {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role }
      }
    });
    if (error) throw error;
    return data.user;
  }

  // Demo fallback user
  const mockUser = {
    id: `usr_${Date.now()}`,
    email,
    user_metadata: { name, role, gender: 'Not specified', age: 45 }
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
  return mockUser;
}

export async function signInUser({ email, password }) {
  if (isSupabaseConfigured() && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data.user;
  }

  // Demo fallback
  const mockUser = {
    id: `usr_${Date.now()}`,
    email,
    user_metadata: {
      name: email.split('@')[0],
      role: email.includes('doctor') ? 'doctor' : 'patient',
      gender: 'Male',
      age: 52
    }
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
  return mockUser;
}

export async function signOutUser() {
  if (isSupabaseConfigured() && supabase) {
    await supabase.auth.signOut();
  }
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

export async function getActiveSessionUser() {
  if (isSupabaseConfigured() && supabase) {
    const { data } = await supabase.auth.getUser();
    if (data?.user) return data.user;
  }

  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}
