import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '/src/hooks/AuthProvider';
import './LeftSidebar.scss';
import maxLogo from '/src/assets/images/max-logo-colored.png';
import logoWhite from '/src/assets/images/logoWhite.png';
import { useTheme } from '/src/hooks/ThemeContext';

const LeftSidebar = () => {
  const { theme } = useTheme();
  const location = useLocation(); // Użycie hooka useLocation do pobrania aktualnej ścieżki
  const { user } = useAuth(); // Użycie hooka useAuth do pobrania informacji o zalogowanym użytkowniku

  // Definicja zakładek w pasku bocznym
  const tabs = [
    { name: 'Start', to: '/', iconClass: 'fa-solid fa-house' },
    { name: 'Ucz się', to: '/wordsets', iconClass: 'fa-solid fa-folder' },
    ...(user ? [{ name: 'Ulubione', to: '/favwordsets', iconClass: 'fa-solid fa-heart' }] : []),
    // { name: 'Postęp', to: '/progress', iconClass: 'fa-solid fa-bars-progress' },
    { name: 'Instrukcja', to: '/howto', iconClass: 'fa-solid fa-compass' },
  ];

  // Funkcja do określenia, czy zakładka powinna być aktywna
  const getNavLinkClass = (path) => {
    return location.pathname === path || (path === '/wordsets' && location.pathname.includes('/wordsets'))
      ? 'active'
      : '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar_top">
        <div className="sidebar_logo">
          <NavLink to="/">
            <img src={theme === 'dark' ? logoWhite : maxLogo} alt="logo" />
          </NavLink>
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
