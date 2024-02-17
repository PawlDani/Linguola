import React, { useState, useEffect } from 'react';
import './MatchingGame.scss';

// Komponent Gratulacyjny Modal
const CongratulationsModal = ({ onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Gratulacje!</h2>
      <p>Udało Ci się dopasować wszystkie pary!</p>
      <p>Przejdź do następnej gry</p>
      <button onClick={onClose}>Zamknij</button>
    </div>
  </div>
);

const MatchingGameComponent = ({ terms }) => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showCongratsModal, setShowCongratsModal] = useState(false); // Stan dla modalu gratulacyjnego
  const totalPairs = terms.length;

  // Efekt inicjalizujący grę
  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms]);

  // Funkcja inicjalizująca grę
  const initializeGame = () => {
    const preparedCards = prepareCards(terms);
    const shuffledCards = shuffleCards(preparedCards);
    setCards(shuffledCards.map((card) => ({ ...card, unmatched: false })));
    setSelectedCards([]);
    setMatchedPairs(0);
    setShowCongratsModal(false); // Resetowanie stanu modalu
  };

  // Przygotowanie kart
  const prepareCards = (terms) => {
    return terms.flatMap((term) => [
      { id: `${term.id}-term`, content: term.term, type: 'term', matched: false },
      { id: `${term.id}-definition`, content: term.definition, type: 'definition', matched: false },
    ]);
  };

  // Tasowanie kart
  const shuffleCards = (cards) => {
    let shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Obsługa kliknięcia karty
  const handleCardClick = (cardId) => {
    const newSelectedCard = cards.find((card) => card.id === cardId);
    if (selectedCards.length === 2 || newSelectedCard.matched || newSelectedCard.unmatched) return;
    if (!selectedCards.includes(newSelectedCard)) {
      const updatedSelectedCards = [...selectedCards, newSelectedCard];
      setSelectedCards(updatedSelectedCards);

      if (updatedSelectedCards.length === 2) {
        checkForMatch(updatedSelectedCards);
      }
    }
  };

  // Sprawdzanie dopasowania
  const checkForMatch = (selectedCards) => {
    const [firstCard, secondCard] = selectedCards;
    if (firstCard.id.split('-')[0] === secondCard.id.split('-')[0]) {
      setMatchedPairs((prev) => prev + 1);
      if (matchedPairs + 1 === totalPairs) {
        setShowCongratsModal(true); // Pokazanie modalu gratulacyjnego
      }
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === firstCard.id || card.id === secondCard.id ? { ...card, matched: true } : card
        )
      );
      setSelectedCards([]);
    } else {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === firstCard.id || card.id === secondCard.id ? { ...card, unmatched: true } : card
        )
      );
      setTimeout(() => {
        setCards((prevCards) => prevCards.map((card) => ({ ...card, unmatched: false })));
        setSelectedCards([]);
      }, 1000);
    }
  };

  // Szerokość paska postępu
  const progressBarWidth = (matchedPairs / totalPairs) * 100;

  return (
    <div className="matching-game-container">
      {showCongratsModal && <CongratulationsModal onClose={() => setShowCongratsModal(false)} />}
      {cards.map((card) => (
        <div
          key={card.id}
          className={`card ${selectedCards.includes(card) ? 'selected' : ''} ${card.matched ? 'matched' : ''} ${card.unmatched ? 'unmatched' : ''}`}
          onClick={() => handleCardClick(card.id)}
        >
          <div className="card-content">{card.content}</div>
        </div>
      ))}
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressBarWidth}%` }}></div>
      </div>
    </div>
  );
};

export default MatchingGameComponent;
