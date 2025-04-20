import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import navicon from "/src/front/assets/img/LogoNavbar.png"

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
    <nav className="navbar navbar-light bg-light shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/dashboard" className="navbar-brand d-flex align-items-center m-0">
          <img src={navicon} alt="Logo" style={{ height: '40px' }} />
        </Link>

        <div className="dropdown">
          <button
            className="btn d-flex align-items-center"
            id="profileDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <div
              className="rounded-circle bg-light d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="fas fa-user" style={{ fontSize: '18px' }}></i>
            </div>
          </button>

          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            <li>
              <Link to="/profile" className="dropdown-item d-flex align-items-center">
                <i className="fas fa-user me-2"></i> Perfil
              </Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button
                className="dropdown-item d-flex align-items-center text-danger"
                onClick={logout}
              >
                <i className="fas fa-sign-out-alt me-2"></i> Cerrar sesión
              </button>
            </li>
          </ul>
        </div>

      </div>
    </nav>


  );
}

export default NavbarPrivate;
