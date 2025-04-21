import React, { useState, useEffect } from "react";
import EmergencyContactQR from "../components/QR";


const EmergencyContact = () => {
    const [formData, setFormData] = useState({
        firstNameContact: "",
        lastNameContact: "",
        relationshipType:"",
        phoneContact:"",
        emailContact: "",
    })

    const [emergencyContact, setEmergencyContact] = useState({
        firstNameContact: "",
        lastNameContact: "",
        relationshipType:"",
        phoneContact:"",
        emailContact: "",
    })
    const [error, setError] = useState({
        form: "",
        list: "",
        firstNameContact: "",
        lastNameContact: "",
        relationshipType:"",
        phoneContact:"",
        emailContact: "",
    });
    const [loading, setLoading] = useState(true);
    const [buttonLabel, setButtonLabel] = useState("Añadir contacto")
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const accessToken = localStorage.getItem("accessToken");
    

    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                
                const response = await fetch(`${backendUrl}/api/records/emergency_contact`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`
                        }
                    });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Error al obtener su contacto de emergencia")
                }

                setEmergencyContact({
                    firstNameContact: data.first_name_contact,
                    lastNameContact: data.last_name_contact,
                    relationshipType:data.relationship_type,
                    phoneContact:data.phone_contact,
                    emailContact: data.email_contact
                })

                setFormData({
                    firstNameContact: data.first_name_contact,
                    lastNameContact: data.last_name_contact,
                    relationshipType:data.relationship_type,
                    phoneContact:data.phone_contact,
                    emailContact: data.email_contact                  
                })
                setButtonLabel("Modificar contacto")
            } catch (error) {
                setError({...error, list: error.message })
            }
        }
        fetchRecordData()
    }, [])


    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }
        const emailRegex = /\S+@\S+\.\S+/


        if (!formData.firstNameContact) {
            newErrors.firstNameContact = "Por favor, introduzca un nombre"
            valid = false
        }else if(formData.firstNameContact.length>100){
            newErrors.firstNameContact = "El valor máximo de caracteres es 100"
        }

        if (!formData.lastNameContact) {
            newErrors.firstNameContact = "Por favor, introduzca un apellido"
            valid = false
        }else if(formData.lastNameContact.length>100){
            newErrors.lastNameContact = "El valor máximo de caracteres es 100"
        }

        if (!formData.relationshipType) {
            newErrors.relationshipType = "Por favor, introduzca la relación de parentesco"
            valid = false
        }else if(formData.relationshipType.length>50){
            newErrors.relationshipType = "El valor máximo de caracteres es 50"
        }

        if (!formData.phoneContact) {
            newErrors.phoneContact = "Por favor, introduzca un número de teléfono";
            valid = false
          } else {
            const cleanPhone = formData.phoneContact.replace(/\s/g, ''); // Esta línea elimina espacios para la validación
            if (!cleanPhone.startsWith("+")) {
              newErrors.phoneContact = "El número debe comenzar con '+' (Ejemplo: +34222331144)";
              valid = false
            } else if (!/^\+\d{11}$/.test(cleanPhone)) {
              newErrors.phoneContact = "El número debe tener 12 caracteres (Ejemplo: +34XXXXXXXXX)";
              valid = false
            }
          }

        if (!formData.emailContact) {
            newErrors.emailContact = "Por favor, introduzca el email"
            valid = false
        }else if(formData.emailContact.length > 100) {
            newErrors.emailContact = "El valor máximo de caracteres es 100" //Actualizar con el valor máximo en la BD
            valid = false
        }else if (!emailRegex.test(formData.emailContact)) {
            newErrors.emailContact = "Por favor, introduzca un email válido"
            valid = false
        }
        setError(newErrors)
        return valid
    }
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Para borrar los errores al corregir el campo
        if (error[name]) {
            setError((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return
        }
        setLoading(true);

        try {
            
            const response = await fetch(`${backendUrl}/api/records/emergency_contact`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(
                    {
                        'first_name_contact': formData.firstNameContact,
                        'last_name_contact': formData.lastNameContact,
                        'relationship_type': formData.relationshipType,
                        'phone_contact': formData.phoneContact,
                        'email_contact': formData.emailContact
                    }
                ) 
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al crear el registro");
            }
            
            setEmergencyContact(
                {
                    firstNameContact: data.contact.first_name_contact,
                    lastNameContact: data.contact.last_name_contact,
                    relationshipType:data.contact.relationship_type,
                    phoneContact:data.contact.phone_contact,
                    emailContact: data.contact.email_contact
                }) 

        } catch (error) {
            setError({...error, form: error.message })
        } finally {
            setLoading(false)
            setButtonLabel("Modificar contacto")
        }
    }



    const handleDelete = async () => {
        try {
            const response = await fetch( `${backendUrl}/api/records/emergency_contact`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            )
            if (!response.ok) throw new Error("Error al eliminar el registro");
            
            setEmergencyContact({
                firstNameContact: "",
                lastNameContact: "",
                relationshipType:"",
                phoneContact:"",
                emailContact: "",
            })
            
        } catch (error) {
            setError({...error, list: error.message })
        }

    }
    return (
        <>
            <div className="row justify-content-center g-4 mt-2">
                <div className="col-md-4">
                    
                    <div className="card ms-2 ">
                        <h5 className="card-header bg-primary text-white">Añade un nuevo registro</h5>
                        <div className="card-body">
                            <h5 className="card-title">Contacto de emergencia</h5>
                            {error.form && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    {error.form}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="row mb-3">
                                    
                                    <div className="mb-3 col-6">
                                        <label htmlFor="firstNameContact" className="form-label">Nombre</label>
                                        <input
                                            type="text"
                                            className={`form-control ${error.firstNameContact ? 'is-invalid' : ''}`}
                                            id="firstNameContact"
                                            name="firstNameContact"
                                            aria-describedby="firstNameContact"
                                            value={formData.firstNameContact}
                                            onChange={handleChange}
                                        />
                                        {error.firstNameContact && <div className="invalid-feedback">{error.firstNameContact}</div>}
                                    </div>
                                    
                                    <div className="mb-3 col-6">
                                        <label htmlFor="lastNameContact" className="form-label">Apellido</label>
                                        <input
                                            type="text"
                                            className={`form-control ${error.lastNameContact ? 'is-invalid' : ''}`}
                                            id="lastNameContact"
                                            name="lastNameContact"
                                            aria-describedby="lastNameContact"
                                            value={formData.lastNameContact}
                                            onChange={handleChange}
                                        />
                                        {error.lastNameContact && <div className="invalid-feedback">{error.lastNameContact}</div>}
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <div className="mb-3 col-6">
                                        <label htmlFor="relationshipType" className="form-label">Tipo de relación</label>
                                        <input
                                            type="text"
                                            className={`form-control ${error.relationshipType ? 'is-invalid' : ''}`}
                                            id="relationshipType"
                                            name="relationshipType"
                                            aria-describedby="relationshipType"
                                            value={formData.relationshipType}
                                            onChange={handleChange}
                                            placeholder="Madre"
                                        />
                                        {error.relationshipType && <div className="invalid-feedback">{error.relationshipType}</div>}
                                    </div>
                               
                                    <div className="mb-3 col-6">
                                        <label htmlFor="phoneContact" className="form-label">Teléfono de contacto</label>
                                        <input
                                            type="text"
                                            className={`form-control ${error.phoneContact ? 'is-invalid' : ''}`}
                                            id="phoneContact"
                                            name="phoneContact"
                                            aria-describedby="phoneContact"
                                            value={formData.phoneContact}
                                            onChange={handleChange}
                                            placeholder="+34123456789"
                                        />
                                        {error.phoneContact && <div className="invalid-feedback">{error.phoneContact}</div>}
                                    </div>
                                </div>
                                
                                
                                <div className="mb-3">
                                    <label htmlFor="emailContact" className="form-label">Email</label>
                                    <input
                                        className={`form-control ${error.emailContact ? 'is-invalid' : ''}`}
                                        id="emailContact"
                                        name="emailContact"
                                        value={formData.emailContact}
                                        onChange={handleChange}
                                        placeholder="ejemplo@email.com"
                                    />
                                    {error.emailContact && <div className="invalid-feedback">{error.emailContact}</div>}
                                </div>
                                <div className="d-flex w-100 justify-content-end">
                                    <button type="submit" className="btn btn-primary">{buttonLabel}</button>  
                                </div>
                                
                            </form>

                        </div>
                    </div>

                </div>
                <div className="col-md-4 ms-3">
                    <div className="card me-2 h-100">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h5 className="m-0">Contacto de emegencia</h5>
                            <button 
                                type="button" 
                                className="btn text-white p-0"
                                onClick={handleDelete}
                            >
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>

                        <div className="card-body p-4">
                            {emergencyContact.firstNameContact === "" && <p>No se ha encontrado ningún contacto</p>}
                            {emergencyContact.firstNameContact !== "" &&
                                (
                                    <>
                                        <div className="text-center mb-4">
                                            <h3 className="fw-bold">{`${emergencyContact.firstNameContact} ${emergencyContact.lastNameContact}`}</h3>
                                            <div className="text-muted small">
                                            <i className="fas fa-phone me-1"></i>
                                            <span>{emergencyContact.phoneContact}</span>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-column align-items-center">
                                            <div className="border border-primary border-3 rounded p-2 bg-white">
                                            <EmergencyContactQR phoneContact={emergencyContact.phoneContact} size={180}/>
                                            </div>

                                            <div className="mt-3 bg-light p-3 rounded text-center" style={{ maxWidth: "320px" }}>
                                            <div className="text-primary fw-medium mb-1">
                                                <i className="fas fa-info-circle me-1"></i>
                                                <span>Información del código QR</span>
                                            </div>
                                            <p className="text-secondary small mb-0">
                                                Este código QR contiene el número de teléfono de contacto de emergencia. Escanéalo para llamar
                                                rápidamente en caso de emergencia.
                                            </p>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-center align-items-center gap-2 text-muted mt-4 pt-3 border-top">
                                            <i className="fas fa-envelope"></i>
                                            <span>Email: {emergencyContact.emailContact}</span>
                                        </div>
                                    </>
                                )
                            }  
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default EmergencyContact