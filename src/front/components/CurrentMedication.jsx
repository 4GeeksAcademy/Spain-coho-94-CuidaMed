import React from "react";
import { Link } from "react-router-dom";

const CurrentMedication = ({currentMedication}) => {
    return (
        <div className="card h-100">
            <div className="card-header bg-danger text-white">
                <h5 className="card-title mb-0">Tratamiento actual</h5>
            </div>
            <div className="card-body">
                
                {currentMedication.length>0 ? 
                (<ul className="list-group list-group-flush">
                    {currentMedication.map((data)=>{
                        return (<li className="list-group-item">{`${data.medication_name} - ${data.dosage_instructions}`}</li>)
                    })}
                </ul>)
                    :
                    <span className="badge bg-secondary">No hay registros</span>
                }
            </div>
            <div className="card-footer bg-white">
              <Link href="/records/medication" className="btn btn-outline-primary">
                Ir a tratamientos
              </Link>
            </div>
        </div>)
}



export default CurrentMedication