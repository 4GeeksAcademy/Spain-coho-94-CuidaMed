import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Hero Section */}
            <section className="position-relative overflow-hidden bg-light" style={{ minHeight: "70vh" }}>
                <div className="position-absolute top-0 start-0 w-100 h-100">
                    <img
                        src="src/front/assets/img/medical-enrollment-form-document-medicare-concept.jpeg"
                        alt="Medical form on desktop"
                        className="img-fluid w-100 h-100 object-fit-cover"
                        style={{ transform: "scale(1.1)", objectFit: "cover" }}
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-75"></div>
                </div>
                <div className="container position-relative z-1 d-flex align-items-center" style={{ minHeight: "70vh" }}>
                    <div className="row">
                        <div className="col-lg-6 bg-white bg-opacity-75 p-4 rounded">
                            <span className="badge bg-primary text-white mb-2">
                                Gestión segura de tu salud
                            </span>
                            <h1 className="display-5 fw-bold text-dark">
                                Tu historial médico, organizado y siempre accesible
                            </h1>
                            <p className="lead text-secondary">
                                Guarda y consulta tu información de salud de forma segura. Toma el
                                control de tu bienestar con nuestra plataforma gratuita de
                                gestión de salud.
                            </p>
                            <Link to="/register" className="btn btn-primary btn-lg mt-3">
                                Pruébalo gratis <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-5 bg-light">
                <div className="container text-center">
                    <span className="badge bg-primary text-white mb-2">
                        Funciones principales
                    </span>
                    <h2 className="fw-bold mb-3">
                        Todo lo que necesitas para cuidar tu salud
                    </h2>
                    <p className="text-muted mb-5">
                        Más que un registro, una visión clara de tu salud.
                    </p>

                    <div className="row g-4">
                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <i className="fas fa-clipboard-list fa-2x text-primary mb-3"></i>
                                    <h5 className="card-title">Historial de salud</h5>
                                    <p className="card-text">
                                        Toda tu salud, segura y centralizada. Guarda tus datos médicos en un solo lugar.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <i className="fas fa-chart-bar fa-2x text-primary mb-3"></i>
                                    <h5 className="card-title">Estadísticas</h5>
                                    <p className="card-text">
                                        Entiende tu salud con gráficos claros y detecta patrones importantes en el tiempo.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <i className="fas fa-qrcode fa-2x text-primary mb-3"></i>
                                    <h5 className="card-title">Contacto de emergencia con QR</h5>
                                    <p className="card-text">
                                        Contacta rápidamente con tu contacto de emergencia a través de un QR personalizado.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3">
                            <div className="card h-100">
                                <div className="card-body text-center">
                                    <i className="fas fa-file-alt fa-2x text-primary mb-3"></i>
                                    <h5 className="card-title">Galería de informes</h5>
                                    <p className="card-text">
                                        Guarda todos tus informes médicos en su solo lugar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-5 bg-white">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <span className="badge bg-primary text-white mb-2">Funcionamiento</span>
                            <h2 className="fw-bold mb-3">
                                Cómo funciona nuestra aplicación
                            </h2>
                            <p className="text-muted">
                                Con CuidaMed, gestionar tu salud es más fácil que nunca.
                            </p>
                            <ul className="list-unstyled">
                                <li className="d-flex align-items-start mb-3">
                                    <span className="badge bg-primary me-3">1</span>
                                    <div>
                                        <h5 className="mb-1">Crea tu cuenta</h5>
                                        <p className="text-muted mb-0">Configura tu perfil de salud en minutos.</p>
                                    </div>
                                </li>
                                <li className="d-flex align-items-start mb-3">
                                    <span className="badge bg-primary me-3">2</span>
                                    <div>
                                        <h5 className="mb-1">Completa tus registros</h5>
                                        <p className="text-muted mb-0">Introduce tus datos y antecedentes médicos.</p>
                                    </div>
                                </li>
                                <li className="d-flex align-items-start">
                                    <span className="badge bg-primary me-3">3</span>
                                    <div>
                                        <h5 className="mb-1">Seguimiento y análisis</h5>
                                        <p className="text-muted mb-0">Visualiza la evolución de tus datos de salud.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-6 text-center">
                            <div className="position-relative border rounded shadow-sm bg-white overflow-hidden">
                                {/* Ventana simulada tipo Mac */}
                                <div
                                    className="position-absolute top-0 start-0 end-0 bg-secondary bg-opacity-75 px-3 d-flex align-items-center"
                                    style={{ height: "2rem", zIndex: 1 }}
                                >
                                    <div className="d-flex gap-2">
                                        <div className="rounded-circle bg-danger" style={{ width: "0.5rem", height: "0.5rem" }}></div>
                                        <div className="rounded-circle bg-warning" style={{ width: "0.5rem", height: "0.5rem" }}></div>
                                        <div className="rounded-circle bg-success" style={{ width: "0.5rem", height: "0.5rem" }}></div>
                                    </div>
                                </div>

                                <img
                                    src="src/front/assets/img/medical-enrollment-form-document-medicare-concept.jpeg"
                                    alt="HealthTrack app demo"
                                    className="img-fluid rounded-top"
                                    style={{ marginTop: "2rem" }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default LandingPage