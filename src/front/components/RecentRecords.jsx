import React from "react";
import { Link } from "react-router-dom";

const RecentRecords = ({lastBloodPressure, lastGlucose, lastWeight}) => {


    return (
    <div className="card h-100">
        <div className="card-header bg-primary text-white">
            <h5 className="card-title mb-0">Registros Recientes</h5>
        </div>
        <div className="card-body">
            <div className="list-group">
                <Link
                    to="/records/bloodpressure"
                    className="list-group-item list-group-item-action d-flex align-items-center"
                >
                    <i className="fas fa-heart me-3 text-danger" style={{ fontSize: '18px' }}></i>
                    <div className="w-100">
                        <h6 className="mb-1">Tensión Arterial</h6>
                        {lastBloodPressure && lastBloodPressure.systolic ? 
                            <div className="d-flex justify-content-between">
                                <span className="mb-0 text-muted small">{`Último registro: ${lastBloodPressure.systolic}/${lastBloodPressure.diastolic} mmHg`}</span>
                                <span className="mb-0 text-muted small">{`Fecha: ${lastBloodPressure.manual_datetime}`}</span>
                            </div>
                            :
                            <span className="badge bg-secondary">No hay registros</span>
    
                        }
                    </div>
                </Link>
                <Link
                    to="/records/glucose"
                    className="list-group-item list-group-item-action d-flex align-items-center"
                >
                    <i className="fa-solid fa-syringe me-3 text-primary" style={{ fontSize: '18px' }}></i>
                    <div className="w-100">
                        <h6 className="mb-1">Glucosa</h6>
                        { lastGlucose && lastGlucose.glucose ?
                            <div className="d-flex justify-content-between">
                                <span className="mb-0 text-muted small">{`Último registro: ${lastGlucose.glucose} mg/dL`}</span>
                                <span className="mb-0 text-muted small">{`Fecha: ${lastGlucose.manual_datetime}`}</span> 
                            </div>
                            :
                            <span className="badge bg-secondary">No hay registros</span>
                        }

                    </div>
                </Link>
                <Link
                    to="/records/weight"
                    className="list-group-item list-group-item-action d-flex align-items-center"
                >
                    <i className="fas fa-weight me-3 text-success" style={{ fontSize: '18px' }}></i>
                    <div className="w-100">
                        <h6 className="mb-1">Peso</h6>
                        { lastWeight && lastWeight.weight?
                            <div className="d-flex justify-content-between">
                                <span className="mb-0 text-muted small">{`Último registro: ${lastWeight.weight} kg`}</span>
                                <span className="mb-0 text-muted small">{`Fecha: ${lastWeight.manual_datetime}`}</span>                             
                            </div>
                            :
                            <span className="badge bg-secondary">No hay registros</span>
                        }

                    </div>
                </Link>
            </div>
        </div>
    </div>)
}
export default RecentRecords