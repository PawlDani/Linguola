import React, { useState, useEffect } from 'react';
import { fetchWordsets } from '/src/api/api.js';
import './Wordsets.scss';

const WordSetsComponent = ({ setActiveWordSet }) => {
  const [wordsets, setWordsets] = useState([]); // stan dla zestawow slow
  const [error, setError] = useState(null); // stan dla bledow

  useEffect(() => {
    const loadWordsets = async () => {
      try {
        // pobranie zestawow slow z API
        const fetchedWordsets = await fetchWordsets();
        if (fetchedWordsets) {
          // wyodrebnienie unikalnych kategorii zestawow slow i ustawienie ich jako stan
          const uniqueCategories = [...new Set(fetchedWordsets.map((wordSet) => wordSet.category))];
          setWordsets(uniqueCategories); // ustawienie stanu dla zestawow slow unikalne kategorie
          console.log('Wordsets:', uniqueCategories);
        }
      } catch (err) {
        console.error('Failed to fetch wordsets:', err);
        setError('Failed to load wordsets. Please try again later.'); // ustawienie komunikatu o bledzie
      }
    };

    loadWordsets();
  }, []);
  // obsluga klikniecia na zestaw slow
  const handleWordSetClick = (category) => {
    setActiveWordSet(category); // ustawienie aktywnego zestawu slow
  };

  return (
    <div className="word-sets-page">
      <div className="word-sets-header">
        <h2>Wordsets</h2>
      </div>
      <div className="word-sets-container">
        <div className="word-sets">
          {error && <div className="error-message">{error}</div>}
          {wordsets.map((category, index) => (
            <div key={index} className="word-set-card" onClick={() => handleWordSetClick(category)}>
              {category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordSetsComponent;
