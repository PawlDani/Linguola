import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '/src/components/Exercises/Modal/modal';
import './Translation.scss';

const TranslationComponent = ({ terms, onChangeGame }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Indeks bieżącej karty
  const [userInput, setUserInput] = useState(''); // Wprowadzony przez użytkownika tekst
  const [isCorrect, setIsCorrect] = useState(null); // Stan określający, czy udzielona odpowiedź jest poprawna
  const [errorMessage, setErrorMessage] = useState(''); // Komunikat o błędzie jak uzytkownik wpisze kolejny raz błędną odpowiedź
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // New state variable for tracking correct answers
  const [showModal, setShowModal] = useState(false); // Modal pokazujący się po poprawnym ukończeniu gry

  useEffect(() => {
    console.log('Translation game initialized with terms:', terms); // log dla inicjalizacji komponentu z terms
    const savedState = JSON.parse(localStorage.getItem('translationGameState')); // Pobranie statusu gry z localStorage
    if (savedState) {
      setCurrentCardIndex(savedState.currentCardIndex); // Przywrócenie stanu gry z localStorage
      setCorrectAnswersCount(savedState.correctAnswersCount);
      setShowModal(savedState.correctAnswersCount === terms.length); // Pokaż modal, jeśli wszystkie terminy są zakończone
    }
  }, [terms]);

  const saveGameState = useCallback(() => {
    const gameState = { currentCardIndex, correctAnswersCount }; // Zapisanie stanu gry do localStorage
    localStorage.setItem('translationGameState', JSON.stringify(gameState));
  }, [currentCardIndex, correctAnswersCount]);

  const clearGameState = () => {
    localStorage.removeItem('translationGameState'); // Usunięcie stanu gry z localStorage
  };

  // Funkcja wywoływana przy sprawdzaniu odpowiedzi
  const handleCheckAnswer = useCallback(() => {
    const correct = userInput.trim().toLowerCase() === terms[currentCardIndex].term.toLowerCase();
    setIsCorrect(correct); // Aktualizacja stanu w zależności od poprawności odpowiedzi
    console.log(correct ? 'Correct answer' : 'Incorrect answer');
    if (!correct) {
      setErrorMessage('');
      saveGameState(); // Zapisanie stanu gry do localStorage po sprawdzeniu odpowiedzi
    } // Reset komunikatu o błędzie
  }, [userInput, terms, currentCardIndex, saveGameState]);

  // Funkcja wywoływana przy przejściu do następnej karty
  const handleNextCard = useCallback(() => {
    const correct = userInput.trim().toLowerCase() === terms[currentCardIndex].term.toLowerCase();
    if (correct) {
      const newCorrectAnswersCount = correctAnswersCount + 1;
      setCorrectAnswersCount(newCorrectAnswersCount); // Zwiększenie liczby poprawnych odpowiedzi
      if (newCorrectAnswersCount === terms.length) {
        setShowModal(true); // Pokaż modal, gdy wszystkie terminy są zakończone
      }
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % terms.length); // Przejście do następnej karty
      setUserInput(''); // Czyszczenie pola wprowadzania
      setIsCorrect(null); // Reset stanu dla następnej karty
      setErrorMessage(''); // Reset komunikatu o błędzie przy przejściu do następnej karty
      console.log('Przejście do następnej karty');

      // Zapisanie stanu gry do localStorage po przejściu do następnej karty
      saveGameState();
    } else {
      setErrorMessage('Niepoprawnie, proszę wpisać poprawną odpowiedź, aby kontynuować.'); // Alert, jeśli odpowiedź jest nadal niepoprawna
      console.log('Niepoprawna odpowiedź');
    }
  }, [userInput, terms, currentCardIndex, correctAnswersCount, saveGameState]);

  // Obsługa zdarzeń klawiatury dla całego komponentu
  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        isCorrect === null ? handleCheckAnswer() : handleNextCard(); // Logika decydująca, czy sprawdzić odpowiedź, czy przejść dalej
      }
    },
    [isCorrect, handleCheckAnswer, handleNextCard]
  );

  // Akcje dla modalu końca gry
  const navigate = useNavigate();

  const modalActions = [
    {
      label: 'Rozpocznij ponownie',
      className: 'restart-button',
      onClick: () => {
        clearGameState(); // Clear the saved game state
        setCorrectAnswersCount(0); // Reset correct answers count
        setCurrentCardIndex(0); // Reset current card index
        setShowModal(false); // Close the modal
        onChangeGame('translation'); // Trigger the game to restart
      },
      icon: 'fa-solid fa-repeat',
    },
    {
      label: 'Przejdź do innego zestawu',
      className: 'switch-button',
      onClick: () => {
        navigate('/wordsets');
      },
      icon: 'fa-solid fa-forward-step',
    },
  ];

  return (
    <>
      {showModal && (
        <Modal
          title="Gratulacje!"
          messageOne="Ukończyłeś grę tłumaczenia i znasz wszystkie słowa!"
          messageTwo="Co chciałbyś teraz zrobić?"
          actions={modalActions}
        />
      )}
      <div className="translation-game-container" onKeyDown={handleKeyPress} tabIndex="0">
        {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Wyświetlanie komunikatu o błędzie */}
        {isCorrect !== null && (
          <h2 className={`answer-header ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? 'Dobrze' : 'Źle'} {/* Nagłówek informujący o poprawności odpowiedzi */}
          </h2>
        )}
        <div className={`translation-card ${isCorrect ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
          <div className="term">{terms[currentCardIndex].definition}</div>
          {isCorrect === false && (
            <>
              {' '}
              {/* Wyświetlanie informacji zwrotnej tylko dla niepoprawnych odpowiedzi */}
              <div className="your-answer">Twoja odpowiedź: {userInput}</div>
              <div className="right-answer">Prawidłowa odpowiedź: {terms[currentCardIndex].term}</div>
            </>
          )}
        </div>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)} // Aktualizacja wprowadzonego tekstu
          placeholder={isCorrect === false ? 'Przepisz odpowiedź' : 'Wpisz tłumaczenie'} // Zmiana placeholdera w zależności od stanu
          autoFocus // Automatyczne ustawienie fokusu na polu wprowadzania
        />
        <div className="button-container">
          <button className="check-button" onClick={handleCheckAnswer} disabled={isCorrect !== null}>
            Sprawdź {/* Przycisk do sprawdzania odpowiedzi */}
          </button>
          {isCorrect !== null && (
            <button className="next-button" onClick={handleNextCard}>
              Następna karta {/* Przycisk do przejścia do następnej karty */}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default TranslationComponent;
