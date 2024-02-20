import React, { useState, useEffect } from 'react';
import Modal from '/src/components/Exercises/Modal/modal';
import './Flashcards.scss';

const FlashcardComponent = ({ terms, onChangeGame }) => {
  // Inicjalizacja stanu
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatus, setCardStatus] = useState({});
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Pobranie statusu fiszek z localStorage
    const savedStatus = JSON.parse(localStorage.getItem('flashcardsStatus')) || {};
    setCardStatus(savedStatus);

    // Sprawdzenie, czy wszystkie fiszki zostały oznaczone jako znane
    if (!localStorage.getItem('flashcardsCompleted')) {
      checkCompletion(savedStatus);
    }
    console.log('Flashcards initialized with terms:', terms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms]);

  const checkCompletion = (status) => {
    // Sprawdzenie, czy wszystkie fiszki zostały oznaczone jako znane
    const allKnown = terms.every((term) => status[term.id] === 'known');
    console.log('All terms known:', allKnown);
    if (allKnown && terms.length > 0) {
      setShowModal(true);
      localStorage.setItem('flashcardsCompleted', 'true');
    }
  };

  const handleFlipCard = () => {
    // Odwrócenie fiszki
    setIsFlipped(!isFlipped);
    console.log('Flashcard flipped');
  };

  const handleMarkCard = (status) => {
    // Oznaczenie fiszki jako znanej lub do powtórzenia
    const newStatus = { ...cardStatus, [terms[currentCardIndex].id]: status };
    console.log(`Flashcard marked as: ${status}`);
    setCardStatus(newStatus);
    localStorage.setItem('flashcardsStatus', JSON.stringify(newStatus));
    // Pokaz kolor fiszki tylko na moment zanim sie zmieni
    setTimeout(() => {
      if (status === 'revisit') {
        // Resetowanie statusu fiszek, jeśli jakakolwiek fiszka została oznaczona do powtórzenia
        localStorage.removeItem('flashcardsCompleted');
        console.log('Resetting flashcards completion');
      }

      handleNextCard();

      // Ponowne sprawdzenie, czy wszystkie fiszki zostały oznaczone jako znane
      if (status === 'known') {
        checkCompletion(newStatus);
      }
    }, 500);
  };

  const handleNextCard = () => {
    // Przejście do następnej fiszki
    const nextIndex = (currentCardIndex + 1) % terms.length;
    console.log('Moving to next card:', nextIndex);
    setCurrentCardIndex(nextIndex);
    setIsFlipped(false);
  };

  const modalActions = [
    {
      label: 'Przejrzyj fiszki',
      className: 'review-button',
      onClick: () => {
        console.log('Clicked review button');
        setShowModal(false);
      },
      icon: 'fa-solid fa-redo',
    },
    {
      label: 'Przejdź do następnej gry',
      className: 'next-game-button',
      onClick: () => {
        console.log('Clicked next game button');
        onChangeGame('matching');
      },
      icon: 'fa-solid fa-forward',
    },
  ];

  return (
    <>
      {showModal && (
        <Modal
          title="Gratulacje!"
          messageOne="Oznaczyłeś wszystkie fiszki jako znane."
          messageTwo="Co chciałbyś zrobić teraz?"
          actions={modalActions}
        />
      )}
      <div className="flashcard-container">
        {terms.length > 0 && (
          <div
            className={`flashcard ${isFlipped ? 'flipped' : ''} ${cardStatus[terms[currentCardIndex].id] || ''}`}
            onClick={handleFlipCard}
          >
            <div className="front">
              <div className="term">{terms[currentCardIndex].term}</div>
            </div>
            <div className="back">
              <div className="definition">{terms[currentCardIndex].definition}</div>
            </div>
          </div>
        )}
        <div className="card-controls">
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
    </>
  );
};

export default FlashcardComponent;
