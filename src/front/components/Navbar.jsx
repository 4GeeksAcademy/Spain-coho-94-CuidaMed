import { Link } from "react-router-dom";
import navicon from "/src/front/assets/img/LogoNavbar.png"

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light border-bottom">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={navicon}
            style={{ width: "150px" }}
          />
        </Link>
        
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
    </nav>
  );
};
