import React from 'react';
import { Link } from 'react-router-dom';
import Logout from "../../components/Logout";

const DashboardNav = () => (
  
  <header>
    <nav>
    <div className="container">
    <Link to="/dashboard">Home</Link> <span> | </span>
    <Link to="/dashboard/articles">Articles</Link> <span> | </span>
    <Link to="/dashboard/youtube">YouTube</Link><span> | </span>
    <Link to="/dashboard/books">Books</Link><span> | </span>
    <Link to="/dashboard/podcasts">Podcasts</Link>
    <Logout />
    {/* <span> | </span>
    <Link to="/logout">Logout</Link> */}
      </div>
    </nav>    
  </header>

);

export default DashboardNav;
