import React from 'react';
import { Link, Route } from 'react-router-dom';

const Navbar = (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">EZMall</a>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link className="nav-link" to='/home'>Shop</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to='/my-orders'>My Orders</Link>
          </li>
          <li className="nav-item">
            <Route render={({history}) => (
              <button
                type='button'
                className="nav-link"
                onClick={() => {
                  axios.post('http://localhost:8000/api/auth/logout')
                    .then(_ => {
                      setIsLoggedIn(false);
                      props.refresh();
                      history.push('/')
                    })
                }}
              >
                Logout
              </button>
            )} />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;