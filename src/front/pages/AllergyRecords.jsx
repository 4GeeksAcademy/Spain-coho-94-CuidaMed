import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";


const AllergyRecords = () => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        allergen: "",
        symptoms: "",
        severity: "",
    }
    )
    const [allergiesHistory, setAllergiesHistory] = useState([
        {
            id:1,
            allergen: "Polen",
            symptoms: "Congestión nasal, picor de ojos y estornudos frecuentes durante primavera.",
            severity: "moderada"
          },
          {
            id:2,
            allergen: "Gluten",
            symptoms: "Dolor abdominal, hinchazón y fatiga después de consumir pan o pasta.",
            severity: "grave"
          },
          {
            id:3,
            allergen: "Lácteos",
            symptoms: "Gases y molestias estomacales tras consumir productos lácteos.",
            severity: "leve"
          },
          {
            id:4,
            allergen: "Mariscos",
            symptoms: "Hinchazón de labios y urticaria tras ingerir camarones.",
            severity: "muy grave"
          },
          {
            id:5,
            allergen: "Polvo",
            symptoms: "Estornudos, picazón nasal y tos leve en ambientes cerrados.",
            severity: "leve"
          },
          {
            id:6,
            allergen: "Picadura de abeja",
            symptoms: "Inflamación localizada y dificultad para respirar tras la picadura.",
            severity: "muy grave"
          },
          {
            id:7,
            allergen: "Medicamento: Ibuprofeno",
            symptoms: "Erupción cutánea leve y molestias estomacales tras su consumo.",
            severity: "moderada"
          },
          {
            id:8,
            allergen: "Frutos secos",
            symptoms: "Cierre de garganta y dificultad para tragar al consumir nueces.",
            severity: "grave"
          },
          {
            id:9,
            allergen: "Moho",
            symptoms: "Congestión y ojos llorosos al estar en lugares húmedos.",
            severity: "moderada"
          },
          {
            id:10,
            allergen: "Perfumes fuertes",
            symptoms: "Dolor de cabeza y náuseas al exponerse a olores intensos.",
            severity: "leve"
          }
    ])

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
                    throw new Error(data.error || "Error al obtener el historial de alergias")
                }

                setAllergiesHistory(/* data.loquesea */)

            } catch (error) {
                setError(...error, { list: error.message })
            }
        }
    }, [])


    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }

        if (!formData.allergen) {
            newErrors.allergen = "Por favor, introduzca el desencadenante de su alergia"
            valid = false
        }

        if (formData.symptoms.length > 200) {
            newErrors.symptoms = "El valor máximo de caracteres es 200" //Actualizar con el valor máximo en la BD
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
            setAllergiesHistory([formData, ...allergiesHistory]) //Actualizamos el estado pero hace falta el mapeo

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
            setAllergiesHistory(allergiesHistory.filter((record)=> record.id !== recordId ))
            
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
                            <div className="alert alert-danger mb-4" role="alert">
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
                                            <tr key={data.id}>
                                                <td >{data.allergen}</td>
                                                <td >{data.symptoms}</td>
                                                <td >{data.severity}</td>
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