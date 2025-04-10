import React from "react";
import { Link } from "react-router-dom";

const CurrentMedication = () => {
    return (
        <div className="card h-100">
            <div className="card-header bg-danger text-white">
                <h5 className="card-title mb-0">Tratamiento actual</h5>
            </div>
            <div className="card-body">
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">Paracetamol - 500mg - 2 veces al día</li>
                    <li className="list-group-item">Vitamina D - diaria</li>
                    <li className="list-group-item text-muted">Sin reacciones adversas registradas</li>
                </ul>
            </div>
            <div className="card-footer bg-white">
              <Link href="/records/medication" className="btn btn-outline-primary">
                Ir a tratamientos
              </Link>
            </div>
        </div>)
}



export default CurrentMedication