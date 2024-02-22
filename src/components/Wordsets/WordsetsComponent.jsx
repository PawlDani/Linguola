import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchWordsets, fetchFavorites, addFavorite, removeFavorite } from '/src/api/api.js';
import { useAuth } from '/src/hooks/AuthProvider';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './Wordsets.scss';

// Komponent wyświetlający zestawy słów
const WordSetsComponent = () => {
  const [wordsets, setWordsets] = useState([]); // Stan przechowujący zestawy słów
  const [favorites, setFavorites] = useState([]); // Stan przechowujący ulubione zestawy słów
  const [error, setError] = useState(null); // Stan przechowujący błąd
  const navigate = useNavigate(); // Hook do nawigacji
  const { user } = useAuth(); // Hook do autoryzacji

  // Efekt pobierający zestawy słów z bazy danych
  useEffect(() => {
    const loadWordsets = async () => {
      // Funkcja asynchroniczna do pobierania zestawów słów
      try {
        const fetchedWordsets = await fetchWordsets(); // Pobranie zestawów słów
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

    // Efekt pobierający ulubione zestawy słów z bazy danych
    const loadFavorites = async () => {
      if (user) {
        const fetchedFavorites = await fetchFavorites(user.id);
        console.log('Fetched favorites:', fetchedFavorites);
        setFavorites(fetchedFavorites);
      }
    };

    loadWordsets();
    loadFavorites();
  }, [user]); // Efekt wywoływany przy zmianie użytkownika

  // Obsługa kliknięcia na kartę zestawu słów
  const handleWordSetClick = (category) => {
    console.log('Chosen category:', category);
    // Nawigacja do strony ćwiczeń dla wybranej kategorii poprzez URL
    navigate(`/wordsets/${category}/exercises`);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Obsługa kliknięcia na przycisk ulubionych
  const handleFavoriteClick = async (event, category) => {
    event.stopPropagation(); // Zatrzymanie propagacji zdarzenia, aby nie wywołać obsługi kliknięcia na kartę

    if (!user) {
      alert('Musisz być zalogowany, aby uzyskać dostęp do tej strony'); // Alert dla użytkownika, który nie jest zalogowany
      return;
    }

    const isFavorite = favorites.includes(category); // Sprawdza, czy kategoria jest już ulubiona
    if (isFavorite) {
      // Jeśli kategoria jest już ulubiona, próba jej usunięcia
      try {
        const success = await removeFavorite(user.id, category);
        if (success) {
          alert('Kategoria została usunięta z ulubionych'); // Informacja dla użytkownika
          // Aktualizacja lokalnego stanu, aby odzwierciedlić zmianę
          setFavorites(favorites.filter((favCategory) => favCategory !== category));
        } else {
          alert('Nie udało się usunąć kategorii z ulubionych'); // Informacja dla użytkownika
        }
      } catch (error) {
        console.error('Błąd podczas usuwania ulubionego:', error); // Logowanie błędu
      }
    } else {
      // Jeśli kategoria nie jest ulubiona, próba dodania jej do ulubionych
      try {
        const success = await addFavorite(user.id, category);
        if (success) {
          alert('Kategoria została dodana do ulubionych'); // Informacja dla użytkownika
          // Aktualizacja lokalnego stanu, aby odzwierciedlić nową ulubioną kategorię
          setFavorites([...favorites, category]);
        } else {
          alert('Nie udało się dodać kategorii do ulubionych'); // Informacja dla użytkownika
        }
      } catch (error) {
        console.error('Błąd podczas dodawania do ulubionych:', error); // Logowanie błędu
      }
    }
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
            <div key={index} className="word-set-card" onClick={() => handleWordSetClick(category)}>
              <div className="wordset-content">{capitalizeFirstLetter(category)}</div>
              <button
                className="favorite-btn"
                onClick={(e) => handleFavoriteClick(e, category)}
                aria-label="Add to favorites"
              >
                <i className={`fa-solid fa-bookmark ${favorites.includes(category) ? 'favorited' : ''}`}></i>
              </button>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default WordSetsComponent;
