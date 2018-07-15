import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
  
  <header>
    <nav>
      <div className="container">
        <Link to="/">Home</Link> <span> | </span>
        <Link to="/signin">Sign In</Link>
      </div>
    </nav>    
  </header>

);

export default Header;
