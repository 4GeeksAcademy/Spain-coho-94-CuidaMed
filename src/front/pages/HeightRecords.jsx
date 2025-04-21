import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";


const HeightRecords = () => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        heightValue: undefined,
        measurementDate: undefined, 
        comments: ""
    }
    )
    const [heightHistory, setHeightHistory] = useState([])
    const [sortedHistory, setSortedHistory] = useState([]);
    const [error, setError] = useState({
        form: "",
        list: "",
        heightValue: "",
        measurementDate: "",
        comments: "",
    });
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const accessToken = localStorage.getItem("accessToken");

    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                
                const response = await fetch(`${backendUrl}/api/records/height`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`
                        }
                    });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Error al obtener el historial de registros")
                }

                setHeightHistory(data.map(item => 
                    ({
                        recordId:item.id,
                        heightValue:item.height,
                        measurementDate: item.manual_datetime, 
                        comments:item.comments
                    })
                ));

            } catch (error) {
                setError({...error, list: error.message })
            }
        }
        fetchRecordData();
    }, [])

    useEffect(() => {
        const parseDate = (dateStr) => {
            const [date, time] = dateStr.split(' ');
            const [day, month, year] = date.split('-');
            return new Date(`${year}-${month}-${day}T${time}`);
        };
    
        if (heightHistory && heightHistory.length > 0) {
            const sorted = [...heightHistory].sort(
                (a, b) => parseDate(b.measurementDate) - parseDate(a.measurementDate)
            );
            setSortedHistory(sorted);
            
        }
    }, [heightHistory]);
    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }

        const now = new Date();
        const selectedDate = new Date(formData.measurementDate);

        if (!formData.heightValue) {
            newErrors.heightValue = "Por favor, introduzca una altura";
            valid = false;
        } else if (formData.heightValue < 0) {
            newErrors.heightValue = "La altura no puede ser negativa";
            valid = false;
        } else if (formData.heightValue < 0.4 || formData.heightValue > 3) {
            newErrors.heightValue = "Por favor, introduzca una altura entre 0.4 y 3 metros";
            valid = false;
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
    const formatDatetime = (datetimeStr) => {
        const dateObj = new Date(datetimeStr);
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // enero = 0
        const year = dateObj.getFullYear();
        const hours = String(dateObj.getHours()).padStart(2, "0");
        const minutes = String(dateObj.getMinutes()).padStart(2, "0");
      
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return
        }
        setLoading(true);

        try {
            const formattedDate = formatDatetime(formData.measurementDate);
            const formattedForm = {...formData, measurementDate: formattedDate}
            const response = await fetch(`${backendUrl}/api/records/height`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    height:formData.heightValue,
                    manual_datetime:formattedDate,
                    comments:formData.comments     
                }) 
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al crear el registro");
            }
            
            setHeightHistory([{
                heightValue:data.height,
                measurementDate:data.manual_datetime,
                comments:data.comments,
                recordId:data.id,
            }, ...heightHistory])

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
            setFormData({
                heightValue:"",
                measurementDate: "",
                comments: ""
            })
        }
    }

    const handlePage = (page) => {
        setCurrentPage(page)
    }

    const handleDelete = async (recordId) => {
        try {
            const response = await fetch( `${backendUrl}/api/records/height/${recordId}`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            )
            if (!response.ok) throw new Error("Error al eliminar el registro");
            
            setHeightHistory(heightHistory.filter((record)=> record.recordId !== recordId ))
            
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
                            <h5 className="card-title">Altura</h5>
                            {error.form && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    {error.form}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="height" className="form-label">Introduzca un valor</label>
                                    <div className="input-group mb-3">
                                        <input
                                            type="number"
                                            className={`form-control ${error.heightValue ? 'is-invalid' : ''}`}
                                            id="height"
                                            name="heightValue"
                                            aria-describedby="heightValue"
                                            value={formData.heightValue}
                                            onChange={handleChange}
                                            placeholder="Ejemplo: 1.65"
                                        />
                                        <span className="input-group-text" >metros</span>
                                        {error.heightValue && <div className="invalid-feedback">{error.heightValue}</div>}
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
                                <div className="d-flex w-100 justify-content-end">
                                    <button type="submit" className="btn btn-primary">Añadir registro</button>
                                </div>
                                
                            </form>

                        </div>
                    </div>
                </div>
                <div className="col-md-5 ms-3">
                    <div className="card me-2 h-100">
                        <h5 className="card-header bg-primary text-white">Historial de registros</h5>
                        {error.list && (
                            <div className="alert alert-danger m-2" role="alert">
                                {error.list}
                            </div>
                        )}
                        <div className="card-body d-flex flex-column table-responsive">
                            <table className="table table-hover table-sm">
                                <thead><tr>
                                    <th scope="col" style={{ width: "100px" }}>Altura (metros)</th>
                                    <th scope="col" style={{ width: "200px" }}>Fecha de medición</th>
                                    <th scope="col" style={{ width: "250px" }}>Comentario</th>
                                    <th scope="col" style={{ width: "50px" }}></th>
                                </tr></thead>
                                <tbody>
                                    {sortedHistory && sortedHistory.slice((currentPage - 1) * 7, currentPage * 7).map((data) => {
                                        return (
                                            <tr key={data.recordId}>
                                                <td >{data.heightValue}</td>
                                                <td >{data.measurementDate}</td>
                                                <td >{data.comments}</td>
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

export default HeightRecords