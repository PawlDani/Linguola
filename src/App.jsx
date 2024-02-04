import React, { useState } from 'react';
import LeftSidebar from './components/common/LeftSidebar/LeftSidebarComponent';
import MainContent from './components/MainContent/MainContentComponent';
import RightSidebar from './components/common/RightSidebar/RightSidebarComponent';

// activeTab oraz setActiveTab to propsy, ktore zostana przekazane do komponentu Sidebar
const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard'); // domyslna zakladka to Dashboard

  // Komponent App zawiera wszystkie komponenty, ktore beda wyswietlane na stronie
  return (
    <div className="App">
      <div className="app-body">
        <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <MainContent activeTab={activeTab} />
        <RightSidebar />
        {/* Wiecej komponentow bede dodawal tutaj */}
      </div>
    </div>
  );
};

export default App;
