import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import './App.css';
import AboutPage from "./components/AboutPage/AboutPage";
import AppHeader from "./components/AppHeader/AppHeader";

const App = () => {
  return (
    <HashRouter>
      <div className="App">
        <AppHeader />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
        </Routes>
      </div>
    </HashRouter >
  )
};

export default App;