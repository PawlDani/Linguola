import React from 'react';
import LeftSidebar from './components/common/LeftSidebar/LeftSidebarComponent';
import MainContent from './components/MainContent/MainContentComponent';
import RightSidebar from './components/common/RightSidebar/RightSidebarComponent';

const App = () => {
  return (
    <div className="App">
      <div className="app-body">
        <LeftSidebar />
        <MainContent />
        <RightSidebar />
      </div>
    </div>
  );
};

export default App;
