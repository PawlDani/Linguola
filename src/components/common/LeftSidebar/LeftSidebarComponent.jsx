import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Import useLocation
import './LeftSidebar.scss';
import maxLogo from '/src/assets/images/max-logo-colored.png'; // Ścieżka do logo

// Komponent paska bocznego
const LeftSidebar = () => {
  const location = useLocation(); // Użycie hooka useLocation do pobrania aktualnej ścieżki

  // Definicja zakładek w pasku bocznym
  const tabs = [
    { name: 'Start', to: '/', iconClass: 'fa-solid fa-house' },
    { name: 'Ucz się', to: '/wordsets', iconClass: 'fa-solid fa-folder' }, // Poprawiona ścieżka na małe litery
    { name: 'Postęp', to: '/progress', iconClass: 'fa-solid fa-bars-progress' },
    { name: 'Instrukcja', to: '/howto', iconClass: 'fa-solid fa-compass' },
    // Wiecej zakladek bede dodawal tutaj
  ];

  // Funkcja do określenia, czy zakładka powinna być aktywna
  const getNavLinkClass = (path) => {
    return location.pathname === path || (path === '/wordsets' && location.pathname.includes('/wordsets'))
      ? 'active'
      : ''; // Sprawdzenie czy ścieżka zawiera '/wordsets'
  };

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
              <NavLink
                to={tab.to}
                className={() => getNavLinkClass(tab.to)} // Użycie funkcji do określenia klasy
                end
              >
                <span className={`icon ${tab.iconClass}`}></span> {/* Ikona */}
                <span className="title">{tab.name}</span> {/* Nazwa zakładki */}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeftSidebar;
