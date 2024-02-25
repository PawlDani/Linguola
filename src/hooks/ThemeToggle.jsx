// ThemeToggle.jsx
import React from 'react';
import { useTheme } from '/src/hooks/ThemeContext'; // Adjust path as needed
import './ThemeToggle.scss'; // Ensure this file exists with appropriate styles

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
        style={{ display: 'none' }} // Keep the checkbox hidden; the label acts as the toggle
      />
      <label htmlFor="theme-toggle" className="theme-toggle-label">
        <i className="sun fas fa-sun"></i> {/* Font Awesome Sun Icon */}
        <i className="moon fas fa-moon"></i> {/* Font Awesome Moon Icon */}
      </label>
    </div>
  );
};

export default ThemeToggle;
