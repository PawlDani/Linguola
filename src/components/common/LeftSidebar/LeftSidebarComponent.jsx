import React from 'react';
import { NavLink } from 'react-router-dom';
import maxLogo from '/src/assets/images/max-logo-colored.png'; // Ścieżka do logo

// Komponent paska bocznego
const LeftSidebar = () => {
  // Definicja zakładek w pasku bocznym
  const tabs = [
    { name: 'Dashboard', to: '/', iconClass: 'fa-solid fa-house' },
    { name: 'Wordsets', to: '/Wordsets', iconClass: 'fa-solid fa-folder' },
    { name: 'Progress', to: '/Progress', iconClass: 'fa-solid fa-bars-progress' },
    { name: 'How To', to: '/HowTo', iconClass: 'fa-solid fa-compass' },

    // Wiecej zakladek bede dodawal tutaj
  ];

  // Renderowanie paska bocznego
  return (
    <div className="sidebar">
      <div className="sidebar_top">
        <div className="sidebar_logo">
          <img src={maxLogo} alt="logo" />
        </div>
      </div>
      <div className="sidebar_bottom">
        <ul>
          {tabs.map((tab) => (
            <li key={tab.to}>
              <NavLink to={tab.to} className={({ isActive }) => (isActive ? 'active' : '')} end>
                <span className={`icon ${tab.iconClass}`}></span>
                <span className="title">{tab.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
