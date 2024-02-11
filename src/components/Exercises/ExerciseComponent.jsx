import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchTermsByCategory } from '/src/api/api.js';
import FlashcardComponent from './Flashcards/FlashcardComponent';

const ExerciseComponent = () => {
  const { category } = useParams();
  const [terms, setTerms] = useState([]);

  useEffect(() => {
    const loadTerms = async () => {
      const fetchedTerms = await fetchTermsByCategory(category);
      setTerms(fetchedTerms);
    };

    loadTerms();
  }, [category]);

  return (
    <div>
      <FlashcardComponent terms={terms} />
      {/* Bede dodawal wiecej komponentow tutaj */}
    </div>
  );
};

export default ExerciseComponent;
