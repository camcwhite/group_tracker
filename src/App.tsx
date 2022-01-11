import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import './styles.css';
import './assets/fonts/VarelaRound.ttf';
import HomePage from './components/HomePage/HomePage';

function App() {
  return (
    <BrowserRouter>
      <div className='App'>
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
