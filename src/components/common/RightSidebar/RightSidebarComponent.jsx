import React, { useState } from 'react';
import { useAuth } from '/src/hooks/useAuth';
import './RightSidebar.scss';

const RightSidebar = () => {
  // Hooka useAuth do zarządzania autentykacją
  const { user, login, signUp, logout } = useAuth();
  // Stan lokalny dla emaila, hasła, aktywnej formy (logowanie/rejestracja) i wiadomości o błędach
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginActive, setIsLoginActive] = useState(true); // True dla logowania, false dla rejestracji
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState(''); // nowa zmienna stanu dla nazwy użytkownika

  // Walidacja emaila
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  // Walidacja długości hasła
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Walidacja nazyw użytkownika
  const validateUsername = (username) => {
    return username.length <= 12 && username.length > 0;
  };

  // Obsługa akcji formularza autentykacji
  const handleAuthAction = async (e) => {
    e.preventDefault();
    console.log('Handling auth action...');
    setErrorMessage(''); // Czyszczenie poprzednich wiadomości o błędach

    if (!validateEmail(email)) {
      console.log('Wrong email');
      setErrorMessage('Nieprawidłowy email');
      return;
    }

    if (!validatePassword(password)) {
      console.log('Password should have at least 6 characters');
      setErrorMessage('Hasło powinno mieć co najmniej 6 znaków');
      return;
    }
    if (!isLoginActive && !validateUsername(username)) {
      setErrorMessage('Nazwa użytkownika powinna mieć od 1 do 12 znaków');
      return;
    }

    try {
      let response = null;
      if (isLoginActive) {
        console.log('Loggin in...');
        response = await login(email, password);
      } else {
        console.log('Signing up...');
        response = await signUp(email, password, username); // Dodanie username do funkcji signUp
      }

      if (response.error) {
        console.log('Error logging in:');
        setErrorMessage('Błędny adres email lub hasło'); // Wyświetlanie błędu w przypadku niepowodzenia logowania lub rejestracji (zwróconego przez hook useAuth)
      } else {
        console.log('Logged in');
        setEmail('');
        setPassword('');
        // Użytkownik zalogowany, nie trzeba nic robić, ponieważ hook useAuth zaktualizuje stan aplikacji
      }
    } catch (error) {
      console.log('Unexpected error:', error);
      setErrorMessage('Wystąpił nieoczekiwany błąd. Proszę spróbować później.');
    }
  };

  // Przełączanie między logowaniem a rejestracją
  const toggleAuthMode = () => {
    setIsLoginActive(!isLoginActive);
    setErrorMessage(''); // Czyszczenie błędów przy zmianie trybu
  };

  return (
    <div className="right-sidebar">
      {user ? (
        // Sekcja dla zalogowanych użytkowników
        <>
          <div className="logout" onClick={logout}>
            <span>Wyloguj</span>
            <i className="fa-solid fa-right-from-bracket"></i>
          </div>
          <div className="user-profile">
            <div className="user-image">
              <i className="fa-solid fa-user"></i>
            </div>
            <div className="user-name-container">
              <p className="user-name">{user.user_metadata.username}</p>
            </div>
          </div>
        </>
      ) : (
        // Formularz logowania/rejestracji
        <>
          <div className="auth-header">
            <h2>{isLoginActive ? 'Logowanie' : 'Rejestracja'}</h2>
            <div className="auth-login-question">
              {isLoginActive ? (
                <p>
                  Nie masz jeszcze konta?{' '}
                  <span className="register-link" onClick={toggleAuthMode}>
                    Zarejestruj się
                  </span>
                </p>
              ) : (
                <p>
                  Masz już konto?{' '}
                  <span className="register-link" onClick={toggleAuthMode}>
                    Zaloguj się
                  </span>
                </p>
              )}
              <form className="auth-form" onSubmit={handleAuthAction}>
                {!isLoginActive && (
                  <div className="input-group">
                    <i className="fa-solid fa-address-card icon"></i>
                    <input
                      type="text"
                      placeholder="Nazwa użytkownika"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                )}
                <div className="input-group">
                  <i className="fa-solid fa-user icon"></i>
                  <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-group">
                  <i className="fa-solid fa-unlock-keyhole icon"></i>
                  <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="button-group">
                  <button type="submit">{isLoginActive ? 'Zaloguj się' : 'Utwórz konto'}</button>
                </div>
              </form>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default RightSidebar;
