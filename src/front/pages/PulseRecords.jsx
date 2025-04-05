import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";


const PulseRecords = () => {
    // Definiendo estados
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        pulseValue: undefined,
        measurementDate: undefined, 
        comments: ""
    }
    )
    const [pulseHistory, setPulseHistory] = useState([

        { id: 1, pulseValue: 72, measurementDate: "2025-03-01T08:30", comments: "En reposo" },
        { id: 2, pulseValue: 85, measurementDate: "2025-03-01T13:15", comments: "Después de caminar" },
        { id: 3, pulseValue: 76, measurementDate: "2025-03-02T08:00", comments: "En ayunas" },
        { id: 4, pulseValue: 90, measurementDate: "2025-03-02T19:20", comments: "Después de cenar" },
        { id: 5, pulseValue: 70, measurementDate: "2025-03-03T07:50", comments: "Antes del desayuno" },
        { id: 6, pulseValue: 95, measurementDate: "2025-03-03T14:10", comments: "Después de ejercicio leve" },
        { id: 7, pulseValue: 60, measurementDate: "2025-03-04T08:10", comments: "En reposo profundo" },
        { id: 8, pulseValue: 82, measurementDate: "2025-03-04T18:30", comments: "Tarde tranquila" },
        { id: 9, pulseValue: 68, measurementDate: "2025-03-05T08:20", comments: "Antes de desayunar" },
        { id: 10, pulseValue: 88, measurementDate: "2025-03-05T20:00", comments: "Después de una caminata larga" },
        { id: 11, pulseValue: 75, measurementDate: "2025-03-06T07:45", comments: "Ritmo normal" },
        { id: 12, pulseValue: 93, measurementDate: "2025-03-06T12:00", comments: "Con algo de estrés" },
        { id: 13, pulseValue: 58, measurementDate: "2025-03-07T08:15", comments: "Recién despertado" },
        { id: 14, pulseValue: 79, measurementDate: "2025-03-07T19:00", comments: "Después de merienda" },
        { id: 15, pulseValue: 66, measurementDate: "2025-03-08T08:00", comments: "En reposo" },
        { id: 16, pulseValue: 81, measurementDate: "2025-03-08T13:30", comments: "Actividad leve" },
        { id: 17, pulseValue: 73, measurementDate: "2025-03-09T08:40", comments: "Lectura matinal" },
        { id: 18, pulseValue: 97, measurementDate: "2025-03-09T15:10", comments: "Después del ejercicio" },
        { id: 19, pulseValue: 69, measurementDate: "2025-03-10T08:25", comments: "Ritmo estable" },
        { id: 20, pulseValue: 87, measurementDate: "2025-03-10T18:45", comments: "Cansancio leve" },
        { id: 21, pulseValue: 62, measurementDate: "2025-03-11T08:30", comments: "En ayunas" },
        { id: 22, pulseValue: 84, measurementDate: "2025-03-11T14:00", comments: "Después de comer" },
        { id: 23, pulseValue: 74, measurementDate: "2025-03-12T07:55", comments: "Normal matutino" },
        { id: 24, pulseValue: 91, measurementDate: "2025-03-12T19:10", comments: "Noche activa" },
        { id: 25, pulseValue: 67, measurementDate: "2025-03-13T08:05", comments: "Antes del desayuno" },

    ])
    const [sortedHistory, setSortedHistory] = useState([]);
    const [error, setError] = useState({
        form: "",
        list: "",
        pulseValue: "",
        measurementDate: "",
        comments: "",
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

    //useEffect para cargar los datos de la base de datos
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

                setPulseHistory(/* data.loquesea */)

            } catch (error) {
                setError(...error, { list: error.message })
            }
        }
    }, [])

    //useEffect para ordenar los datos por fecha al añadir un registro
    useEffect(() => {
            if (pulseHistory) {
              const sorted = [...pulseHistory].sort((a, b) => new Date(b.measurementDate) - new Date(a.measurementDate));
              setSortedHistory(sorted);
            }
          }, [pulseHistory]);

    //Validación de campos del formulario
    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }

        const now = new Date();
        const selectedDate = new Date(formData.measurementDate);

        if (!formData.pulseValue) {
            newErrors.pulseValue = "Por favor, introduzca un valor"
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
            setPulseHistory([formData, ...pulseHistory]) //Actualizamos el estado pero hace falta el mapeo

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
            setPulseHistory(pulseHistory.filter((record)=> record.id !== recordId ))
            
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
                            <h5 className="card-title">Pulso</h5>
                            {error.form && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    {error.form}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="pulse" className="form-label">Introduzca un valor</label>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className={`form-control ${error.pulseValue ? 'is-invalid' : ''}`}
                                            id="pulse"
                                            name="pulseValue"
                                            aria-describedby="pulseValue"
                                            value={formData.pulseValue}
                                            onChange={handleChange}
                                        />
                                        <span className="input-group-text" id="basic-addon2">lpm</span>
                                        {error.pulseValue && <div className="invalid-feedback">{error.pulseValue}</div>}
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
                                    <th scope="col" style={{ width: "100px" }}>Valor (lpm)</th>
                                    <th scope="col" style={{ width: "200px" }}>Fecha de medición</th>
                                    <th scope="col" style={{ width: "250px" }}>Comentario</th>
                                    <th scope="col" style={{ width: "50px" }}></th>
                                </tr></thead>
                                <tbody>
                                    {sortedHistory && sortedHistory.slice((currentPage - 1) * 7, currentPage * 7).map((data) => {
                                        return (
                                            <tr key={data.id}>
                                                <td >{data.pulseValue}</td>
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

export default PulseRecords
