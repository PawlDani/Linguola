import React, { useState, useEffect } from 'react';
import Modal from '/src/components/Exercises/Modal/modal';
import './Flashcards.scss';

const FlashcardComponent = ({ terms, onChangeGame, category }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardStatus, setCardStatus] = useState({});
  const [showModal, setShowModal] = useState(false);

  const statusKey = `flashcardsStatus-${category}`; // Klucz do zapisu statusu fiszek w localStorage
  const completionKey = `flashcardsCompleted-${category}`; // Klucz do zapisu statusu ukończenia fiszek w localStorage

  useEffect(() => {
    const savedStatus = JSON.parse(localStorage.getItem(statusKey)) || {}; // Pobranie statusu fiszek z localStorage
    setCardStatus(savedStatus); // Ustawienie statusu fiszek

    if (!localStorage.getItem(completionKey)) {
      // Jeśli fiszki nie zostały ukończone
      checkCompletion(savedStatus); // to sprawdź, czy wszystkie fiszki zostały oznaczone jako znane
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, category]);

  // Sprawdzenie, czy wszystkie fiszki zostały oznaczone jako znane
  const checkCompletion = (status) => {
    const allKnown = terms.every((term) => status[term.id] === 'known');
    if (allKnown && terms.length > 0) {
      setShowModal(true);
      const completionKey = `flashcardsCompleted-${category}`; // Klucz do zapisu statusu ukończenia fiszek w localStorage
      localStorage.setItem(completionKey, 'true');
    }
  };

  // Odwrócenie fiszki
  const handleFlipCard = () => {
    setIsFlipped(!isFlipped);
    console.log('Flashcard flipped');
  };

  // Oznaczenie fiszki jako znanej lub do powtórzenia
  const handleMarkCard = (status) => {
    const newStatus = { ...cardStatus, [terms[currentCardIndex].id]: status };
    console.log(`Flashcard marked as: ${status}`);
    setCardStatus(newStatus);
    localStorage.setItem(statusKey, JSON.stringify(newStatus));

    // Pokaz kolor fiszki tylko na moment zanim sie zmieni
    setTimeout(() => {
      if (status === 'revisit') {
        // Resetowanie statusu fiszek, jeśli jakakolwiek fiszka została oznaczona do powtórzenia
        localStorage.removeItem(completionKey);
        console.log('Resetting flashcards completion');
      }

      handleNextCard();

      // Ponowne sprawdzenie, czy wszystkie fiszki zostały oznaczone jako znane
      if (status === 'known') {
        checkCompletion(newStatus);
      }
    }, 500);
  };

  // Przejście do następnej fiszki
  const handleNextCard = () => {
    setCurrentCardIndex((currentCardIndex + 1) % terms.length);
    setIsFlipped(false);
  };

  // Akcje dla przycisków w modalu
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
