import React, { createContext, useState, useEffect } from 'react';
import supabase from '/src/api/supabaseClient';

// Kontekst autoryzacji
export const AuthContext = createContext();

// Komponent AuthProvider, który dostarcza kontekst autoryzacji
export const AuthProvider = ({ children }) => {
  // Stan użytkownika i stan ładowania
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Asynchronicznie pobierana sesja i aktualizowany stan użytkownika
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Błąd podczas pobierania sesji:', error);
      } else {
        // Aktualizowany stan użytkownika danymi z sesji
        setUser(data?.session?.user || null);
      }
      setLoading(false);
    };

    init();

    // Nasłuchiwanie na zmiany stanu autoryzacji
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session);
      if (event === 'SIGNED_IN') {
        setUser(session?.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      // W przypadku dodatkowych zdarzen, bede dodawac kolejne warunki
    });

    // Funkcja czyszcząca do wyrejestrowania nasłuchiwania na zmiany stanu autoryzacji, gdy komponent jest odmontowywany
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Funkcja logowania
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Błąd logowania:', error);
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funkcja rejestracji
  const signUp = async (email, password) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Funkcja wylogowania
  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Błąd wylogowania:', error);
      alert(error.error_description || error.message);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  // Zwracanie dostawcy kontekstu autoryzacji z aktualnym stanem użytkownika, funkcjami logowania, rejestracji i wylogowania oraz stanem ładowania
  return (
    <AuthContext.Provider value={{ user, login, signUp, logout, loading }}>{!loading && children}</AuthContext.Provider>
  );
};

export default AuthProvider;
