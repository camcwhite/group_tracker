import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AppHeader.css';

const AppHeader = () => {
  const location = useLocation();

  if (location.pathname === '/') {
    return null;
  }

  return (
    <div className="AppHeader">
      <Link to='/' className='button'>
        Back to Menu
      </Link>
    </div>
  );
};

export default AppHeader;
