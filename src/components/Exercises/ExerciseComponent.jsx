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
  console.log('Pobrano kategorię z adresu URL:', category);
  const [terms, setTerms] = useState([]); // Stan przechowujący pobrane "terms", początkowo pusta tablica
  const [activeGame, setActiveGame] = useState('flashcards'); // Stan przechowujący aktywną grę, początkowo "flashcards"
  console.log('Ustawiono początkową grę:', activeGame);

  useEffect(() => {
    const loadTerms = async () => {
      // Asynchroniczne ładowanie terminów na podstawie wybranej kategorii
      console.log('Ładowanie terminów dla kategorii:', category);
      const fetchedTerms = await fetchTermsByCategory(category.toLowerCase());
      console.log('Pobrano terminy:', fetchedTerms);
      setTerms(fetchedTerms); // Ustawienie pobranych terminów
    };

    loadTerms();
  }, [category]);

  const changeGame = (game) => {
    // Funkcja zmieniająca aktywną grę lub restartująca bieżącą grę
    console.log('Zmiana gry na:', game);
    setActiveGame(''); // Chwilowe usunięcie aktywnej gry, aby wymusić odświeżenie komponentu
    setTimeout(() => {
      console.log('Ponowne ustawienie gry na:', game);
      setActiveGame(game);
    }, 0); // Ponowne ustawienie gry
  };

  return (
    <div className="exercise-container">
      <div className="exercise-selector">
        {/* Przyciski do zmiany aktywnej gry */}
        <button
          onClick={() => changeGame('flashcards')}
          className={`exercise-option ${activeGame === 'flashcards' ? 'active' : ''}`}
        >
          Fiszki
        </button>
        <button
          onClick={() => changeGame('matching')}
          className={`exercise-option ${activeGame === 'matching' ? 'active' : ''}`}
        >
          Dopasowanie
        </button>
        <button
          onClick={() => changeGame('translation')}
          className={`exercise-option ${activeGame === 'translation' ? 'active' : ''}`}
        >
          Tłumaczenie
        </button>
      </div>
      <div className="game-container">
        {/* Warunkowe renderowanie komponentów gier w zależności od aktywnej gry */}
        {activeGame === 'flashcards' && <FlashcardComponent terms={terms} onChangeGame={changeGame} />}
        {activeGame === 'matching' && <MatchingGameComponent terms={terms} onChangeGame={changeGame} />}
        {activeGame === 'translation' && <TranslationComponent terms={terms} onChangeGame={changeGame} />}
      </div>
    </div>
  );
};

export default ExerciseComponent;
