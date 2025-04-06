import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import EmergencyContactQR from "../components/QR";


const EmergencyContact = () => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        firstNameContact: "",
        lastNameContact: "",
        relationshipType:"",
        phoneContact:"",
        emailContact: "",
    })

    const [emergencyContact, setEmergencyContact] = useState([
        {
            id:1,
            firstNameContact: "Lucía",
            lastNameContact: "Pérez",
            relationshipType: "Madre",
            phoneContact: "+34650111222",
            emailContact: "lucia.perez@example.com"
        },
        {
            id:2,
            firstNameContact: "Carlos",
            lastNameContact: "Martínez",
            relationshipType: "Pareja",
            phoneContact: "+34659988777",
            emailContact: "carlos.martinez@example.com"
        },
        {
            id:3,
            firstNameContact: "Andrea",
            lastNameContact: "Gómez",
            relationshipType: "Hermana",
            phoneContact: "+34661122334",
            emailContact: "andrea.gomez@example.com"
        }
       
    ])
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
    const [currentPage, setCurrentPage] = useState(1);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                
                const response = await fetch(/* URL*/"",
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            // Enviamos el token a BD en el header.
                            "Authorization": `Bearer ${store.token}`
                        }
                    });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Error al obtener su contacto de emergencia")
                }

                setEmergencyContact(/* data.loquesea */)

            } catch (error) {
                setError(...error, { list: error.message })
            }
        }
    }, [])


    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }
        const phoneRegex = /^(\+34\s)?\d{3}-\d{3}-\d{3}$/;
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
            newErrors.phoneContact = "Por favor, introduzca un número de teléfono"
            valid = false
        }else if(formData.phoneContact.length>20){
            newErrors.phoneContact = "El valor máximo de caracteres es 20"
            valid = false
        }else if (!phoneRegex.test(formData.phoneContact)){

            newErrors.phoneContact = "Formato incorrecto, por favor use 654-123-789 o +34 654-123-789"
            valid = false
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
            
            /*const response = await fetch(""/*URL backend, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Enviamos el token a BD en el header.
                    "Authorization": `Bearer ${store.token}`
                },
                body: JSON.stringify(formData) //Aqui tenemos que mapear los campos del backend y frontend
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al crear el registro");
            }
            */
            setEmergencyContact([formData, ...emergencyContact]) //Actualizamos el estado pero hace falta el mapeo

        } catch (error) {
            setError(error.data)
        } finally {
            setLoading(false)
        }
    }

    const handlePage = (page) => {
        setCurrentPage(page)
    }

    const handleDelete = async (recordId) => {
        try {
            /*const response = await fetch(/* backend_url con el id del record"",
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${store.token}`
                    }
                }
            )
            if (!response.ok) throw new Error("Error al eliminar el registro");
            */
            setEmergencyContact(emergencyContact.filter((record)=> record.id !== recordId ))
            
        } catch (error) {
            setError(...error,{ list: error.message })
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
                                            placeholder="+34 123-456-789"
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
                                <button type="submit" className="btn btn-primary">Añadir contacto</button>
                            </form>

                        </div>
                    </div>
                </div>
                <div className="col-md-5 ms-3">
                    <div className="card me-2 h-100">
                        <h5 className="card-header bg-primary text-white">Contactos de emegencia</h5>
                        {error.list && (
                            <div className="alert alert-danger mb-4" role="alert">
                                {error.list}
                            </div>
                        )}
                        <div className="card-body d-flex flex-column">
                            {emergencyContact.length==0 && <p>No ha añadido ningun contacto</p>}
                            {emergencyContact && emergencyContact.slice((currentPage-1),currentPage).map((data)=>{
                                return(
                                    <div key={data.id}>
                                        <h3>{`${data.firstNameContact} ${data.lastNameContact}`}</h3>
                                        <EmergencyContactQR phoneContact={data.phoneContact}/> 
                                    </div> 
                                )
                            })}

                            
                            
                            <nav className="mt-auto" aria-label="Page navigation example">
                                <ul className="pagination justify-content-end">
                                    <li className={`page-item ${currentPage==1 ? "disabled":""} `}>
                                        <button className="page-link" onClick={() => handlePage(currentPage - 1)}>
                                            Anterior
                                        </button>
                                    </li>

                                    {emergencyContact && emergencyContact.length > 1 && Array.from({ length: Math.ceil(emergencyContact.length) }, (_, index) => (
                                        <li key={index} className="page-item">
                                            <button className="page-link" onClick={() => handlePage(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                        ))
                                    }

                                    <li className={`page-item ${currentPage== Math.ceil(emergencyContact.length) ? "disabled":""} `}>
                                        <button className="page-link" onClick={() => handlePage(currentPage + 1)}>
                                            Siguiente
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )

}

export default EmergencyContact