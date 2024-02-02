import React, { useState } from 'react';
import Header from './components/common/Header/Header';
import Sidebar from './components/common/Sidebar/Sidebar';

// activeTab oraz setActiveTab to propsy, ktore zostana przekazane do komponentu Sidebar
const App = () => {
  const [activeTab, setActiveTab] = useState('Dashboard'); // domyslna zakladka to Dashboard

  // Komponent App zawiera wszystkie komponenty, ktore beda wyswietlane na stronie
  return (
    <div className="App">
      <Header />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* Wiecej komponentow bede dodawal tutaj */}
    </div>
  );
};

export default App;
