import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-100 py-4 bg-light">
      <div className="container">
        <div className="row align-items-center justify-content-between">
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-2">
              <img
                src="src/front/assets/img/LogoNavbar.png"
                alt="CuidaMed"
                style={{ height: '32px', width: 'auto', marginRight: '0.5rem' }}
              />
              <span className="text-primary fw-semibold">CuidaMed</span>
            </div>
            <p className="text-muted small mb-0">
              © {currentYear} CuidaMed. Todos los derechos reservados.
            </p>
          </div>

          <div className="col-md-auto ms-auto me-5">
            <div className="row">
              <div className="col-12 col-md-6 mb-3">
                <h6 className="fw-bold text-dark">Desarrolladores</h6>
                <ul className="list-unstyled small ms-3">
                  <li>
					<a href="https://github.com/MichPisani" target="_blank" rel="noopener noreferrer" className="text-muted text-decoration-none">
					MichPisani 
					</a>
				  </li>
                  <li>
					<a href="https://github.com/Leodelis" target="_blank" rel="noopener noreferrer" className="text-muted text-decoration-none">
					Leodelis
					</a>
				  </li>
				  <li>
					<a href="https://github.com/InTheScencia" target="_blank" rel="noopener noreferrer" className="text-muted text-decoration-none">
					PipeBarros
					</a>
				  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        <div className="row align-items-center justify-content-between">
          <div className="col-md-8 mb-3 mb-md-0">
            <p className="text-muted small mb-0">
              Gestión segura de tu salud. Toma el control de tu bienestar con nuestra plataforma.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
