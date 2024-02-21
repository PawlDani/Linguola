import React, { createContext, useState, useContext, useEffect } from 'react';
import supabase from '/src/api/supabaseClient';

const AuthContext = createContext();

// Mapowanie błędów na polskie wiadomości
const getPolishErrorMessage = (error) => {
  const messageMap = {
    'Invalid login credentials': 'Błędny adres e-mail lub hasło',
    'User already registered': 'Użytkownik już istnieje',
  };

  // Jezeli nie ma przypisanego błędu, zwróć domyślną wiadomość
  return messageMap[error.message] || 'Wystąpił nieoczekiwany błąd';
};

// Provider autentykacji
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Pobranie sesji użytkownika
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

  // Rejestracja użytkownika
  const signUp = async (username, email, password) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { username: username },
        },
      });

      if (error) throw error;
    } catch (error) {
      throw new Error(getPolishErrorMessage(error));
    }
  };

  // Logowanie użytkownika
  const login = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;
    } catch (error) {
      throw new Error(getPolishErrorMessage(error));
    }
  };

  // Wylogowanie użytkownika
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    } catch (error) {
      throw new Error(getPolishErrorMessage(error));
    }
  };

  const value = { user, login, logout, signUp };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
