import React, { useState, useCallback, useEffect } from 'react';
import './Translation.scss';

const TranslationComponent = ({ terms }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0); // Indeks bieżącej karty
  const [userInput, setUserInput] = useState(''); // Wprowadzony przez użytkownika tekst
  const [isCorrect, setIsCorrect] = useState(null); // Stan określający, czy udzielona odpowiedź jest poprawna

  useEffect(() => {
    console.log('Translation game initialized with terms:', terms); // log dla inicjalizacji komponentu z terms
  }, [terms]);

  // Funkcja wywoływana przy sprawdzaniu odpowiedzi
  const handleCheckAnswer = useCallback(() => {
    const correct = userInput.trim().toLowerCase() === terms[currentCardIndex].definition.toLowerCase();
    setIsCorrect(correct); // Aktualizacja stanu w zależności od poprawności odpowiedzi
    console.log(correct ? 'Correct answer' : 'Incorrect answer');
  }, [userInput, terms, currentCardIndex]);

  // Funkcja wywoływana przy przejściu do następnej karty
  const handleNextCard = useCallback(() => {
    const correct = userInput.trim().toLowerCase() === terms[currentCardIndex].definition.toLowerCase();
    if (correct) {
      setCurrentCardIndex((prevIndex) => (prevIndex + 1) % terms.length); // Przejście do następnej karty
      setUserInput(''); // Czyszczenie pola wprowadzania
      setIsCorrect(null); // Reset stanu dla następnej karty
      console.log('Moving to next card');
    } else {
      alert('Niepoprawnie, proszę wpisać poprawną odpowiedź, aby kontynuować.'); // Alert, jeśli odpowiedź jest nadal niepoprawna
      console.log('Incorrect answer');
    }
  }, [userInput, terms, currentCardIndex]);

  // Obsługa zdarzeń klawiatury dla całego komponentu
  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        isCorrect === null ? handleCheckAnswer() : handleNextCard(); // Logika decydująca, czy sprawdzić odpowiedź, czy przejść dalej
      }
    },
    [isCorrect, handleCheckAnswer, handleNextCard]
  );

  return (
    <div className="translation-game-container" onKeyDown={handleKeyPress} tabIndex="0">
      {' '}
      {/* Umożliwienie obsługi zdarzeń klawiatury */}
      {isCorrect !== null && (
        <h2 className={`answer-header ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? 'Dobrze' : 'Źle'} {/* Nagłówek informujący o poprawności odpowiedzi */}
        </h2>
      )}
      <div className={`translation-card ${isCorrect ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
        <div className="term">{terms[currentCardIndex].term}</div>
        {isCorrect === false && (
          <>
            {' '}
            {/* Wyświetlanie informacji zwrotnej tylko dla niepoprawnych odpowiedzi */}
            <div className="your-answer">Twoja odpowiedź: {userInput}</div>
            <div className="right-answer">Prawidłowa odpowiedź: {terms[currentCardIndex].definition}</div>
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
  );
};

export default TranslationComponent;
