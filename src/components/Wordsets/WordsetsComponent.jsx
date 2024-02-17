import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWordsets } from '/src/api/api.js';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Wordsets.scss';

// Komponent wyświetlający zestawy słów
const WordSetsComponent = () => {
  const [wordsets, setWordsets] = useState([]); // Stan przechowujący zestawy słów
  const [error, setError] = useState(null); // Stan przechowujący błąd
  const navigate = useNavigate(); // Hook do nawigacji

  // Efekt pobierający zestawy słów z bazy danych
  useEffect(() => {
    const loadWordsets = async () => {
      // Funkcja asynchroniczna do pobierania zestawów słów
      console.log('Starting to load wordsets');
      try {
        const fetchedWordsets = await fetchWordsets(); // Pobranie zestawów słów
        console.log('Fetched wordsets:', fetchedWordsets);
        if (fetchedWordsets) {
          // Jeśli zestawy słów zostały pobrane, to wyodrębnij unikalne kategorie
          const uniqueCategories = [...new Set(fetchedWordsets.map((wordSet) => wordSet.category))]; // Wyodrębnienie unikalnych kategorii
          console.log('Unique Categories', uniqueCategories);
          setWordsets(uniqueCategories);
        }
      } catch (err) {
        // Obsługa błędu
        console.error('Error while loading words:', err);
        setError('Not able to load wordsets');
      }
    };

    loadWordsets(); // Wywołanie funkcji ładowania zestawów słów
  }, []);

  // Obsługa kliknięcia na kartę zestawu słów
  const handleWordSetClick = (category) => {
    console.log('Chosen category:', category);
    // Nawigacja do strony ćwiczeń dla wybranej kategorii poprzez URL
    navigate(`/wordsets/${category}/exercises`);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Ustawienia dla karuzeli
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    rows: 4,
    slidesPerRow: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          rows: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          rows: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 1,
        },
      },
    ],
  };

  return (
    <div className="word-sets-page">
      <div className="word-sets-header">
        <h2>Zestawy Słów</h2>
      </div>
      <div className="word-sets-container">
        {error && <div className="error-message">{error}</div>}
        <Slider {...settings}>
          {wordsets.map((category, index) => (
            // Renderowanie kart dla każdej unikalnej kategorii
            <div key={index} className="word-set-card" onClick={() => handleWordSetClick(category)}>
              {capitalizeFirstLetter(category)}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default WordSetsComponent;
