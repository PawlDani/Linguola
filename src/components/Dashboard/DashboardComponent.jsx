import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchWordsets } from '/src/api/api.js';
import './Dashboard.scss';

// Komponent strony głównej
const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(''); // Aktualna data
  const [wordsets, setWordsets] = useState([]); // Zbiory słówek
  const navigate = useNavigate();

  useEffect(() => {
    // Ustawienie aktualnej daty
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(
        `${now.toLocaleString('pl-PL', { weekday: 'long' })}, ${now.getDate()} ${now.toLocaleString('pl-PL', { month: 'long' })} ${now.getFullYear()}`
      ); // Formatowanie daty
    }, 1000);

    const loadWordsets = async () => {
      try {
        const fetchedWordsets = await fetchWordsets(); // Pobranie zbiorów słówek z API
        // Tworzenie unikalnej listy kategorii słówek
        const uniqueCategories = Array.from(new Set(fetchedWordsets.map((wordset) => wordset.category))).map(
          (category) => {
            // Znalezienie pierwszego zbioru słówek dla danej kategorii
            return fetchedWordsets.find((wordset) => wordset.category === category);
          }
        );
        // Mieszanie kategorii
        const shuffledWordsets = uniqueCategories.sort(() => Math.random() - 0.5);
        // Ustawienie 10 pierwszych kategorii do wyświetlenia w stanie komponentu
        setWordsets(shuffledWordsets.slice(0, 20));
      } catch (error) {
        console.error('Error fetching wordsets:', error);
      }
    };

    loadWordsets(); // Wywołanie funkcji do pobrania zbiorów słówek

    return () => clearInterval(timer);
  }, []);

  const handleWordsetClick = (category) => {
    console.log('Card clicked, navigating to: ', category);
    navigate(`/wordsets/${category}/exercises`);
    // Przekierowanie do wybranego zbioru słówek
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 2180,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="dashboard_top">
        <h2>Start</h2>
        <p>{currentDate}</p>
      </div>
      <div className="dashboard_middle">
        <img src="/src/assets/images/woman-teaching.png" alt="user" />
        <p>Witaj w Linguola!</p>
      </div>

      <div className="dashboard_bottom_header"></div>
      <div className="dashboard_bottom">
        <h3>Popularne Zestawy</h3>
        {wordsets.length > 0 ? (
          <Slider {...sliderSettings}>
            {wordsets.map((wordset, index) => (
              <div key={index} className="wordset-slide" onClick={() => handleWordsetClick(wordset.category)}>
                <div className="wordset-category">{capitalizeFirstLetter(wordset.category)}</div>
              </div>
            ))}
          </Slider>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

console.log(window.innerWidth);
export default Dashboard;
