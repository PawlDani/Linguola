import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '/src/components/Exercises/Modal/modal';
import './Translation.scss';

const TranslationComponent = ({ terms, onChangeGame, category }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Definicja klucza stanu gry dla danej kategorii
  const gameStateKey = `translationGameState-${category}`;

  useEffect(() => {
    // Pobranie stanu gry z localStorage
    const savedState = JSON.parse(localStorage.getItem(gameStateKey));
    if (savedState) {
      setCurrentCardIndex(savedState.currentCardIndex);
      setCorrectAnswersCount(savedState.correctAnswersCount);
      setShowModal(savedState.correctAnswersCount === terms.length);
    }
  }, [terms, category, gameStateKey]);

  // Zapisanie stanu gry do localStorage
  const saveGameState = useCallback(() => {
    const gameState = { currentCardIndex, correctAnswersCount };
    localStorage.setItem(gameStateKey, JSON.stringify(gameState));
  }, [currentCardIndex, correctAnswersCount, gameStateKey]);

  // Czyszczenie stanu gry z localStorage
  const clearGameState = useCallback(() => {
    localStorage.removeItem(gameStateKey);
  }, [gameStateKey]);

  // Funkcja wywoływana przy sprawdzaniu odpowiedzi
  const handleCheckAnswer = useCallback(() => {
    const correct = userInput.trim().toLowerCase() === terms[currentCardIndex].term.toLowerCase();
    setIsCorrect(correct); // Ustawienie stanu poprawności odpowiedzi
    console.log(correct ? 'Correct answer' : 'Incorrect answer');
    if (correct) {
      saveGameState(); // Zapisanie stanu gry do localStorage po poprawnej odpowiedzi
    } else {
      setErrorMessage('');
    }
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
      console.log('Moving to next card:', currentCardIndex + 1);

      saveGameState(); // Zapisanie stanu gry do localStorage po przejściu do następnej karty
    } else {
      setErrorMessage('Niepoprawnie, proszę wpisać poprawną odpowiedź, aby kontynuować.'); // Komunikat o błędzie przy niepoprawnej odpowiedzi (nie można przejść dalej)
      console.log('Incorrect answer');
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
        clearGameState(); // Czyszczenie stanu gry z localStorage
        setCorrectAnswersCount(0); // Reset liczby poprawnych odpowiedzi
        setCurrentCardIndex(0); // Reset indeksu bieżącej karty
        setShowModal(false); // Ukrycie modalu
        onChangeGame('translation'); // Restart gry
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
