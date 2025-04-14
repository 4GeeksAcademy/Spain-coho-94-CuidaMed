import React from "react";
import { Link } from "react-router-dom";

const EmergencyContact = ({lastEmergencyContact}) => {
    return (
        <div className="card h-100">
            <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">Contacto de emergencia</h5>
            </div>
            <div className="card-body">

                {lastEmergencyContact && lastEmergencyContact.first_name_contact ?
                    <div className="d-flex justify-content-center">
                        <h2>{`${lastEmergencyContact.first_name_contact} ${lastEmergencyContact.last_name_contact}`}</h2>
                        <p>{`Teléfono: ${lastEmergencyContact.phone_contact}`}</p>
                        <p>{`Email: ${lastEmergencyContact.email_contact}`}</p>
                    </div>
                    :
                    <span className="badge bg-secondary">No ha resgistrado ningún contacto</span>
                }
                
            </div>
        </div>
    )
}

export default EmergencyContact