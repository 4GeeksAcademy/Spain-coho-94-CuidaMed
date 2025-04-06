import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";


const WeightRecords = () => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        weightValue: undefined,
        measurementDate: undefined, //aqui pondremos la fecha y hora según base de datos
        comments: ""
    }
    )
    const [weightHistory, setWeightHistory] = useState([

        { id: 1, weightValue: 72.5, measurementDate: "2025-03-01T08:00", comments: "En ayunas" },
        { id: 2, weightValue: 73.0, measurementDate: "2025-03-02T08:10", comments: "Después de cenar" },
        { id: 3, weightValue: 72.2, measurementDate: "2025-03-03T08:05", comments: "En ayunas" },
        { id: 4, weightValue: 72.7, measurementDate: "2025-03-04T08:15", comments: "Después del desayuno" },
        { id: 5, weightValue: 72.3, measurementDate: "2025-03-05T07:50", comments: "Recién levantado" },
        { id: 6, weightValue: 73.1, measurementDate: "2025-03-06T08:20", comments: "Después del almuerzo" },
        { id: 7, weightValue: 72.0, measurementDate: "2025-03-07T08:00", comments: "En ayunas" },
        { id: 8, weightValue: 72.8, measurementDate: "2025-03-08T08:10", comments: "Después de cenar" },
        { id: 9, weightValue: 72.4, measurementDate: "2025-03-09T08:00", comments: "En ayunas" },
        { id: 10, weightValue: 73.2, measurementDate: "2025-03-10T08:30", comments: "Después del desayuno" },
        { id: 11, weightValue: 72.6, measurementDate: "2025-03-11T08:10", comments: "Antes de comer" },
        { id: 12, weightValue: 73.0, measurementDate: "2025-03-12T08:15", comments: "Después de merienda" },
        { id: 13, weightValue: 72.1, measurementDate: "2025-03-13T08:00", comments: "En ayunas" },
        { id: 14, weightValue: 72.9, measurementDate: "2025-03-14T08:20", comments: "Después de caminar" },
        { id: 15, weightValue: 72.3, measurementDate: "2025-03-15T08:05", comments: "Antes del desayuno" },
        { id: 16, weightValue: 73.3, measurementDate: "2025-03-16T08:00", comments: "Después de cenar" },
        { id: 17, weightValue: 72.2, measurementDate: "2025-03-17T08:10", comments: "En reposo" },
        { id: 18, weightValue: 72.7, measurementDate: "2025-03-18T08:00", comments: "Recién levantado" },
        { id: 19, weightValue: 72.0, measurementDate: "2025-03-19T08:15", comments: "En ayunas" },
        { id: 20, weightValue: 73.1, measurementDate: "2025-03-20T08:30", comments: "Después del desayuno" },
        { id: 21, weightValue: 72.4, measurementDate: "2025-03-21T08:00", comments: "Mañana normal" },
        { id: 22, weightValue: 73.0, measurementDate: "2025-03-22T08:25", comments: "Después de comer" },
        { id: 23, weightValue: 72.5, measurementDate: "2025-03-23T08:00", comments: "En ayunas" },
        { id: 24, weightValue: 72.8, measurementDate: "2025-03-24T08:10", comments: "Día soleado" },
        { id: 25, weightValue: 72.2, measurementDate: "2025-03-25T08:00", comments: "Sin variaciones" },

    ])
    const [sortedHistory, setSortedHistory] = useState([]);
    const [error, setError] = useState({
        form: "",
        list: "",
        weightValue: "",
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

                setWeightHistory(/* data.loquesea */)

            } catch (error) {
                setError(...error, { list: error.message })
            }
        }
    }, [])
    useEffect(() => {
            if (weightHistory) {
              const sorted = [...weightHistory].sort((a, b) => new Date(b.measurementDate) - new Date(a.measurementDate));
              setSortedHistory(sorted);
            }
          }, [weightHistory]);

    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }

        const now = new Date();
        const selectedDate = new Date(formData.measurementDate);

        if (!formData.weightValue) {
            newErrors.weightValue = "Por favor, introduzca un peso"
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
            setWeightHistory([formData, ...weightHistory]) //Actualizamos el estado pero hace falta el mapeo

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
            setWeightHistory(weightHistory.filter((record)=> record.id !== recordId ))
            
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
                            <h5 className="card-title">Peso</h5>
                            {error.form && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    {error.form}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="weight" className="form-label">Introduzca un valor</label>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className={`form-control ${error.weightValue ? 'is-invalid' : ''}`}
                                            id="weight"
                                            name="weightValue"
                                            aria-describedby="weightValue"
                                            value={formData.weightValue}
                                            onChange={handleChange}
                                        />
                                        <span className="input-group-text" id="basic-addon2">Kg</span>
                                        {error.weightValue && <div className="invalid-feedback">{error.weightValue}</div>}
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
                                    <th scope="col" style={{ width: "100px" }}>Peso (kg)</th>
                                    <th scope="col" style={{ width: "200px" }}>Fecha de medición</th>
                                    <th scope="col" style={{ width: "250px" }}>Comentario</th>
                                    <th scope="col" style={{ width: "50px" }}></th>
                                </tr></thead>
                                <tbody>
                                    {sortedHistory && sortedHistory.slice((currentPage - 1) * 7, currentPage * 7).map((data) => {
                                        return (
                                            <tr key={data.id}>
                                                <td >{data.weightValue}</td>
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

export default WeightRecords