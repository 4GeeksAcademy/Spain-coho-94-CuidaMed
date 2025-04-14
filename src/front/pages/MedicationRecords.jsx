import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";


const MedicationRecords= () => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        medicationName: "",
        dosageInstructions:"",
        adverseReactions:"",
        treatmentStartDate: "",
        treatmentEndDate: "",
    })
    const [medication, setMedication] = useState([])

    const [error, setError] = useState({
        form: "",
        list: "",
        medicationName: "",
        dosageInstructions:"",
        adverseReactions:"",
        treatmentStartDate:"",
        treatmentEndDate:""
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                
                const response = await fetch(`${backendUrl}/api/records/medications`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`
                        }
                    });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || "Error al obtener el historial de tratamientos")
                }

                const formattedData = result.data.map(item => ({
                    recordId: item.id,
                    medicationName: item.medication_name,
                    dosageInstructions: item.dosage_instructions,
                    adverseReactions: item.adverse_reactions,
                    treatmentStartDate: item.treatment_start_date || "",
                    treatmentEndDate: item.treatment_end_date || ""
                }));

                setMedication(formattedData);

            } catch (error) {
                setError(prev => ({ ...prev, list: error.message }));
            }
        }
        fetchRecordData();
    }, [])


    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }   
        const treatmentStartDate = new Date(formData.treatmentStartDate)
        const treatmentEndDate = new Date(formData.treatmentEndDate)

        if (!formData.medicationName) {
            newErrors.medicationName = "Por favor, introduzca el nombre del medicamento" //Actualizar con el valor máximo en la BD
            valid = false
        }else if (formData.medicationName.length > 100) {
            newErrors.medicationName = "El valor máximo de caracteres es 100" //Actualizar con el valor máximo en la BD
            valid = false
        }

        if (!formData.dosageInstructions) {
            newErrors.dosageInstructions = "Por favor, introduzca la pauta" 
            valid = false
        }else if (formData.dosageInstructions.length > 300) {
            newErrors.dosageInstructions = "El valor máximo de caracteres es 300" 
            valid = false
        }

        if (formData.adverseReactions.length > 300) {
            newErrors.adverseReactions = "El valor máximo de caracteres es 300" 
            valid = false
        }

        if (formData.treatmentStartDate && formData.treatmentEndDate && treatmentStartDate > treatmentEndDate) {
            newErrors.treatmentEndDate = "La fecha fin debe ser posterior a la de inicio";
            valid = false;
          }

        setError(newErrors)
        return valid
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      
        if (error[name]) {
          setError((prev) => ({
            ...prev,
            [name]: "",
          }));
        }
      
        if (error.form) {
          setError((prev) => ({
            ...prev,
            form: "",
          }));
        }
      };

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

            const response = await fetch(`${backendUrl}/api/records/medications`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    medication_name: formData.medicationName,
                    dosage_instructions: formData.dosageInstructions,
                    adverse_reactions: formData.adverseReactions,
                    treatment_start_date: formData.treatmentStartDate
                      ? formatDate(formData.treatmentStartDate)
                      : "",
                    treatment_end_date: formData.treatmentEndDate
                      ? formatDate(formData.treatmentEndDate)
                      : ""
                  })
                  
            });
            

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al crear el registro");
            }
            
            setMedication([
                {
                    recordId: data.id,
                    medicationName: data.medication_name,
                    dosageInstructions: data.dosage_instructions,
                    adverseReactions: data.adverse_reactions,
                    treatmentStartDate: data.treatment_start_date,
                    treatmentEndDate: data.treatment_end_date
                }, ...medication]) 

        } catch (error) {
            setError(prev => ({
                ...prev,
                form: error.message
            }));
        } finally {
            setLoading(false)
            setFormData({
                medicationName: "",
                dosageInstructions: "",
                adverseReactions: "",
                treatmentStartDate: "",
                treatmentEndDate: ""
            });
        }
    }

    const handlePage = (page) => {
        setCurrentPage(page)
    }

    const handleDelete = async (recordId) => {
        try {
            const response = await fetch( `${backendUrl}/api/records/medications/${recordId}`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            )
            if (!response.ok) throw new Error("Error al eliminar el registro");
            
            setMedication(medication.filter((record)=> record.recordId !== recordId ))
            
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
                            <h5 className="card-title">Tratamientos</h5>
                            {error.form && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    {error.form}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                
                                <div className="mb-3">
                                    <label htmlFor="medicationName" className="form-label">Medicamento</label>
                                    <input
                                        className={`form-control ${error.medicationName ? 'is-invalid' : ''}`}
                                        id="medicationName"
                                        name="medicationName"
                                        value={formData.medicationName}
                                        onChange={handleChange}
                                    />
                                    {error.medicationName && <div className="invalid-feedback">{error.medicationName}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="dosageInstructions" className="form-label">Pauta</label>
                                    <input
                                        className={`form-control ${error.dosageInstructions ? 'is-invalid' : ''}`}
                                        id="dosage"
                                        name="dosageInstructions"
                                        value={formData.dosageInstructions}
                                        onChange={handleChange}
                                    />
                                    {error.dosageInstructions && <div className="invalid-feedback">{error.dosageInstructions}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="adverseReactions" className="form-label">Reacciones adversas</label>
                                    <textarea
                                        className={`form-control ${error.adverseReactions ? 'is-invalid' : ''}`}
                                        id="adverseReactions"
                                        rows="3"
                                        name="adverseReactions"
                                        value={formData.adverseReactions}
                                        onChange={handleChange}
                                    />
                                    {error.adverseReactions && <div className="invalid-feedback">{error.adverseReactions}</div>}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="startDate" className="form-label">Fecha de inicio</label>
                                    <input
                                        type="date"
                                        className={`form-control ${error.treatmentStartDate ? 'is-invalid' : ''}`}
                                        id="startDate"
                                        name="treatmentStartDate"
                                        value={formData.treatmentStartDate}
                                        onChange={handleChange}
                                    />
                                    {error.treatmentStartDate && (
                                        <div className="invalid-feedback">{error.treatmentStartDate}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="endDate" className="form-label">Fecha de fin</label>
                                    <input
                                        type="date"
                                        className={`form-control ${error.treatmentEndDate ? 'is-invalid' : ''}`}
                                        id="endDate"
                                        name="treatmentEndDate"
                                        value={formData.treatmentEndDate}
                                        onChange={handleChange}
                                    />
                                    {error.treatmentEndDate && (
                                        <div className="invalid-feedback">{error.treatmentEndDate}</div>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-primary">Añadir registro</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-5 ms-3">
                    <div className="card me-2 h-100">
                        <h5 className="card-header bg-primary text-white">Tratamientos</h5>
                        {error.list && (
                            <div className="alert alert-danger mb-4" role="alert">
                                {error.list}
                            </div>
                        )}
                        <div className="card-body d-flex flex-column table-responsive">
                            <table className="table table-hover table-sm overflow-x-auto">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ width: "50px" }}>Medicamento</th>
                                        <th scope="col" style={{ width: "200px" }}>Pauta</th>
                                        <th scope="col" style={{ width: "200px" }}>Reacciones adversas</th>
                                        <th scope="col" style={{ width: "100px" }}>Incio</th>
                                        <th scope="col" style={{ width: "100px" }}>Fin</th>
                                        <th scope="col" style={{ width: "50px" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medication && medication.slice((currentPage - 1) * 8, currentPage * 8).map((data) => {
                                        return (
                                            <tr key={data.recordId}>
                                                <td>{data.medicationName}</td>
                                                <td>{data.dosageInstructions}</td>
                                                <td>{data.adverseReactions}</td>
                                                <td>{data.treatmentStartDate}</td>
                                                <td>{data.treatmentEndDate}</td>
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

                                    {medication && medication.length > 8 && Array.from({ length: Math.ceil(medication.length / 8) }, (_, index) => (
                                        <li key={index} className="page-item">
                                            <button className="page-link" onClick={() => handlePage(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                        ))
                                    }

                                    <li className={`page-item ${currentPage== Math.ceil(medication.length / 8) ? "disabled":""} `}>
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

export default MedicationRecords