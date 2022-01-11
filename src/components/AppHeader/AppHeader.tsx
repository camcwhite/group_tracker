import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AppHeader.css';
import { motion } from 'framer-motion';

const AppHeader = () => {
  const location = useLocation();

  return (
    <div className="AppHeader">
      <Link to='/' className='button'>
        Back to Menu
      </Link>
    </div>
  );
};

export default AppHeader;
