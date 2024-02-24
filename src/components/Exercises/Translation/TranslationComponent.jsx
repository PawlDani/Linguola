import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '/src/components/Exercises/Modal/modal';
import './Translation.scss';
import { updateUserProgress, fetchUserProgress, resetUserProgress } from '/src/api/api';
import { useAuth } from '/src/hooks/AuthProvider';

const TranslationComponent = ({ terms, onChangeGame, category }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [correctFirstAttempts, setCorrectFirstAttempts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [termProgress, setTermProgress] = useState(
    new Array(terms.length).fill({ attempted: false, correctFirstAttempt: false })
  );
  const navigate = useNavigate();

  const { user } = useAuth();
  const userId = user?.id;

  // Pobieranie postępu użytkownika z bazy danych
  useEffect(() => {
    if (userId) {
      const initTermProgress = async () => {
        for (let i = 0; i < terms.length; i++) {
          const { data, error } = await fetchUserProgress(userId, terms[i].category);
          if (!error && data) {
            setTermProgress((prev) =>
              prev.map((tp, index) => (index === i ? { ...tp, correctFirstAttempt: data.correct_attempts >= 3 } : tp))
            );
          }
        }
      };
      initTermProgress();
    }
  }, [terms, userId]);

  // Funkcja sprawdzająca, czy wszystkie terminy zostały ukończone
  const checkAllTermsCompleted = useCallback(async () => {
    const { data, error } = await fetchUserProgress(userId, category);
    if (error) {
      console.error('Error fetching all user progress:', error);
      return false;
    }

    return data && data.every((p) => p.completed);
  }, [userId, category]);

  const handleCheckAnswer = useCallback(async () => {
    const correct = userInput.trim().toLowerCase() === terms[currentCardIndex].term.toLowerCase();
    setIsCorrect(correct);
    if (correct) {
      if (!termProgress[currentCardIndex].attempted) {
        const newCorrectFirstAttempts = [...correctFirstAttempts, terms[currentCardIndex].id];
        setCorrectFirstAttempts(newCorrectFirstAttempts);
        if (userId) {
          await updateUserProgress(userId, category, terms[currentCardIndex].id, true);

          const allCompleted = await checkAllTermsCompleted();
          if (allCompleted) {
            setShowModal(true);
          }
        } else {
          console.error('No user ID available, cannot update progress.');
        }
      }
    } else {
      setErrorMessage('Niepoprawnie, proszę wpisać poprawną odpowiedź, aby kontynuować.');
    }
    setTermProgress((prev) => prev.map((tp, index) => (index === currentCardIndex ? { ...tp, attempted: true } : tp)));
  }, [
    userInput,
    terms,
    currentCardIndex,
    termProgress,
    userId,
    category,
    correctFirstAttempts,
    checkAllTermsCompleted,
  ]);

  const handleNextCard = useCallback(() => {
    const newTermProgress = [...termProgress];
    newTermProgress[currentCardIndex].attempted = false;

    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % terms.length);
    setUserInput('');
    setIsCorrect(null);
    setErrorMessage('');

    if (currentCardIndex + 1 === terms.length) {
      const allAttempted = termProgress.every((tp) => tp.attempted);
      if (allAttempted) {
        const fullyLearned = termProgress.filter((tp) => tp.correctFirstAttempt).length;
        if (fullyLearned === terms.length) {
          setShowModal(true);
        } else {
          // Prepare for the next round
          setTermProgress(newTermProgress.map((tp) => ({ ...tp, attempted: false })));
          setCurrentCardIndex(0);
        }
      }
    }
  }, [currentCardIndex, terms.length, termProgress]);

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === 'Enter') {
        isCorrect === null ? handleCheckAnswer() : handleNextCard();
      }
    },
    [isCorrect, handleCheckAnswer, handleNextCard]
  );

  const modalActions = [
    {
      label: 'Rozpocznij ponownie',
      className: 'restart-button',
      onClick: async () => {
        const { error } = await resetUserProgress(userId, category);
        if (error) {
          console.error('Could not reset progress:', error);
        } else {
          setCorrectFirstAttempts([]);
          setCurrentCardIndex(0);
          setShowModal(false);
          setTermProgress(new Array(terms.length).fill({ attempted: false, correctFirstAttempt: false }));
          onChangeGame('translation');
        }
      },
      icon: 'fa-solid fa-repeat',
    },
    {
      label: 'Przejdź do innego zestawu',
      className: 'switch-button',
      onClick: () => navigate('/wordsets'),
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
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {isCorrect !== null && (
          <h2 className={`answer-header ${isCorrect ? 'correct' : 'incorrect'}`}>{isCorrect ? 'Dobrze' : 'Źle'}</h2>
        )}
        <div className={`translation-card ${isCorrect ? 'correct' : isCorrect === false ? 'incorrect' : ''}`}>
          <div className="term">{terms[currentCardIndex].definition}</div>
          {isCorrect === false && (
            <>
              <div className="your-answer">Twoja odpowiedź: {userInput}</div>
              <div className="right-answer">Prawidłowa odpowiedź: {terms[currentCardIndex].term}</div>
            </>
          )}
        </div>
        <input
          className="translation-input"
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={isCorrect === false ? 'Przepisz odpowiedź' : 'Wpisz tłumaczenie'}
          autoFocus
        />
        <div className="button-container">
          <button className="check-button" onClick={handleCheckAnswer} disabled={isCorrect !== null}>
            Sprawdź
          </button>
          {isCorrect !== null && (
            <button className="next-button" onClick={handleNextCard}>
              Następna karta
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default TranslationComponent;
