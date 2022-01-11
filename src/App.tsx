import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import './App.css';

const App = () => {
  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path='/' element={<HomePage />} />
        </Routes>
      </div>
    </HashRouter>
  )
};

export default App;