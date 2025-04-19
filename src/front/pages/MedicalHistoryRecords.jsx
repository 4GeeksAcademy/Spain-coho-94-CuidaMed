import React, { useState, useEffect } from "react";



const MedicalHistoryRecords = () => {
    
    const [formData, setFormData] = useState({
        kinship: "",
        disease: "",
    }
    )
    const [medicalHistory, setMedicalHistory] = useState([ ])

    const [error, setError] = useState({
        form: "",
        list: "",
        kinship: "",
        disease: "",
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                
                const response = await fetch(`${backendUrl}/api/records/medical_history`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`
                        }
                    });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Error al obtener el historial de antecedentes familiares")
                }

                setMedicalHistory(data.map(item => 
                    ({
                    recordId:item.id,
                    kinship: item.kinship,
                    disease: item.disease,
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

        if (!formData.kinship) {
            newErrors.kinship = "Por favor, introduzca la relación de parentesco"
            valid = false
        }else if(formData.kinship.length>50){
            newErrors.kinship = "El valor máximo de caracteres es 50"
            valid = false
        }

        if (!formData.disease) {
            newErrors.disease = "Por favor, introduzca la enfermedad" //Actualizar con el valor máximo en la BD
            valid = false
        }else if (formData.disease.length > 150) {
            newErrors.disease = "El valor máximo de caracteres es 150" //Actualizar con el valor máximo en la BD
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
            
            const response = await fetch(`${backendUrl}/api/records/medical_history`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(
                    {
                        'kinship': formData.kinship,
                        'disease': formData.disease 
                    }
                )
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al crear el registro");
            }
            
            setMedicalHistory([
                {
                    kinship:data.kinship,
                    disease:data.disease,
                    recordId:data.id
                }, 
                ...medicalHistory]) 

        } catch (error) {
            setError(error.data)
        } finally {
            setLoading(false)
            setFormData({
                kinship:"",
                disease:""
            })
        }
    }

    const handlePage = (page) => {
        setCurrentPage(page)
    }

    const handleDelete = async (recordId) => {
        try {
            const response = await fetch( `${backendUrl}/api/records/medical_history/${recordId}`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            )
            if (!response.ok) throw new Error("Error al eliminar el registro");
            
            setMedicalHistory(medicalHistory.filter((record)=> record.recordId !== recordId ))
            
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
                            <h5 className="card-title">Antecedentes médicos familiares</h5>
                            {error.form && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    {error.form}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="kinship" className="form-label">Introduzca la relación de parentesco</label>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            className={`form-control ${error.kinship ? 'is-invalid' : ''}`}
                                            id="kinship"
                                            name="kinship"
                                            aria-describedby="kinship"
                                            value={formData.kinship}
                                            onChange={handleChange}
                                        />
                                        {error.kinship && <div className="invalid-feedback">{error.kinship}</div>}
                                    </div>

                                </div>

                                <div className="mb-3">
                                    <label htmlFor="disease" className="form-label">Enfermedad</label>
                                    <textarea
                                        className={`form-control ${error.disease ? 'is-invalid' : ''}`}
                                        id="disease"
                                        rows="4"
                                        name="disease"
                                        value={formData.disease}
                                        onChange={handleChange}
                                    />
                                    {error.disease && <div className="invalid-feedback">{error.disease}</div>}
                                </div>
                                <div className="d-flex w-100 justify-content-end">
                                    <button type="submit" className="btn btn-primary">Añadir registro</button>
                                </div>
                                
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-5 ms-3">
                    <div className="card me-2 h-100">
                        <h5 className="card-header bg-primary text-white">Historial de antecedentes</h5>
                        {error.list && (
                            <div className="alert alert-danger m-2" role="alert">
                                {error.list}
                            </div>
                        )}
                        <div className="card-body d-flex flex-column table-responsive">
                            <table className="table table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ width: "150px" }}>Parentesco</th>
                                        <th scope="col" style={{ width: "250px" }}>Enfermedad</th>
                                        <th scope="col" style={{ width: "50px" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicalHistory && medicalHistory.slice((currentPage - 1) * 7, currentPage * 7).map((data) => {
                                        return (
                                            <tr key={data.recordId}>
                                                <td >{data.kinship}</td>
                                                <td >{data.disease}</td>
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

                                    {medicalHistory && medicalHistory.length > 7 && Array.from({ length: Math.ceil(medicalHistory.length / 7) }, (_, index) => (
                                        <li key={index} className="page-item">
                                            <button className="page-link" onClick={() => handlePage(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                        ))
                                    }

                                    <li className={`page-item ${currentPage== Math.ceil(medicalHistory.length / 7) ? "disabled":""} `}>
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

export default MedicalHistoryRecords
