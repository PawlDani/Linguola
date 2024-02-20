import React, { createContext, useState, useEffect } from 'react';
import supabase from '/src/api/supabaseClient';

// Tworzenie kontekstu autentykacji
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Stan użytkownika i informacja o ładowaniu
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Inicjalizacja sesji użytkownika przy ładowaniu komponentu
  useEffect(() => {
    const init = async () => {
      try {
        // Pobranie aktualnej sesji użytkownika
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        // Ustawienie użytkownika na podstawie sesji
        setUser(data?.session?.user || null);
      } catch (error) {
        console.error('Error getting user session:', error.message);
      } finally {
        // Zakończenie ładowania niezależnie od wyniku
        setLoading(false);
      }
    };

    init();

    // Nasłuchiwanie na zmiany stanu autentykacji
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Ustawienie użytkownika po zalogowaniu
        setUser(session?.user);
      } else if (event === 'SIGNED_OUT') {
        // Usunięcie użytkownika po wylogowaniu
        setUser(null);
      }
    });

    // Anulowanie nasłuchiwania przy odmontowywaniu komponentu
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Logowanie użytkownika
  const login = async (email, password) => {
    try {
      // Próba logowania z podanymi danymi
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error }; // Zwrócenie danych użytkownika lub błędu
    } catch (error) {
      console.error('Error logging out:', error);
      return { error }; // Zwrócenie błędu w przypadku wyjątku
    }
  };

  // Rejestracja nowego użytkownika
  const signUp = async (email, password, username) => {
    setLoading(true);
    try {
      // Próba rejestracji z podanymi danymi
      const response = await supabase.auth.signUp({ email, password, options: { data: { username } } });
      setLoading(false);
      return response; // Zwrócenie odpowiedzi zawierającej dane użytkownika lub błąd
    } catch (error) {
      setLoading(false);
      return { error }; // Zwrócenie błędu w przypadku wyjątku
    }
  };

  // Wylogowanie użytkownika
  const logout = async () => {
    setLoading(true);
    try {
      // Próba wylogowania
      const { error } = await supabase.auth.signOut();
      if (error) throw new Error(error.message);
      console.log('Logged out');
      setLoading(false);
    } catch (error) {
      console.error('Error while logging out:', error.message);
      setLoading(false);
    }
  };

  // Udostępnienie funkcji i stanu autentykacji dla komponentów podrzędnych
  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, loading }}>{!loading && children}</AuthContext.Provider>
  );
};

export default AuthProvider;
