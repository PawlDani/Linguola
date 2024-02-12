import React, { useState, useEffect } from 'react';
import './MatchingGame.scss';

// Komponent gry w dopasowywanie par
const MatchingGameComponent = ({ terms }) => {
  // Stany przechowujace karty, wybrane karty oraz ilosc dopasowanych par
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);

  // Efekt inicjalizujacy gre przy zmianie zestawu slow
  useEffect(() => {
    initializeGame();
  }, [terms]);

  // Funkcja inicjalizujaca gre, przygotowujaca karty, tasujaca je i ustawiajaca stany
  const initializeGame = () => {
    const preparedCards = prepareCards(terms);
    const shuffledCards = shuffleCards(preparedCards);
    setCards(shuffledCards.map((card) => ({ ...card, unmatched: false })));
    setSelectedCards([]);
    setMatchedPairs(0);
    console.log('Game initialized');
  };

  // Funkcja przygotowująca karty na podstawie zestawu terminów
  const prepareCards = (terms) => {
    return terms.flatMap((term) => [
      { id: `${term.id}-term`, content: term.term, type: 'term', matched: false },
      { id: `${term.id}-definition`, content: term.definition, type: 'definition', matched: false },
    ]);
  };

  // Funkcja tasująca karty
  const shuffleCards = (cards) => {
    let shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Funkcja obsługująca kliknięcie karty
  const handleCardClick = (cardId) => {
    const newSelectedCard = cards.find((card) => card.id === cardId);
    if (selectedCards.length === 2 || newSelectedCard.matched) return;
    if (!selectedCards.includes(newSelectedCard)) {
      const updatedSelectedCards = [...selectedCards, newSelectedCard];
      setSelectedCards(updatedSelectedCards);

      if (updatedSelectedCards.length === 2) {
        checkForMatch(updatedSelectedCards);
      }
    }
    console.log('Card clicked:', newSelectedCard);
  };

  // Funkcja sprawdzająca czy wybrane karty są parą
  const checkForMatch = (selectedCards) => {
    const [firstCard, secondCard] = selectedCards;
    if (firstCard.id.split('-')[0] === secondCard.id.split('-')[0]) {
      setMatchedPairs((prev) => prev + 1);
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === firstCard.id || card.id === secondCard.id ? { ...card, matched: true } : card
        )
      );
      setSelectedCards([]);
      console.log('Match found!');
    } else {
      setCards((prevCards) =>
        prevCards.map((card) => (card === firstCard || card === secondCard ? { ...card, unmatched: true } : card))
      );
      setTimeout(() => {
        setCards((prevCards) => prevCards.map((card) => ({ ...card, unmatched: false })));
        setSelectedCards([]);
        console.log('No match found!');
      }, 1000);
    }
  };

  // Renderowanie komponentu z gra
  return (
    <div className="matching-game-container">
      {cards.map((card) => (
        <div
          key={card.id}
          className={`card ${selectedCards.includes(card) ? 'selected' : ''} ${card.matched ? 'matched' : ''} ${card.unmatched ? 'unmatched' : ''}`}
          onClick={() => handleCardClick(card.id)}
        >
          <div className="card-content">{card.content}</div>
        </div>
      ))}
      <div className="matched-pairs-info">Matched Pairs: {matchedPairs}</div>
    </div>
  );
};

export default MatchingGameComponent;
