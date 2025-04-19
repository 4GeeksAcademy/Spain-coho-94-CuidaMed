import React from 'react';

const FooterPrivate = () => {
    const currentYear = new Date().getFullYear();

    return (
        <>
            <footer className="w-100 py-4 bg-white border-top border-secondary-subtle">
                <div className="container">
                    <div className="row align-items-center justify-content-between">
                        <div className="col-md-4 mb-3 mb-md-0">
                            <div className="d-flex align-items-center mb-2">
                                <img 
                                    src="src/front/assets/img/LogoNavbar.png" 
                                    alt="CuidaMed"
                                    style={{height: '24px', width: 'auto', marginRight: '0.5rem'}} 
                                />
                                <span className="text-primary fw-semibold small">CuidaMed</span>
                            </div>
                            <p className="text-muted small mb-0">
                            © {currentYear} CuidaMed. Todos los derechos reservados.
                            </p>
                        </div>

                        <div className="col-md-4 text-md-end">
                            <h6 className="fw-bold text-dark small mb-2">Creadores</h6>
                            <ul className="list-unstyled small mb-0">
                                <li>
                                    <a href="https://github.com/MichPisani" target="_blank" rel="noopener noreferrer" className="text-muted text-decoration-none">MichPisani</a>
                                </li>
                                <li>
                                    <a href="https://github.com/Leodelis" target="_blank" rel="noopener noreferrer" className="text-muted text-decoration-none">Leodelis</a>
                                </li>
                                <li>
                                    <a href="https://github.com/InTheScencia" target="_blank" rel="noopener noreferrer" className="text-muted text-decoration-none">PipeBarros</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default FooterPrivate;