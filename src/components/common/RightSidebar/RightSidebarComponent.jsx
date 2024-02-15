import React, { useState } from 'react';
import { useAuth } from '/src/hooks/useAuth';
import './RightSidebar.scss';

// Komponent RightSidebar
const RightSidebar = () => {
  // niestandardowy hook useAuth do zarządzania autoryzacją użytkownika
  const { user, login, signUp, logout } = useAuth();

  // lokalne stany dla email, hasła i stanu logowania
  const [email, setEmail] = useState(''); // lokalny stan dla email
  const [password, setPassword] = useState(''); // lokalny stan dla hasła
  const [isLoggingIn, setIsLoggingIn] = useState(true); // lokalny stan dla określenia, czy użytkownik loguje się czy rejestruje

  // Funkcja obsługująca logowanie/rejestrację
  const handleAuthAction = async (e) => {
    e.preventDefault();
    // Jeśli użytkownik loguje się, wywołaj funkcję login, w przeciwnym razie wywołaj signUp
    if (isLoggingIn) {
      await login(email, password);
    } else {
      await signUp(email, password);
    }
  };

  // Różne UI w zależności od tego, czy użytkownik jest zalogowany
  return (
    <div className="right-sidebar">
      {user ? (
        // Jeśli użytkownik jest zalogowany, wyświetl powitanie i przycisk wylogowania
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        // Jeśli użytkownik nie jest zalogowany, wyświetl formularz logowania/rejestracji
        <form onSubmit={handleAuthAction}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{isLoggingIn ? 'Login' : 'Sign Up'}</button>
          <button type="button" onClick={() => setIsLoggingIn(!isLoggingIn)}>
            {isLoggingIn ? 'Need an account? Sign Up' : 'Have an account? Login'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RightSidebar;
