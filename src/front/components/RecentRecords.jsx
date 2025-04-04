import React from "react";
import { Link } from "react-router-dom";

const RecentRecords = () => {
//Pendiente cargar dinamicamente cada elemento de la card con la BD

    return (
    <div className="card h-100">
        <div className="card-header bg-primary text-white">
            <h5 className="card-title mb-0">Registros Recientes</h5>
        </div>
        <div className="card-body">
            <div className="list-group">
                <Link
                    to="/records/blood-pressure"
                    className="list-group-item list-group-item-action d-flex align-items-center"
                >
                    <i className="fas fa-heart me-3 text-danger" style={{ fontSize: '18px' }}></i>
                    <div>
                        <h6 className="mb-1">Tensión Arterial</h6>
                        <p className="mb-0 text-muted small">Último registro: 120/80 mmHg (Hace 2 días)</p>
                    </div>
                </Link>
                <Link
                    to="/records/glucose"
                    className="list-group-item list-group-item-action d-flex align-items-center"
                >
                    <i className="fa-solid fa-syringe me-3 text-primary" style={{ fontSize: '18px' }}></i>
                    <div>
                        <h6 className="mb-1">Glucosa</h6>
                        <p className="mb-0 text-muted small">Último registro: 95 mg/dL (Hace 1 día)</p>
                    </div>
                </Link>
                <Link
                    to="/records/weight"
                    className="list-group-item list-group-item-action d-flex align-items-center"
                >
                    <i className="fas fa-weight me-3 text-success" style={{ fontSize: '18px' }}></i>
                    <div>
                        <h6 className="mb-1">Peso</h6>
                        <p className="mb-0 text-muted small">Último registro: 70 kg (Hace 1 semana)</p>
                    </div>
                </Link>
            </div>
        </div>
    </div>)
}
export default RecentRecords