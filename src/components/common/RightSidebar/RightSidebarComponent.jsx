import React, { useState } from 'react';
import { useAuth } from '/src/hooks/AuthProvider';
import { useNavigate } from 'react-router-dom';
import './RightSidebar.scss';

const RightSidebar = () => {
  const { user, login, signUp, logout } = useAuth(); // Hook autentykacji
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginActive, setIsLoginActive] = useState(true); // True dla logowania, false dla rejestracji
  const [errorMessage, setErrorMessage] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // Hook nawigacji

  // Walidacje pól formularza
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateUsername = (username) => {
    return username.length <= 12 && username.length > 0;
  };

  // Obsługa akcji formularza autentykacji
  const handleAuthAction = async (e) => {
    e.preventDefault();
    console.log('Handling auth action...');
    setErrorMessage(''); // Czyszczenie poprzednich wiadomości o błędach

    // Walidacja pól formularza przed wysłaniem
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
      if (isLoginActive) {
        console.log('Logging in...');
        await login(email, password); // Proces logowania
      } else {
        console.log('Signing up...');
        const response = await signUp(username, email, password); // Proces rejestracji
        if (response && response.error) throw response.error;
      }

      // Jeśli nie ma błędów, czyszczenie formularza
      console.log('Success');
      setEmail('');
      setPassword('');
      setUsername('');
    } catch (error) {
      console.log('Error during authentication:', error);
      setErrorMessage(error.message); // Ustawienie wiadomości błędu w stanie
      console.log('Error message set in state:', error.message);
    }
  };

  // Przełączanie między logowaniem a rejestracją
  const toggleAuthMode = () => {
    setIsLoginActive(!isLoginActive);
    setErrorMessage(''); // Czyszczenie błędów przy zmianie trybu
  };

  // Obsługa wylogowania
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/'); // Przekierowanie na stronę główną po wylogowaniu
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="right-sidebar">
      {user ? (
        // Sekcja dla zalogowanych użytkowników
        <>
          <div className="logout" onClick={handleLogout}>
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
