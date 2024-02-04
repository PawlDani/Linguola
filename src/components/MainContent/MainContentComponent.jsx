import React from 'react';
import Dashboard from '/src/components/Dashboard/DashboardComponent';
import Wordsets from '/src/components/Wordsets/WordsetsComponent';
import Progress from '/src/components/Progress/ProgressComponent';
import HowTo from '/src/components/HowTo/HowToComponent';
import '/src/styles/MainContent.scss';

const MainContent = ({ activeTab }) => {
  // renderowanie zawartosci glownej
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Wordsets':
        return <Wordsets />;
      case 'Progress':
        return <Progress />;
      case 'HowTo':
        return <HowTo />;
      default:
        return <Dashboard />;
    }
  };

  return <div className="main-content">{renderContent()}</div>;
};

export default MainContent;
