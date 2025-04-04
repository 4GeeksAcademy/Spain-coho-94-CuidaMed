import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Submenu = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
<div className="bg-primary py-2 border-bottom">
      <div className="container">
        {/* Botón hamburguesa solo visible en móviles */}
        <div className="d-md-none text-start">
          <button
            className="btn btn-cuidamed mb-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i className="fa-solid fa-bars"></i> Menú
          </button>
        </div>

        
        <div className={`d-flex flex-wrap ${isMobileMenuOpen ? '' : 'd-none d-md-flex'}`}>
        
          <div className="dropdown me-3 mb-2 mb-md-0">
            <button
              className="btn btn-cuidamed dropdown-toggle d-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <i className="fa-solid fa-file-lines me-2"></i>
              Registros
            </button>
            <ul className="dropdown-menu">
              <li><Link to="/records/blood-pressure" className="dropdown-item"><i className="fa-solid fa-heart me-2"></i> Tensión arterial</Link></li>
              <li><Link to="/records/pulse" className="dropdown-item"><i className="fa-solid fa-heart-pulse me-2"></i> Pulso</Link></li>
              <li><Link to="/records/glucose" className="dropdown-item"><i className="fa-solid fa-syringe me-2"></i> Glucosa</Link></li>
              <li><Link to="/records/weight" className="dropdown-item"><i className="fa-solid fa-weight-scale me-2"></i> Peso</Link></li>
              <li><Link to="/records/height" className="dropdown-item"><i className="fa-solid fa-ruler-vertical me-2"></i> Altura</Link></li>
              <li><Link to="/records/allergies" className="dropdown-item"><i className="fa-solid fa-triangle-exclamation me-2"></i> Alergias</Link></li>
              <li><Link to="/records/family-history" className="dropdown-item"><i className="fa-solid fa-users me-2"></i> Antecedentes familiares</Link></li>
              <li><Link to="/records/personal-history" className="dropdown-item"><i className="fa-solid fa-user me-2"></i> Antecedentes personales</Link></li>
              <li><Link to="/records/treatments" className="dropdown-item"><i className="fa-solid fa-pills me-2"></i> Tratamientos</Link></li>
            </ul>
          </div>

          {/* Estadísticas Dropdown */}
          <div className="dropdown me-3 mb-2 mb-md-0">
            <button
              className="btn btn-cuidamed dropdown-toggle d-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <i className="fa-solid fa-chart-line me-2"></i>
              Estadísticas
            </button>
            <ul className="dropdown-menu">
              <li><Link to="/statistics/blood-pressure" className="dropdown-item"><i className="fa-solid fa-heart me-2"></i> Tensión arterial</Link></li>
              <li><Link to="/statistics/pulse" className="dropdown-item"><i className="fa-solid fa-heart-pulse me-2"></i> Pulso</Link></li>
              <li><Link to="/statistics/glucose" className="dropdown-item"><i className="fa-solid fa-syringe me-2"></i> Glucosa</Link></li>
              <li><Link to="/statistics/weight" className="dropdown-item"><i className="fa-solid fa-weight-scale me-2"></i> Peso</Link></li>
            </ul>
          </div>

          {/* Contacto de Emergencias */}
          <Link
            to="/emergency-contacts"
            className="btn btn-cuidamed d-flex align-items-center me-3 mb-2 mb-md-0"
          >
            <i className="fa-solid fa-phone me-2"></i>
            Contacto emergencias
          </Link>

          {/* Galería */}
          <Link
            to="/gallery"
            className="btn btn-cuidamed d-flex align-items-center mb-2 mb-md-0"
          >
            <i className="fa-solid fa-image me-2"></i>
            Galería
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Submenu;