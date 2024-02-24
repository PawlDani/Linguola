import React, { useState, useEffect } from 'react';
import { fetchFavorites } from '/src/api/api.js'; // Adjust the path as necessary
import { useAuth } from '/src/hooks/AuthProvider'; // Make sure this path is correct
import { useNavigate } from 'react-router-dom';
import './FavWordsets.scss';

// Komponent wyświetlający ulubione zestawy
const FavWordsets = () => {
  const [favWordsets, setFavWordsets] = useState([]);
  const { user } = useAuth(); // Użycie hooka useAuth do pobrania informacji o zalogowanym użytkowniku
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchFavoritedWordsets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchFavoritedWordsets = async () => {
    const fetchedFavWordsets = await fetchFavorites(user.id);
    console.log(fetchedFavWordsets);
    setFavWordsets(fetchedFavWordsets || []);
  };

  const handleWordsetClick = (category) => {
    navigate(`/wordsets/${category}/exercises`); // Nawigacja do wybranego zestawu
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="fav-wordsets-page">
      <div className="fav-wordsets-header">
        <h2>Ulubione Zestawy</h2>
      </div>
      <div className="fav-wordsets-container">
        {favWordsets.map((category, index) => (
          <div key={index} className="word-set-card" onClick={() => handleWordsetClick(category)}>
            <div className="wordset-content">
              <p>{capitalizeFirstLetter(category)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavWordsets;
