import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles.css';
import './assets/fonts/VarelaRound.ttf';
import HomePage from './components/HomePage/HomePage';

function App() {
  return (
    <HashRouter>
      <div className='App'>
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
