import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">EZMall</a>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to='/'>Shop</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to='/my-orders'>My Orders</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;