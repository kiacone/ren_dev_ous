import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/img/rdv_logo.png'
const Header = () => (
  
  <header>
    <nav>
      <div className="container">
        <Link to="/">
        <img
            alt="..."
            src={logo}
            // className={navImageClasses}
          />
        </Link> 
        <span> | </span>
        <Link to="/signin">Sign In</Link>
      </div>
    </nav>    
  </header>

);

export default Header;