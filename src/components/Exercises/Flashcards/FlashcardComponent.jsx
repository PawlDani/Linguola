import React, { useState, useEffect } from 'react';
import './Flashcards.scss';

const FlashcardComponent = ({ terms }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatus, setCardStatus] = useState({});

  useEffect(() => {
    console.log('Flashcards initialized with terms:', terms); // log dla inicjalizacji komponentu z terms
  }, [terms]);

  // Funkcja obsługująca obracanie karty, czyli zmianę widoku z term na definition i odwrotnie
  const handleFlipCard = () => {
    console.log('Flipping card');
    setIsFlipped(!isFlipped);
  };

  // Funkcja obsługująca oznaczanie karty jako 'znana' lub 'do powtórki'
  const handleMarkCard = (status) => {
    console.log(`Marking card as ${status}`);
    setCardStatus({ ...cardStatus, [terms[currentCardIndex].id]: status }); // Ustawienie statusu karty w stanie, czyli oznaczenie karty jako 'znana' lub 'do powtórki'
    handleNextCard(); // Automatyczne przejście do następnej karty
  };

  // Funkcja obsługująca przejście do następnej karty
  const handleNextCard = () => {
    console.log('Moving to next card');
    setIsFlipped(false);
    const nextIndex = currentCardIndex < terms.length - 1 ? currentCardIndex + 1 : 0; // Przejście do pierwszej karty, jeśli jesteśmy na ostatniej
    setCurrentCardIndex(nextIndex); // Ustawienie indeksu aktualnej karty
  };

  return (
    <div className="flashcard-container">
      {terms.length > 0 && (
        <div
          className={`flashcard ${isFlipped ? 'flipped' : ''} ${cardStatus[terms[currentCardIndex].id] || ''}`} // Dodanie klasy w zależności od statusu karty
          onClick={handleFlipCard} // Obsługa kliknięcia na kartę
        >
          <div className="front">
            {/* Wyświetlanie terminu na froncie karty */}
            <div className="term">{terms[currentCardIndex].term}</div>
          </div>
          <div className="back">
            {/* Wyświetlanie definicji na tyle karty */}
            <div className="definition">{terms[currentCardIndex].definition}</div>
          </div>
        </div>
      )}
      <div className="card-controls">
        {/* Przyciski do oznaczania karty */}
        <button className="known-button" onClick={() => handleMarkCard('known')}>
          Znam
        </button>
        <button className="revisit-button" onClick={() => handleMarkCard('revisit')}>
          Powtórz
        </button>
        <button className="next-button" onClick={handleNextCard}>
          Następna
        </button>
      </div>
    </div>
  );
};

export default FlashcardComponent;
