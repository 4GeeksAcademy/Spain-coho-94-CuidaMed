import React, { useState, useEffect } from "react";

const PersonalAntecedentRecords= () => {
    
    const [formData, setFormData] = useState({
        disease: "",
        diagnosisDate: "",
    }
    )
    const [personalAntecedent, setPersonalAntecedent] = useState([])

    const [error, setError] = useState({
        form: "",
        list: "",
        disease: "",
        diagnosisDate:""
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                
                const response = await fetch(`${backendUrl}/api/records/personal_antecedents`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`
                        }
                    });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Error al obtener el historial de antecedentes personales")
                }

                setPersonalAntecedent(
                    data.map(item => 
                        ({
                            recordId:item.id,
                            disease: item.disease,
                            diagnosisDate: item.diagnosis_date,
                        })
                    )
                )

            } catch (error) {
                setError({...error, list: error.message })
            }
        }
        fetchRecordData();
    }, [])


    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }

        const now = new Date();
        const selectedDate = new Date(formData.diagnosisDate)

        if (!formData.disease) {
            newErrors.disease = "Por favor, introduzca la enfermedad" //Actualizar con el valor máximo en la BD
            valid = false
        }else if (formData.disease.length > 200) {
            newErrors.disease = "El valor máximo de caracteres es 200" //Actualizar con el valor máximo en la BD
            valid = false
        }

        if (selectedDate > now) {
            newErrors.diagnosisDate = "No se pueden introducir diagnósticos futuros"
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
    const formatDate = (dateStr) => {
        const [year, month, day] = dateStr.split("-");
        return `${day}-${month}-${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return
        }
        setLoading(true);

        try {
            const formattedDate = formatDate(formData.diagnosisDate);
            const response = await fetch(`${backendUrl}/api/records/personal_antecedents`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify(
                    {
                     disease:formData.disease,
                     diagnosisDate:formData.diagnosisDate
                     ? formattedDate
                     : "",
                    }
                ) 

            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al crear el registro");
            }
            
            setPersonalAntecedent([formData, ...personalAntecedent]) 

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
            setPersonalAntecedent(personalAntecedent.filter((record)=> record.id !== recordId ))
            
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
                            <h5 className="card-title">Antecedentes médicos personales</h5>
                            {error.form && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    {error.form}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                
                                <div className="mb-3">
                                    <label htmlFor="disease" className="form-label">Enfermedad</label>
                                    <input
                                        className={`form-control ${error.disease ? 'is-invalid' : ''}`}
                                        id="disease"
                                        name="disease"
                                        value={formData.disease}
                                        onChange={handleChange}
                                    />
                                    {error.disease && <div className="invalid-feedback">{error.disease}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="fecha" className="form-label">Fecha del diagnóstico</label>
                                    <input
                                        type="date"
                                        className={`form-control ${error.diagnosisDate ? 'is-invalid' : ''}`}
                                        id="fecha"
                                        name="diagnosisDate"
                                        value={formData.diagnosisDate}
                                        onChange={handleChange}
                                    />
                                    {error.diagnosisDate && (
                                        <div className="invalid-feedback">{error.diagnosisDate}</div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-primary">Añadir registro</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-5 ms-3">
                    <div className="card me-2 h-100">
                        <h5 className="card-header bg-primary text-white">Historial de antecedentes</h5>
                        {error.list && (
                            <div className="alert alert-danger mb-4" role="alert">
                                {error.list}
                            </div>
                        )}
                        <div className="card-body d-flex flex-column table-responsive">
                            <table className="table table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ width: "200px" }}>Enfermedad</th>
                                        <th scope="col" style={{ width: "200px" }}>Fecha de diagnóstico</th>
                                        <th scope="col" style={{ width: "50px" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {personalAntecedent && personalAntecedent.slice((currentPage - 1) * 7, currentPage * 7).map((data) => {
                                        return (
                                            <tr key={data.id}>
                                                <td>{data.disease}</td>
                                                <td>{data.diagnosisDate}</td>
                                                <td><button className="btn" onClick={()=>handleDelete(data.id)}><i className="text-danger fa-solid fa-trash"></i></button></td>
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

                                    {personalAntecedent && personalAntecedent.length > 7 && Array.from({ length: Math.ceil(personalAntecedent.length / 7) }, (_, index) => (
                                        <li key={index} className="page-item">
                                            <button className="page-link" onClick={() => handlePage(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                        ))
                                    }

                                    <li className={`page-item ${currentPage== Math.ceil(personalAntecedent.length / 7) ? "disabled":""} `}>
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

export default PersonalAntecedentRecords