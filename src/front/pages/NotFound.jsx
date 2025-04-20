import React from "react"

const NotFound = () => {
    return (
      <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center">
        <div className="row justify-content-center text-center w-100">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="bg-white p-5 rounded-3 shadow">
              <div className="mb-4 text-danger">
                <i className="fas fa-heartbeat fa-4x pulse-animation"></i>
              </div>
  
              <h1 className="display-1 fw-bold text-danger">404</h1>
              <h2 className="mb-4 text-secondary">Página no encontrada</h2>
  
              <p className="mb-4 text-muted">
                Lo sentimos, la página que estás buscando no existe o ha sido movida. Por favor, regresa a la página
                principal para continuar monitoreando tu salud.
              </p>
  
              <div className="d-flex justify-content-center gap-3">
                <a href="/" className="btn btn-primary px-4 py-2">
                  <i className="fas fa-home me-2"></i>
                  Volver al inicio
                </a>
              </div>
  
              <div className="mt-5 pt-3 border-top">
                <p className="small text-muted">
                  <i className="fas fa-shield-alt me-2"></i>
                  Cuidamed - Tu salud, siempre contigo.
                </p>
              </div>
            </div>
          </div>
        </div>
  
        <style jsx>{`
          .pulse-animation {
            animation: pulse 1.5s infinite;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.95);
            }
            70% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(0.95);
            }
          }
        `}</style>
      </div>
    )
}

export default NotFound