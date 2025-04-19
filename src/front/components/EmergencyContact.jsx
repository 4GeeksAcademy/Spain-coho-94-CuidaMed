import React from "react";
import { Link } from "react-router-dom";
import EmergencyContactQR from "./QR";

const EmergencyContact = ({lastEmergencyContact}) => {
    
    return (
        <div className="card h-100">
            <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">Contacto de emergencia</h5>
            </div>
            <div className="card-body">

                {lastEmergencyContact  ?
                    <div className="d-flex flex-column align-items-center">
                        <h4>{`${lastEmergencyContact.first_name_contact} ${lastEmergencyContact.last_name_contact}`}</h4>
                        <div className="border border-primary border-3 rounded p-2 bg-white d-inline-block">
                            <EmergencyContactQR phoneContact={lastEmergencyContact.phone_contact} size={120}/>
                        </div>                
                    </div>

                    :
                    <span className="badge bg-secondary">No ha resgistrado ningún contacto</span>
                }
                
            </div>
        </div>
    )
}

export default EmergencyContact