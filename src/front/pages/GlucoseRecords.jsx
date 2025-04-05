import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";


const GlucoseRecords = () => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        glucoseValue: undefined,
        measurementDate: undefined, //aqui pondremos la fecha y hora según base de datos
        comments: ""
    }
    )
    const [glucoseHistory, setGlucoseHistory] = useState([

        { id: 1, glucoseValue: 98, measurementDate: "2025-03-10T08:30", comments: "Antes del desayuno" },
        { id: 2, glucoseValue: 112, measurementDate: "2025-03-10T13:15", comments: "Después de comer" },
        { id: 3, glucoseValue: 94, measurementDate: "2025-03-11T07:45", comments: "En ayunas" },
        { id: 4, glucoseValue: 135, measurementDate: "2025-03-11T19:45", comments: "Después de cenar" },
        { id: 5, glucoseValue: 87, measurementDate: "2025-03-12T08:10", comments: "Antes del desayuno" },
        { id: 6, glucoseValue: 128, measurementDate: "2025-03-12T14:00", comments: "Después de comer" },
        { id: 7, glucoseValue: 91, measurementDate: "2025-03-13T08:20", comments: "En ayunas" },
        { id: 8, glucoseValue: 118, measurementDate: "2025-03-13T20:30", comments: "Después de cenar" },
        { id: 9, glucoseValue: 104, measurementDate: "2025-03-14T07:50", comments: "Antes del desayuno" },
        { id: 10, glucoseValue: 123, measurementDate: "2025-03-14T12:45", comments: "Después de comer" },
        { id: 11, glucoseValue: 99, measurementDate: "2025-03-15T08:00", comments: "Antes del desayuno" },
        { id: 12, glucoseValue: 142, measurementDate: "2025-03-15T19:00", comments: "Después de cenar" },
        { id: 13, glucoseValue: 96, measurementDate: "2025-03-16T08:35", comments: "En ayunas" },
        { id: 14, glucoseValue: 133, measurementDate: "2025-03-16T14:10", comments: "Después de comer" },
        { id: 15, glucoseValue: 89, measurementDate: "2025-03-17T08:25", comments: "Antes del desayuno" },
        { id: 16, glucoseValue: 120, measurementDate: "2025-03-17T20:00", comments: "Después de cenar" },
        { id: 17, glucoseValue: 101, measurementDate: "2025-03-18T07:40", comments: "En ayunas" },
        { id: 18, glucoseValue: 127, measurementDate: "2025-03-18T13:50", comments: "Después de comer" },
        { id: 19, glucoseValue: 92, measurementDate: "2025-03-19T08:00", comments: "Antes del desayuno" },
        { id: 20, glucoseValue: 136, measurementDate: "2025-03-19T19:30", comments: "Después de cenar" },
        { id: 21, glucoseValue: 85, measurementDate: "2025-03-20T07:30", comments: "En ayunas" },
        { id: 22, glucoseValue: 110, measurementDate: "2025-03-20T13:20", comments: "Después de comer" },
        { id: 23, glucoseValue: 97, measurementDate: "2025-03-21T08:10", comments: "Antes del desayuno" },
        { id: 24, glucoseValue: 119, measurementDate: "2025-03-21T19:20", comments: "Después de cenar" },
        { id: 25, glucoseValue: 102, measurementDate: "2025-03-22T08:00", comments: "Antes del desayuno" },

    ])
    const [sortedHistory, setSortedHistory] = useState([]);
    const [error, setError] = useState({
        form: "",
        list: "",
        glucoseValue: "",
        measurementDate: "",
        comments: "",
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
                    throw new Error(data.error || "Error al obtener el historial de registros")
                }

                setGlucoseHistory(/* data.loquesea */)

            } catch (error) {
                setError(...error, { list: error.message })
            }
        }
    }, [])
    useEffect(() => {
            if (glucoseHistory) {
              const sorted = [...glucoseHistory].sort((a, b) => new Date(b.measurementDate) - new Date(a.measurementDate));
              setSortedHistory(sorted);
            }
          }, [glucoseHistory]);

    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }

        const now = new Date();
        const selectedDate = new Date(formData.measurementDate);

        if (!formData.glucoseValue) {
            newErrors.glucoseValue = "Por favor, introduzca un valor de glucosa"
            valid = false
        }

        if (!formData.measurementDate) {
            newErrors.measurementDate = "Por favor, seleccione una fecha de medición"
            valid = false
        } else if (selectedDate > now) {
            newErrors.measurementDate = "No se pueden introducir registros futuros"
            valid = false
        }

        if (formData.comments.length > 200) {
            newErrors.comments = "El valor máximo de caracteres es 200" //Actualizar con el valor máximo en la BD
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
            setGlucoseHistory([formData, ...glucoseHistory]) //Actualizamos el estado pero hace falta el mapeo

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
            setGlucoseHistory(glucoseHistory.filter((record)=> record.id !== recordId ))
            
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
                            <h5 className="card-title">Glucosa</h5>
                            {error.form && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    {error.form}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="glucose" className="form-label">Introduzca un valor</label>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className={`form-control ${error.glucoseValue ? 'is-invalid' : ''}`}
                                            id="glucose"
                                            name="glucoseValue"
                                            aria-describedby="glucoseValue"
                                            value={formData.glucoseValue}
                                            onChange={handleChange}
                                        />
                                        <span className="input-group-text" id="basic-addon2">mg/dl</span>
                                        {error.glucoseValue && <div className="invalid-feedback">{error.glucoseValue}</div>}
                                    </div>

                                </div>

                                <div className="mb-3">
                                    <label htmlFor="fechahora" className="form-label">Fecha y hora</label>
                                    <input
                                        type="datetime-local"
                                        className={`form-control ${error.measurementDate ? 'is-invalid' : ''}`}
                                        id="fechahora"
                                        name="measurementDate"
                                        value={formData.measurementDate}
                                        onChange={handleChange}
                                    />
                                    {error.measurementDate && <div className="invalid-feedback">{error.measurementDate}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="comments" className="form-label">Anotaciones</label>
                                    <textarea
                                        className={`form-control ${error.comments ? 'is-invalid' : ''}`}
                                        id="comments"
                                        rows="4"
                                        name="comments"
                                        value={formData.comments}
                                        onChange={handleChange}
                                    />
                                    {error.comments && <div className="invalid-feedback">{error.comments}</div>}
                                </div>
                                <button type="submit" className="btn btn-primary">Añadir registro</button>
                            </form>

                        </div>
                    </div>
                </div>
                <div className="col-md-5 ms-3">
                    <div className="card me-2 h-100">
                        <h5 className="card-header bg-primary text-white">Historial de registros</h5>
                        {error.list && (
                            <div className="alert alert-danger mb-4" role="alert">
                                {error.list}
                            </div>
                        )}
                        <div className="card-body d-flex flex-column table-responsive">
                            <table className="table table-hover table-sm">
                                <thead><tr>
                                    <th scope="col" style={{ width: "100px" }}>Valor (mg/dl)</th>
                                    <th scope="col" style={{ width: "200px" }}>Fecha de medición</th>
                                    <th scope="col" style={{ width: "250px" }}>Comentario</th>
                                    <th scope="col" style={{ width: "50px" }}></th>
                                </tr></thead>
                                <tbody>
                                    {sortedHistory && sortedHistory.slice((currentPage - 1) * 7, currentPage * 7).map((data) => {
                                        return (
                                            <tr key={data.id}>
                                                <td >{data.glucoseValue}</td>
                                                <td >{data.measurementDate}</td>
                                                <td >{data.comments}</td>
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

                                    {sortedHistory && sortedHistory.length > 7 && Array.from({ length: Math.ceil(sortedHistory.length / 7) }, (_, index) => (
                                        <li key={index} className="page-item">
                                            <button className="page-link" onClick={() => handlePage(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                        ))
                                    }

                                    <li className={`page-item ${currentPage== Math.ceil(sortedHistory.length / 7) ? "disabled":""} `}>
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

export default GlucoseRecords