import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import View from './pages/View';
import Selector from './pages/Selector';

export default function App() {
  
  return (
    console.log('App component rendered'),
    <Router>
      <Routes>
        <Route path="/" element={<Selector />} />
        <Route path="/view" element={<View />} />
      </Routes>
    </Router>
  );
}
