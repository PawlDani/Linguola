import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { fetchWordsets } from '/src/api/api.js';
import dashboardImage from '/src/assets/images/woman-teaching.png';
import './Dashboard.scss';

const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [wordsets, setWordsets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Ustawienie aktualnej daty
    const now = new Date();
    setCurrentDate(
      `${now.toLocaleString('pl-PL', { weekday: 'long' })}, ${now.getDate()} ${now.toLocaleString('pl-PL', { month: 'long' })} ${now.getFullYear()}`
    );

    // Pobranie zestawów słówek z API
    const loadWordsets = async () => {
      try {
        const fetchedWordsets = await fetchWordsets();
        const uniqueCategories = Array.from(new Set(fetchedWordsets.map((wordset) => wordset.category))).map(
          (category) => {
            return fetchedWordsets.find((wordset) => wordset.category === category);
          }
        );
        const shuffledWordsets = uniqueCategories.sort(() => Math.random() - 0.5);
        // Ustawienie 10 losowych zestawów słówek
        setWordsets(shuffledWordsets.slice(0, 10));
      } catch (error) {
        console.error('Error fetching wordsets:', error);
      }
    };

    loadWordsets();
  }, []);

  // Obsługa kliknięcia na zestaw słówek, przekierowanie do ćwiczeń
  const handleWordsetClick = (category) => {
    console.log('Card clicked, navigating to: ', category);
    navigate(`/wordsets/${category}/exercises`);
  };

  // Funkcja zamieniająca pierwszą literę na wielką
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // Ustawienia slidera
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 4,
    autoplay: false,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 2210,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1935,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1630,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1460,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
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
        <img src={dashboardImage} alt="user" />
        <div className="dashboard_middle_text">
          <h1>Witaj w Linguola!</h1>
          <h3>Wybierz zestaw słówek, aby rozpocząć naukę.</h3>
          <h3>Pamiętaj, że regularność to klucz do nauki języka</h3>
        </div>
      </div>

      <div className="dashboard_bottom_header"></div>
      <div className="dashboard_bottom">
        <h3>Popularne Zestawy</h3>
        {wordsets.length > 0 ? (
          <Slider {...sliderSettings}>
            {wordsets.map((wordset, index) => (
              <div key={index} className="wordset-slide" onClick={() => handleWordsetClick(wordset.category)}>
                <div className="wordset-category">
                  <p>{capitalizeFirstLetter(wordset.category)}</p>
                </div>
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
