import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";


const MedicalHistoryRecords
 = () => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        kinship: "",
        disease: "",
    }
    )
    const [medicalHistory, setMedicalHistory] = useState([
        { id: 1, kinship: "Padre", disease: "Hipertensión" },
        { id: 2, kinship: "Madre", disease: "Diabetes tipo 2" },
        { id: 3, kinship: "Abuelo paterno", disease: "Enfermedad coronaria" },
        { id: 4, kinship: "Abuela materna", disease: "Osteoporosis" },
        { id: 5, kinship: "Hermano", disease: "Asma" },
        { id: 6, kinship: "Hermana", disease: "Alergia alimentaria" },
        { id: 7, kinship: "Tío materno", disease: "Cáncer de colon" },
        { id: 8, kinship: "Tía paterna", disease: "Hipotiroidismo" },
        { id: 9, kinship: "Abuelo materno", disease: "Diabetes tipo 2" },
        { id: 10, kinship: "Abuela paterna", disease: "Alzheimer" },
        { id: 11, kinship: "Padre", disease: "Colesterol alto" },
        { id: 12, kinship: "Madre", disease: "Cáncer de mama" },
        { id: 13, kinship: "Hermano", disease: "Enfermedad celíaca" },
        { id: 14, kinship: "Hermana", disease: "Migrañas crónicas" },
        { id: 15, kinship: "Tío paterno", disease: "Enfermedad renal crónica" },
        { id: 16, kinship: "Tía materna", disease: "Esclerosis múltiple" },
        { id: 17, kinship: "Primo", disease: "Trastorno bipolar" },
        { id: 18, kinship: "Prima", disease: "Asma" },
        { id: 19, kinship: "Padre", disease: "Artritis reumatoide" },
        { id: 20, kinship: "Madre", disease: "Glaucoma" },
        { id: 21, kinship: "Abuelo paterno", disease: "Cáncer de próstata" },
        { id: 22, kinship: "Abuela materna", disease: "Hipertensión" },
        { id: 23, kinship: "Tía paterna", disease: "Diabetes tipo 1" },
        { id: 24, kinship: "Hermano", disease: "Epilepsia" },
        { id: 25, kinship: "Primo", disease: "Trastorno por déficit de atención" },
    ])

    const [error, setError] = useState({
        form: "",
        list: "",
        kinship: "",
        disease: "",
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
                    throw new Error(data.error || "Error al obtener el historial de antecedentes familiares")
                }

                setMedicalHistory(/* data.loquesea */)

            } catch (error) {
                setError(...error, { list: error.message })
            }
        }
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
            setMedicalHistory([formData, ...medicalHistory]) //Actualizamos el estado pero hace falta el mapeo

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
            setMedicalHistory(medicalHistory.filter((record)=> record.id !== recordId ))
            
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
                                        <th scope="col" style={{ width: "150px" }}>Parentesco</th>
                                        <th scope="col" style={{ width: "250px" }}>Enfermedad</th>
                                        <th scope="col" style={{ width: "50px" }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicalHistory && medicalHistory.slice((currentPage - 1) * 7, currentPage * 7).map((data) => {
                                        return (
                                            <tr key={data.id}>
                                                <td >{data.kinship}</td>
                                                <td >{data.disease}</td>
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
