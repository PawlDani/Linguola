import React, { useState, useEffect } from 'react';
import './Dashboard.scss';

// Komponent strony głównej
const Dashboard = () => {
  const [currentDate, setCurrentDate] = useState(''); // Aktualna data

  useEffect(() => {
    // Ustawienie aktualnej daty
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDate(`${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`); // Formatowanie daty
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard_top">
        <h2>Dashboard</h2>
        <p>{currentDate}</p>
      </div>
      <div className="dashboard_middle">
        <img src="/src/assets/images/woman-teaching.png" alt="user" />
        <p>Welcome to Linguola!</p>
      </div>
      <div className="dashboard_bottom">
        <h2>Recently Studied</h2>
      </div>
    </div>
  );
};

export default Dashboard;
