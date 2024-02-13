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

  // Ladowanie "terms" na podstawie wybranej kategorii
  useEffect(() => {
    const loadTerms = async () => {
      // Funkcja asynchroniczna do pobrania "terms" na podstawie wybranej kategorii
      const fetchedTerms = await fetchTermsByCategory(category.toLowerCase()); // Pobranie "terms" z API na podstawie wybranej kategorii
      setTerms(fetchedTerms); // Ustawienie pobranych "terms" w stanie
    };

    // Wywołanie funkcji "loadTerms", zależne od zmiany wybranej kategorii
    loadTerms();
  }, [category]);

  useEffect(() => {
    console.log(`Active Game is now: ${activeGame}`); // Logowanie zmiany aktywnej gry
  }, [activeGame]);

  // Funkcja obsługująca zmianę wybranej gry
  const handleGameChange = (game) => {
    setActiveGame(game); // Aktualizacja stanu "activeGame" na podstawie wybranej gry
  };

  // Renderowanie komponentu
  return (
    <div className="exercise-container">
      <div className="exercise-selector">
        <button
          onClick={() => handleGameChange('flashcards')}
          className={`exercise-option ${activeGame === 'flashcards' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-folder"></i>
          Fiszki
        </button>
        <button
          onClick={() => handleGameChange('matching')}
          className={`exercise-option ${activeGame === 'matching' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-puzzle-piece"></i>
          Dopasowanie
        </button>
        <button
          onClick={() => handleGameChange('translation')}
          className={`exercise-option ${activeGame === 'translation' ? 'active' : ''}`}
        >
          <i className="fa-solid fa-pen-to-square"></i>
          Tłumaczenie
        </button>
      </div>
      <div className="game-container">
        {activeGame === 'flashcards' && <FlashcardComponent terms={terms} />}
        {activeGame === 'matching' && <MatchingGameComponent terms={terms} />}
        {activeGame === 'translation' && <TranslationComponent terms={terms} />}
      </div>
    </div>
  );
};

export default ExerciseComponent;
