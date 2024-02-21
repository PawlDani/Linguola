import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTermsByCategory } from '/src/api/api.js';
import FlashcardComponent from './Flashcards/FlashcardComponent';
import MatchingGameComponent from './MatchingGame/MatchingGameComponent';
import TranslationComponent from './Translation/TranslationComponent';
import './Exercise.scss';

// Komponent obsługujący wybór gry oraz wyświetlanie wybranej gry
const ExerciseComponent = () => {
  const { category } = useParams(); // Hook useParams do pobrania parametru "category" z adresu URL
  const [terms, setTerms] = useState([]); // Stan przechowujący pobrane "terms", początkowo pusta tablica
  const [activeGame, setActiveGame] = useState('flashcards'); // Stan przechowujący aktywną grę, początkowo "flashcards"

  useEffect(() => {
    const loadTerms = async () => {
      // Asynchroniczne ładowanie terminów na podstawie wybranej kategorii
      const fetchedTerms = await fetchTermsByCategory(category.toLowerCase());
      setTerms(fetchedTerms); // Ustawienie pobranych terminów
    };

    loadTerms();
  }, [category]);

  // Funkcja zmieniająca aktywną grę lub restartująca bieżącą grę
  const changeGame = (game) => {
    console.log('Changing game to:', game);
    setActiveGame(''); // Chwilowe usunięcie aktywnej gry, aby wymusić odświeżenie komponentu
    setTimeout(() => {
      console.log('Setting active game:', game);
      setActiveGame(game); // Ponowne ustawienie gry
    }, 0);
  };

  return (
    <div className="exercise-container">
      <div className="exercise-selector">
        {/* Przyciski do zmiany aktywnej gry */}
        <button
          onClick={() => changeGame('flashcards')}
          className={`exercise-option ${activeGame === 'flashcards' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-folder"></i>
          Fiszki
        </button>
        <button
          onClick={() => changeGame('matching')}
          className={`exercise-option ${activeGame === 'matching' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-puzzle-piece"></i>
          Dopasowanie
        </button>
        <button
          onClick={() => changeGame('translation')}
          className={`exercise-option ${activeGame === 'translation' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-pen-to-square"></i>
          Tłumaczenie
        </button>
      </div>
      <div className="game-container">
        {/* Warunkowe renderowanie komponentów gier w zależności od aktywnej gry */}
        {activeGame === 'flashcards' && (
          <FlashcardComponent terms={terms} onChangeGame={changeGame} category={category} />
        )}
        {activeGame === 'matching' && <MatchingGameComponent terms={terms} onChangeGame={changeGame} />}
        {activeGame === 'translation' && (
          <TranslationComponent terms={terms} onChangeGame={changeGame} category={category} />
        )}
      </div>
    </div>
  );
};

export default ExerciseComponent;
