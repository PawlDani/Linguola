import React, { createContext, useState, useEffect } from 'react';
import supabase from '/src/api/supabaseClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user || null);

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const signUp = async (username, email, password) => {
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { username: username },
      },
    });

    if (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw error;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  };

  const value = { user, login, logout, signUp };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
