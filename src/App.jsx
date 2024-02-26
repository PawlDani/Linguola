import React, { useState, useEffect } from 'react';
import LeftSidebar from './components/common/LeftSidebar/LeftSidebarComponent';
import MainContent from './components/MainContent/MainContentComponent';
import RightSidebar from './components/common/RightSidebar/RightSidebarComponent';

const App = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1023) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <h1>We are sorry, but this application is currently only supported on desktop devices.</h1>
      </div>
    );
  }

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
