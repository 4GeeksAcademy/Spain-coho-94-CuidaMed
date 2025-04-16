import React, { useState, useEffect } from "react";

const AllergyRecords = () => {
    
    const [formData, setFormData] = useState({
        allergen: "",
        symptoms: "",
        severity: "",
    }
    )
    const [allergiesHistory, setAllergiesHistory] = useState([])

    const [error, setError] = useState({
        form: "",
        list: "",
        allergen: "",
        symptoms: "",
        severity: "",
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                
                const response = await fetch(`${backendUrl}/api/records/allergy`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`
                        }
                    });
                const data = await response.json();


                if (!response.ok) {
                    throw new Error(data.error || "Error al obtener el historial de alergias")
                }

                setAllergiesHistory(data.map(item=>
                    ({
                        allergen: item.allergen,
                        symptoms: item.symptoms,
                        severity: item.severity,
                        recordId: item.id
                    })
                ))
                

            } catch (error) {
                setError({...error, list: error.message })
            }
        }
        fetchRecordData();
    }, [])


    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }

        if (!formData.allergen) {
            newErrors.allergen = "Por favor, introduzca el desencadenante de su alergia"
            valid = false
        }

        if (formData.symptoms.length > 200) {
            newErrors.symptoms = "El valor máximo de caracteres es 200" 
            valid = false
        }

        if (!formData.severity) {
            newErrors.severity = "Debe seleccionar un nivel de gravedad.";
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
            
            const response = await fetch(`${backendUrl}/api/records/allergy`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(
                    {
                        "id": formData.id,
                        "allergen": formData.allergen,
                        "symptoms": formData.symptoms,
                        "severity": formData.severity,
                    }
                ) 
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al crear el registro");
            }
            
            setAllergiesHistory([
                {
                    recordId:data.id,
                    allergen:data.allergen,
                    symptoms:data.symptoms,
                    severity:data.severity
                }
                , ...allergiesHistory]) 

        } catch (error) {
            setError(error.data)
        } finally {
            setLoading(false)
            setFormData(
                {
                    allergen:"",
                    symptoms:"",
                    severity:""
                }
            )
        }
    }

    const handlePage = (page) => {
        setCurrentPage(page)
    }

    const handleDelete = async (recordId) => {
        try {
            const response = await fetch(`${backendUrl}/api/records/allergy/${recordId}`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            )
            if (!response.ok) throw new Error("Error al eliminar el registro");
            
            setAllergiesHistory(allergiesHistory.filter((record)=> record.recordId !== recordId ))
            
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
                            <h5 className="card-title">Alergias</h5>
                            {error.form && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    {error.form}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="allergies" className="form-label">Introduzca el desencadenante</label>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className={`form-control ${error.allergen ? 'is-invalid' : ''}`}
                                            id="allergies"
                                            name="allergen"
                                            aria-describedby="allergen"
                                            value={formData.allergen}
                                            onChange={handleChange}
                                        />
                                        
                                        {error.allergen && <div className="invalid-feedback">{error.allergen}</div>}
                                    </div>

                                </div>

                                
                                <div className="mb-3">
                                    <label htmlFor="symptoms" className="form-label">Síntomas</label>
                                    <textarea
                                        className={`form-control ${error.symptoms ? 'is-invalid' : ''}`}
                                        id="symptoms"
                                        rows="4"
                                        name="symptoms"
                                        value={formData.symptoms}
                                        onChange={handleChange}
                                    />
                                    {error.symptoms && <div className="invalid-feedback">{error.symptoms}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="severity" className="form-label">Gravedad</label>
                                    <select 
                                    className={`form-select ${error.severity ? 'is-invalid' : ''}`}
                                    name="severity" 
                                    id="severity" 
                                    value={formData.severity}
                                    onChange={handleChange}
                                    aria-label="Gravedad de la alergia">
                                        <option value="">Elige una opción</option>
                                        <option value="Leve">Leve</option>
                                        <option value="Moderada">Moderada</option>
                                        <option value="Grave">Grave</option>
                                        <option value="Muy grave">Muy grave</option>
                                    </select>
                                    {error.severity && <div className="invalid-feedback">{error.severity}</div>}

                                </div>
                                <button type="submit" className="btn btn-primary">Añadir registro</button>
                            </form>

                        </div>
                    </div>
                </div>
                <div className="col-md-5 ms-3">
                    <div className="card me-2 h-100">
                        <h5 className="card-header bg-primary text-white">Registro de alergias</h5>
                        {error.list && (
                            <div className="alert alert-danger m-2" role="alert">
                                {error.list}
                            </div>
                        )}
                        <div className="card-body d-flex flex-column table-responsive">
                            <table className="table table-hover table-sm">
                                <thead><tr>
                                    <th scope="col" style={{ width: "200px" }}>Alérgeno</th>
                                    <th scope="col" style={{ width: "300px" }}>Síntomas</th>
                                    <th scope="col" style={{ width: "100px" }}>Gravedad</th>
                                    <th scope="col" style={{ width: "50px" }}></th>
                                </tr></thead>
                                <tbody>
                                    {allergiesHistory && allergiesHistory.slice((currentPage - 1) * 4, currentPage * 4).map((data) => {
                                        return (
                                            <tr key={data.recordId}>
                                                <td >{data.allergen}</td>
                                                <td >{data.symptoms}</td>
                                                <td >{data.severity}</td>
                                                <td><button className="btn" onClick={()=>handleDelete(data.recordId)}><i className="text-danger fa-solid fa-trash"></i></button></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <nav className="mt-auto" aria-label="Page navigation example">
                                <ul className="pagination justify-content-end">
                                    <li className={`page-item ${currentPage==1 ? "disabled":""} `}>
                                        <button className="page-link" onClick={() => handlePage(currentPage - 1)}>
                                            Anterior
                                        </button>
                                    </li>

                                    {allergiesHistory && allergiesHistory.length > 7 && Array.from({ length: Math.ceil(allergiesHistory.length / 7) }, (_, index) => (
                                        <li key={index} className="page-item">
                                            <button className="page-link" onClick={() => handlePage(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                        ))
                                    }

                                    <li className={`page-item ${currentPage== Math.ceil(allergiesHistory.length / 7) ? "disabled":""} `}>
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

export default AllergyRecords