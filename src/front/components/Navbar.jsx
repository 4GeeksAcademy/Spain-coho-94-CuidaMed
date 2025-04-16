import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light border-bottom">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src="src/front/assets/img/LogoNavbar.png"
            style={{ width: "150px" }}
          />
        </Link>

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

          <div className="ms-auto d-flex align-items-center gap-3">
            <Link
              to="/login"
              className="text-decoration-none"
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
