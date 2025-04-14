import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light border-bottom">
      <div className="container">
        {/* Logo y marca */}
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src="src/front/assets/img/LogoNavbar.png"
            style={{ width: "150px" }}
          />
        </a>

        {/* Botón de colapso para móviles */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* Contenido colapsable */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Links de navegación */}
          <ul className="navbar-nav mx-auto mb-2 mb-md-0">
            <li className="nav-item">
              <a className="nav-link" href="#features">
                Boton1
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#how-it-works">
                Boton2
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#testimonials">
                Boton3
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">
                Boton4
              </a>
            </li>
          </ul>

          {/* Botones de acción */}
          <div className="d-flex align-items-center">
            <Link
              to="/login"
              className="text-decoration-none me-3 d-none d-md-block"
            >
              Accede
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
