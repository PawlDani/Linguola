import React from 'react';
import DashboardComponent from '/src/components/Dashboard/DashboardComponent';
import WordsetsComponent from '/src/components/Wordsets/WordsetsComponent';
import ProgressComponent from '/src/components/Progress/ProgressComponent';
import HowToComponent from '/src/components/HowTo/HowToComponent';
import '/src/styles/MainContent.scss';

const MainContent = ({ activeTab }) => {
  // renderowanie zawartosci glownej
  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <DashboardComponent />;
      case 'Wordsets':
        return <WordsetsComponent />;
      case 'Progress':
        return <ProgressComponent />;
      case 'HowTo':
        return <HowToComponent />;
      default:
        return <DashboardComponent />;
    }
  };

  return <div className="main-content">{renderContent()}</div>;
};

export default MainContent;
