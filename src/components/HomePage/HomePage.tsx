import React from 'react';
import { Link } from 'react-router-dom';
import rca_logo from '../../assets/rca_logo.png';
import './HomePage.css';
import { motion } from 'framer-motion';

const homeButtons = new Map([
  ['Add Group Sessions', '/add-session'],
  ['Edit Group Sessions', '/edit-sessions'],
  ['Create Report', '/create-report'],
  ['About', '/about'],
])

const HomePage = () => {

  const quit = (ev: React.MouseEvent) => {
    ev.preventDefault();
    window.postMessage('quitApp');
  };

  return (
    <div className="HomePage">
      <h1>Peer Support Participant Tracker</h1>
      {Array.from(homeButtons.entries())
        .map(([buttonName, buttonLink], index) => (
          <Link
            key={index}
            className='button home-page-button'
            to={buttonLink}
          >
            {buttonName}
          </Link>
        ))
      }
      <button
        className='home-page-button'
        onClick={quit}
      >
        Quit
      </button>
      <img src={rca_logo} alt='' />
    </div>
  );
};

export default HomePage;
