import React from 'react';
import { useTheme } from '/src/hooks/ThemeContext';
import './ThemeToggle.scss';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="theme-toggle-container">
      <input
        id="theme-toggle"
        className="theme-toggle-checkbox"
        type="checkbox"
        checked={isDarkMode}
        onChange={toggleTheme}
        style={{ display: 'none' }}
      />
      <label htmlFor="theme-toggle" className="theme-toggle-label">
        <i className="sun fas fa-sun"></i>
        <i className="moon fas fa-moon"></i>
      </label>
    </div>
  );
};

export default ThemeToggle;
