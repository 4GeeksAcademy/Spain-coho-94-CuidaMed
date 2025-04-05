import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";


const BloodPressureRecords = () => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        systolicValue: undefined,
        diastolicValue: undefined,
        measurementDate: undefined, 
        comments: ""
    }
    )
    const [bloodPressureHistory, setBloodPressureHistory] = useState([
        { id: 1, systolicValue: 120, diastolicValue: 80, measurementDate: "2025-03-01T08:30", comments: "En ayunas" },
        { id: 2, systolicValue: 130, diastolicValue: 85, measurementDate: "2025-03-01T20:30", comments: "Después de cenar" },
        { id: 3, systolicValue: 118, diastolicValue: 78, measurementDate: "2025-03-02T08:15", comments: "Antes del desayuno" },
        { id: 4, systolicValue: 125, diastolicValue: 82, measurementDate: "2025-03-02T13:30", comments: "Después de comer" },
        { id: 5, systolicValue: 115, diastolicValue: 75, measurementDate: "2025-03-03T08:00", comments: "En reposo" },
        { id: 6, systolicValue: 138, diastolicValue: 88, measurementDate: "2025-03-03T19:45", comments: "Antes de dormir" },
        { id: 7, systolicValue: 122, diastolicValue: 79, measurementDate: "2025-03-04T09:00", comments: "Antes del desayuno" },
        { id: 8, systolicValue: 135, diastolicValue: 85, measurementDate: "2025-03-04T13:00", comments: "Después de caminar" },
        { id: 9, systolicValue: 119, diastolicValue: 77, measurementDate: "2025-03-05T08:25", comments: "En ayunas" },
        { id: 10, systolicValue: 126, diastolicValue: 83, measurementDate: "2025-03-05T18:30", comments: "Tarde normal" },
        { id: 11, systolicValue: 123, diastolicValue: 80, measurementDate: "2025-03-06T07:50", comments: "Después de despertar" },
        { id: 12, systolicValue: 132, diastolicValue: 87, measurementDate: "2025-03-06T14:20", comments: "Después del almuerzo" },
        { id: 13, systolicValue: 117, diastolicValue: 74, measurementDate: "2025-03-07T08:10", comments: "En reposo" },
        { id: 14, systolicValue: 129, diastolicValue: 84, measurementDate: "2025-03-07T21:00", comments: "Antes de dormir" },
        { id: 15, systolicValue: 121, diastolicValue: 76, measurementDate: "2025-03-08T08:30", comments: "Mañana normal" },
        { id: 16, systolicValue: 133, diastolicValue: 86, measurementDate: "2025-03-08T13:10", comments: "Después de caminar" },
        { id: 17, systolicValue: 116, diastolicValue: 73, measurementDate: "2025-03-09T08:00", comments: "En ayunas" },
        { id: 18, systolicValue: 128, diastolicValue: 81, measurementDate: "2025-03-09T19:00", comments: "Después de cenar" },
        { id: 19, systolicValue: 124, diastolicValue: 79, measurementDate: "2025-03-10T07:45", comments: "Mañana normal" },
        { id: 20, systolicValue: 136, diastolicValue: 88, measurementDate: "2025-03-10T14:00", comments: "Después del almuerzo" },
        { id: 21, systolicValue: 114, diastolicValue: 72, measurementDate: "2025-03-11T08:20", comments: "En reposo" },
        { id: 22, systolicValue: 127, diastolicValue: 83, measurementDate: "2025-03-11T18:15", comments: "Después de caminar" },
        { id: 23, systolicValue: 122, diastolicValue: 78, measurementDate: "2025-03-12T09:10", comments: "Antes del desayuno" },
        { id: 24, systolicValue: 131, diastolicValue: 86, measurementDate: "2025-03-12T13:50", comments: "Después de comer" },
        { id: 25, systolicValue: 120, diastolicValue: 80, measurementDate: "2025-03-13T08:30", comments: "Mañana estable" },
    ] )
    const [sortedHistory, setSortedHistory] = useState([]);
    const [error, setError] = useState({
        form: "",
        list: "",
        systolicValue: "",
        diastolicValue:"",
        measurementDate: "",
        comments: "",
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
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

                setBloodPressureHistory(/* data.loquesea */)

            } catch (error) {
                setError(...error, { list: error.message })
            }
        }
    }, [])
    useEffect(() => {
        if (bloodPressureHistory) {
          const sorted = [...bloodPressureHistory].sort((a, b) => new Date(b.measurementDate) - new Date(a.measurementDate));
          setSortedHistory(sorted);
        }
      }, [bloodPressureHistory]);

    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }
        const now = new Date();
        const selectedDate = new Date(formData.measurementDate);

        if (!formData.systolicValue) {
            newErrors.systolicValue = "Por favor, introduzca un valor de tensión sistólica"
            valid = false
        }
        if (!formData.diastolicValue) {
            newErrors.diastolicValue = "Por favor, introduzca un valor de tensión diastólica"
            valid = false
        }
        if (!formData.measurementDate) {
            newErrors.measurementDate = "Por favor, seleccione una fecha de medición"
            valid = false
        }else if (selectedDate > now) {
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
            setBloodPressureHistory([formData, ...bloodPressureHistory]) //Actualizamos el estado pero hace falta el mapeo

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
            setBloodPressureHistory(bloodPressureHistory.filter((record)=> record.id !== recordId ))
            
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
                            <h5 className="card-title">Tensión arterial</h5>
                            {error.form && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    {error.form}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="tension" className="form-label">Introduzca tensión sistólica (alta)</label>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className={`form-control ${error.systolicValue ? 'is-invalid' : ''}`}
                                            id="tension"
                                            name="systolicValue"
                                            aria-describedby="systolicValue"
                                            value={formData.systolicValue}
                                            onChange={handleChange}
                                        />
                                        <span className="input-group-text" id="basic-addon2">mm/Hg</span>
                                        {error.systolicValue && <div className="invalid-feedback">{error.systolicValue}</div>}
                                    </div>

                                </div>

                                <div className="mb-3">
                                    <label htmlFor="tension" className="form-label">Introduzca tensión diastólica (baja)</label>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className={`form-control ${error.diastolicValue ? 'is-invalid' : ''}`}
                                            id="tension"
                                            name="diastolicValue"
                                            aria-describedby="diastolicValue"
                                            value={formData.diastolicValue}
                                            onChange={handleChange}
                                        />
                                        <span className="input-group-text" id="basic-addon2">mm/Hg</span>
                                        {error.diastolicValue && <div className="invalid-feedback">{error.diastolicValue}</div>}
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
                                    <th scope="col" style={{ width: "100px" }}>Sistólica (mm/Hg)</th>
                                    <th scope="col" style={{ width: "100px" }}>Diastólica (mm/Hg)</th>
                                    <th scope="col" style={{ width: "200px" }}>Fecha de medición</th>
                                    <th scope="col" style={{ width: "250px" }}>Comentario</th>
                                </tr></thead>
                                <tbody>
                                    {sortedHistory && sortedHistory.slice((currentPage - 1) * 7, currentPage * 7).map((data) => {
                                        return (
                                            <tr key={data.id}>
                                                <td >{data.systolicValue}</td>
                                                <td >{data.diastolicValue}</td>
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

export default BloodPressureRecords