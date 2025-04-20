import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {navicon} from "/src/front/assets/img/LogoNavbar.png"

function NavbarPrivate() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");  
    navigate("/login");  
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm ">
      <div className="container">
        <Link to="/dashboard" className="navbar-brand d-flex align-items-center">
          <img src={navicon} className="w-25"/>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="profileDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                onClick={toggleProfileDropdown}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle bg-light d-flex align-items-center justify-content-center me-2"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <i className="fas fa-user" style={{ fontSize: '18px' }}></i>
                  </div>
                  <span className="d-none d-md-inline">Mi Perfil</span>
                </div>
              </a>
              <ul
                className={`dropdown-menu dropdown-menu-end ${showProfileDropdown ? 'show' : ''}`}
                aria-labelledby="profileDropdown"
              >
                <li>
                  <Link to="/profile" className="dropdown-item d-flex align-items-center">
                    <i className="fas fa-user me-2" style={{ fontSize: '16px' }}></i>
                    <span>Perfil</span>
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button 
                    className="dropdown-item d-flex align-items-center text-danger"
                    onClick={logout}
                    >
                    <i className="fas fa-sign-out-alt me-2" style={{ fontSize: '16px' }}></i>
                    <span>Cerrar sesión</span>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavbarPrivate;
