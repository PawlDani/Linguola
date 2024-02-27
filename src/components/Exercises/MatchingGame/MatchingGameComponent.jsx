import React, { useState, useEffect } from 'react';
import Modal from '/src/components/Exercises/Modal/modal';
import './MatchingGame.scss';

const MatchingGameComponent = ({ terms, onChangeGame }) => {
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [currentTerms, setCurrentTerms] = useState([]);
  const totalPairs = currentTerms.length;

  // Efekt, który inicjalizuje grę po zmianie zestawu terminów
  useEffect(() => {
    const selectedTerms = selectSubsetOfTerms(terms, 10);
    setCurrentTerms(selectedTerms);
    initializeGame(selectedTerms);
    console.log('MatchingGame initialized with terms:', selectedTerms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms]);

  // Funkcja wybierająca podzbiór terminów do gry
  const selectSubsetOfTerms = (terms, maxSize) => {
    if (terms.length <= maxSize) return terms;
    const shuffled = [...terms].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, maxSize);
  };

  // Funkcja inicjalizująca grę - tasowanie kart i resetowanie stanów
  const initializeGame = (selectedTerms) => {
    const preparedCards = prepareCards(selectedTerms);
    const shuffledCards = shuffleCards(preparedCards);
    setCards(shuffledCards.map((card) => ({ ...card, unmatched: false })));
    setSelectedCards([]);
    setMatchedPairs(0);
    setShowModal(false);
  };

  // Przygotowanie kart - tworzenie pary term-definicja dla każdego terminu
  const prepareCards = (selectedTerms) =>
    selectedTerms.flatMap((term) => [
      { id: `${term.id}-term`, content: term.term, type: 'term', matched: false },
      { id: `${term.id}-definition`, content: term.definition, type: 'definition', matched: false },
    ]);

  console.log('Cards prepared:', cards);

  // Tasowanie kart
  const shuffleCards = (cards) => {
    let shuffled = [...cards];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  console.log('Cards shuffled:', cards);

  // Obsługa kliknięcia na kartę
  const handleCardClick = (cardId) => {
    const newSelectedCard = cards.find((card) => card.id === cardId);

    if (selectedCards.length === 2 || newSelectedCard.matched || newSelectedCard.unmatched) return;

    if (!selectedCards.includes(newSelectedCard)) {
      setSelectedCards([...selectedCards, newSelectedCard]);
      console.log('Card selected:', newSelectedCard);

      if (selectedCards.length + 1 === 2) {
        checkForMatch([...selectedCards, newSelectedCard]);
      }
    }
  };

  // Sprawdzenie, czy wybrane karty tworzą parę
  const checkForMatch = (selectedCards) => {
    const [firstCard, secondCard] = selectedCards;

    if (firstCard.id.split('-')[0] === secondCard.id.split('-')[0]) {
      console.log('Match found:', firstCard, secondCard);
      setMatchedPairs((prev) => prev + 1);

      if (matchedPairs + 1 === totalPairs) {
        setShowModal(true); // Pokazanie modalu gratulacyjnego
      }

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === firstCard.id || card.id === secondCard.id ? { ...card, matched: true } : card
        )
      );

      setSelectedCards([]);
    } else {
      console.log('No match:', firstCard, secondCard);
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

  // Akcje dla modalu końca gry
  const modalActions = [
    {
      label: 'Rozpocznij ponownie',
      className: 'restart-button',
      onClick: () => {
        onChangeGame('matching');
      },
      icon: 'fa-solid fa-repeat',
    },
    {
      label: 'Przejdź do Tłumaczenia',
      className: 'switch-button',
      onClick: () => {
        onChangeGame('translation');
      },
      icon: 'fa-solid fa-forward-step',
    },
  ];

  // Obliczenie szerokości paska postępu
  const progressBarWidth = (matchedPairs / totalPairs) * 100;

  return (
    <div className="matching-game-container">
      {showModal && (
        <Modal
          title="Gratulacje!"
          messageOne="Udało Ci się dopasować wszystkie pary!"
          messageTwo="Co chciałbyś teraz zrobić?"
          actions={modalActions}
        />
      )}
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
