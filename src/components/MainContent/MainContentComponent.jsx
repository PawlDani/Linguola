import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '/src/components/Dashboard/DashboardComponent';
import Wordsets from '/src/components/Wordsets/WordsetsComponent';
import Progress from '/src/components/Progress/ProgressComponent';
import HowTo from '/src/components/HowTo/HowToComponent';
import './MainContent.scss';

const MainContent = () => {
  return (
    <div className="main-content">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/wordsets" element={<Wordsets />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/howto" element={<HowTo />} />
      </Routes>
    </div>
  );
};

export default MainContent;
