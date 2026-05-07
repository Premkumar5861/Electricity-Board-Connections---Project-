import React from "react";
import { Link } from "react-router-dom";  

function Header() {
  const isLoggedIn = localStorage.getItem('userdata');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">

        <Link to="/" className="navbar-brand">Electricity Board</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarColor01">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/StatisticsCollection" className="nav-link">
                Dashboard Statistics
              </Link>
            </li>
            {isLoggedIn ? (
              <li className="nav-item">
                <Link to="/logout" className="nav-link">Logout</Link>
              </li>
            ) : (
              <li className="nav-item">  
                <Link to="/login" className="nav-link">Login</Link>
              </li>
            )}
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Header;