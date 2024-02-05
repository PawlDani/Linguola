import React, { useState } from 'react';
import LeftSidebar from './components/common/LeftSidebar/LeftSidebarComponent';
import MainContent from './components/MainContent/MainContentComponent';
import RightSidebar from './components/common/RightSidebar/RightSidebarComponent';

// activeTab oraz setActiveTab to propsy, ktore zostana przekazane do komponentu Sidebar
const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard'); // domyslna zakladka to Dashboard
  const [activeWordSet, setActiveWordSet] = useState(null); // domyslnie nie ma wybranego zestawu slow

  // Komponent App zawiera wszystkie komponenty, ktore beda wyswietlane na stronie
  return (
    <div className="App">
      <div className="app-body">
        {/* LeftSidebar ma activeTab oraz setActiveTab jako propsy, ktore zostana przekazane do komponentu Sidebar */}
        <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* MainContent ma activeTab oraz activeWordset i setActiveWordSet jako propsy, ktore zostana przekazane do komponentu MainContent
         */}
        <MainContent activeTab={activeTab} activeWordSet={activeWordSet} setActiveWordSet={setActiveWordSet} />
        <RightSidebar />
        {/* Wiecej komponentow bede dodawal tutaj */}
      </div>
    </div>
  );
};

export default App;
