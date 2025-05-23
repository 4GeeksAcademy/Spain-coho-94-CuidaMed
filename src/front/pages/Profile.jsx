import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../components/DeleteModal";
import SuccessModal from "../components/SuccessModal";

const Profile = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        fullName: "",
        birthDate: undefined,
        phone: "",
        lastWeight: undefined,
        lastHeight: undefined,
        BMI: undefined,
        gender: undefined,
        bloodType: undefined,
        dietaryPreferences: "",
        physicalActivity: undefined,
    }
    )

    const [error, setError] = useState({
        form: "",
        fullName: "",
        birthDate: "",
        phone: "",
        lastWeight: "",
        lastHeight: "",
        BMI: "",
        gender: "",
        bloodType: "",
        dietaryPreferences: "",
        physicalActivity: "",
    });
    const [age, setAge] = useState(null)
    const [imc, setImc] = useState(null)
    const [loading, setLoading] = useState(true);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showUpModal, setShowUpModal] = useState(false)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const accessToken = localStorage.getItem("accessToken");

    const toISODateFormat = (fecha) => {
        if (fecha) {
            const [day, month, year] = fecha.split("-");
            return `${year}-${month}-${day}`;
        } else {
            return undefined
        }
    };

    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                const response = await fetch(`${backendUrl}/api/users/general-data`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`
                        }
                    });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Error al obtener tus datos de perfil")
                };
                setFormData(
                    {
                        fullName: data.general_data.name,
                        birthDate: toISODateFormat(data.general_data.birth_date.split(" ")[0]),
                        phone: data.general_data.phone,
                        lastWeight: data.general_data.last_weight,
                        lastHeight: data.general_data.last_height,
                        gender: data.general_data.gender,
                        bloodType: data.general_data.blood_type,
                        dietaryPreferences: data.general_data.dietary_preferences,
                        physicalActivity: data.general_data.physical_activity,
                    }
                );
            } catch (error) {
                setError({ ...error, list: error.message })
            }
        }
        fetchRecordData();
    }, [])
    // Calcular la edad
    useEffect(() => {
        if (formData.birthDate) {
            const birthDate = new Date(formData.birthDate);
            const today = new Date();

            if (!isNaN(birthDate.getTime()) && birthDate <= today) {
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())
                    ? age - 1
                    : age;
                setAge(finalAge);
            } else {
                setAge(null);
            }
        } else {
            setAge(null);
        }
    }, [formData.birthDate]);

    //Calcular IMC
    useEffect(() => {

        if (formData.lastHeight && formData.lastWeight) {


            const heightInMetersReplace = formData.lastHeight.toString().replace(',', '.');
            const weightInKgReplace = formData.lastWeight.toString().replace(',', '.');

            const heightInMeters = parseFloat(heightInMetersReplace);
            const weightInKg = parseFloat(weightInKgReplace);
            if (heightInMeters > 0 && weightInKg > 0) {
                const calculatedImc = weightInKg / (heightInMeters * heightInMeters);
                setImc(calculatedImc.toFixed(2));
            } else {
                setImc(null);
            }
        } else {
            setImc(null);
        }
    }, [formData.lastHeight, formData.lastWeight]);

    const validateForm = () => {

        let valid = true
        const newErrors = { ...error }

        if (!formData.fullName) {
            newErrors.fullName = "Por favor, introduzca su nombre"
            valid = false
        } else if (formData.fullName.trim().length < 6) {
            newErrors.fullName = "El nombre debe tener un mínimo de 6 caracteres";
            valid = false
        } else if (!/^[\p{L}\s'-]+$/u.test(formData.fullName)) {
            newErrors.fullName = "El nombre solo debe contener letras";
            valid = false
        }

        if (!formData.phone) {
            newErrors.phone = "Número de teléfono requerido";
            valid = false
        } else {
            const cleanPhone = formData.phone.replace(/\s/g, ''); // Esta línea elimina espacios para la validación
            if (!cleanPhone.startsWith("+")) {
                newErrors.phone = "El número debe comenzar con '+' (Ejemplo: +34222331144)";
                valid = false
            } else if (!/^\+\d{11}$/.test(cleanPhone)) {
                newErrors.phone = "El número debe tener 12 caracteres (Ejemplo: +34XXXXXXXXX)";
                valid = false
            }
        }
        if (!formData.birthDate) {
            newErrors.birthDate = "Fecha de nacimiento requerida";
            valid = false
        } else {
            const birthDate = new Date(formData.birthDate);
            const today = new Date();

            if (isNaN(birthDate.getTime())) {
                newErrors.birthDate = "Fecha inválida";
                valid = false
            } else if (birthDate > today) {
                newErrors.birthDate = "La fecha no puede ser en el futuro";
                valid = false
            } else {
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
                setAge(finalAge)
            }
        }
        if (formData.gender === "") {
            newErrors.gender = "Por favor selecciona una opción";
            valid = false
        }
        if (formData.lastHeight) {
            const heightValue = parseFloat(formData.lastHeight.toString().replace(',', '.'));//Me aseguro de las comas se transformen en punto para el parseFloat

            if (isNaN(heightValue) || heightValue <= 0 || heightValue > 3) {
                newErrors.height = "Ingresa una altura válida (entre 0 y 3 metros)";
                valid = false
            }
        }

        if (formData.lastWeight) {
            const weightValue = parseFloat(formData.lastWeight.toString().replace(',', '.'));

            if (isNaN(weightValue) || weightValue <= 0 || weightValue > 500) {
                newErrors.weight = "Ingresa un peso válido (entre 0 y 500 kg)";
                valid = false
            }
        }

        if (formData.dietaryPreferences) {
            if (formData.dietaryPreferences.trim() === "") {
                newErrors.dietaryPreferences = "No puedes completar esta sección sólo con espacios"
                valid = false
            } else if (formData.dietaryPreferences.length > 100) {
                newErrors.dietaryPreferences = "La respuesta no puede contener más de 100 caracteres"
                valid = false
            } else if (!/^[\p{L}\s,;.-]+$/u.test(formData.dietaryPreferences)) { // Permitir letras, espacios, comas, puntos, guiones y punto y coma
                newErrors.dietaryPreferences = "El campo solo debe contener letras";
                valid = false
            }
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

        return `${day}-${month}-${year}`;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return
        }
        setLoading(true);

        try {
            const formattedDate = formatDatetime(formData.birthDate);
            const response = await fetch(`${backendUrl}/api/users/general-data`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    name: formData.fullName || "",
                    birth_date: formData.birthDate || "",
                    phone: formData.phone || "",
                    gender: formData.gender || "",
                    last_weight: formData.lastWeight || "",
                    last_height: formData.lastHeight || "",
                    blood_type: formData.bloodType || "",
                    dietary_preferences: formData.dietaryPreferences || "",
                    physical_activity: formData.physicalActivity || "",
                })
            })

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Error al modificar el perfil");
            }

            setFormData(
                {
                    fullName: data.general_data.name,
                    birthDate: toISODateFormat(data.general_data.birth_date.split(" ")[0]),
                    phone: data.general_data.phone,
                    lastWeight: data.general_data.last_weight,
                    lastHeight: data.general_data.last_height,
                    gender: data.general_data.gender,
                    bloodType: data.general_data.blood_type,
                    dietaryPreferences: data.general_data.dietary_preferences,
                    physicalActivity: data.general_data.physical_activity,
                }
            );

            setShowSuccessModal(true)

        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleModal = () => {
        setShowUpModal(true)
    }

    function redirectToUserPage() {
        setShowSuccessModal(false);
        navigate('/profile') 
      }
    const handleSuccess = () => {
        setShowSuccessModal(true)
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/users/delete`,
                {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                }
            )
            if (!response.ok) throw new Error("Error al eliminar el usuario");

            localStorage.removeItem("accessToken")
            navigate("/signup")

        } catch (error) {
            setError({ ...error, list: error.message })
        }

    }
    return (
        <>
            <div className="row justify-content-center g-4 mt-2">
                <div className="col-md-8">
                    <div className="card ms-2 ">
                        <h5 className="card-header bg-primary text-white">Tu perfil</h5>
                        <div className="card-body">
                            {error.form && (
                                <div className="alert alert-danger mb-4" role="alert">
                                    {error.form}
                                </div>
                            )}
                            <form onSubmit={handleSubmit} className="row" noValidate>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="fullName" className="form-label">Nombre completo</label>
                                        <div className="mb-3">
                                            <input
                                                type="text"
                                                className={`form-control ${error.fullName ? 'is-invalid' : ''}`}
                                                id="fullName"
                                                name="fullName"
                                                aria-describedby="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                            />
                                            {error.fullName && <div className="invalid-feedback">{error.fullName}</div>}
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="birthDate" className="form-label">Fecha de nacimiento</label>
                                        <input
                                            type="date"
                                            className={`form-control ${error.birthDate ? 'is-invalid' : ''}`}
                                            id="birthDate"
                                            name="birthDate"
                                            value={formData.birthDate}
                                            onChange={handleChange}
                                        />
                                        {error.birthDate && <div className="invalid-feedback">{error.birthDate}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Teléfono</label>
                                        <input
                                            className={`form-control ${error.phone ? 'is-invalid' : ''}`}
                                            type="text"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                        {error.phone && <div className="invalid-feedback">{error.phone}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="gender" className="form-label ">
                                            Sexo
                                        </label>
                                        <select
                                            name="gender"
                                            id="gender"
                                            className="form-select"
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecciona una opción</option>
                                            <option value="F">Femenino</option>
                                            <option value="M">Masculino</option>
                                            <option value="NB">No Binario</option>
                                            <option value="O">Otro</option>
                                            <option value="NS/NC">Prefiero no decirlo</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="bloodType" className="form-label ">
                                            Grupo sanguíneo
                                        </label>
                                        <select
                                            name="bloodType"
                                            id="bloodType"
                                            className="form-select"
                                            value={formData.bloodType}
                                            onChange={handleChange}
                                        >
                                            <option value="">Selecciona tu grupo</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A−</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B−</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB−</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O−</option>

                                        </select>
                                    </div>
                                    <div className="mb-3">
                                    <label htmlFor="dietaryPreferences" className="form-label">Preferencias de dieta</label>
                                    <input
                                        className={`form-control ${error.dietaryPreferences ? 'is-invalid' : ''}`}
                                        type="text"
                                        id="dietaryPreferences"
                                        name="dietaryPreferences"
                                        value={formData.dietaryPreferences}
                                        onChange={handleChange}
                                    />
                                    {error.dietaryPreferences && <div className="invalid-feedback">{error.dietaryPreferences}</div>}
                                    </div>

                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label htmlFor="lastWeight" className="form-label">Último peso</label>
                                        <input
                                            className={`form-control ${error.lastWeight ? 'is-invalid' : ''}`}
                                            type="number"
                                            id="lastWeight"
                                            name="lastWeight"
                                            value={formData.lastWeight}
                                            onChange={handleChange}
                                            step="any"
                                        />
                                        {error.lastWeight && <div className="invalid-feedback">{error.lastWeight}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="lastHeight" className="form-label">Altura</label>
                                        <input
                                            className={`form-control ${error.lastHeight ? 'is-invalid' : ''}`}
                                            type="number"
                                            id="lastHeight"
                                            name="lastHeight"
                                            value={formData.lastHeight}
                                            onChange={handleChange}
                                            step="any"
                                        />
                                        {error.lastHeight && <div className="invalid-feedback">{error.lastHeight}</div>}
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="BMI" className="form-label">Índice de masa corporal (IMC)</label>
                                        <input
                                            className={`form-control ${error.BMI ? 'is-invalid' : ''}`}
                                            type="number"
                                            id="BMI"
                                            name="BMI"
                                            value={imc}
                                            onChange={handleChange}
                                            step="any"
                                            disabled
                                        />
                                        {imc && (
                                            <div className="alert alert-info mt-2 mb-2">
                                                <div className="d-flex align-items-center">
                                                    <div className="me-3">
                                                        <strong className="fs-5">IMC:</strong> {imc}
                                                    </div>
                                                    <div>
                                                        <span className={`badge ${imc < 18.5 ? "bg-warning" :
                                                                imc < 25 ? "bg-success" :
                                                                    imc < 30 ? "bg-warning" :
                                                                        "bg-danger"
                                                            } p-2`}>
                                                            {imc < 16 ? "Delgadez severa" :
                                                                imc < 17 ? "Delgadez moderada" :
                                                                    imc < 18.5 ? "Delgadez leve" :
                                                                        imc < 25 ? "Peso normal" :
                                                                            imc < 30 ? "Sobrepeso" :
                                                                                imc < 35 ? "Obesidad grado I" :
                                                                                    imc < 40 ? "Obesidad grado II" :
                                                                                        "Obesidad grado III"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <hr className="my-2" />
                                                <small>
                                                    El IMC es un indicador que relaciona el peso y la altura. Se considera saludable un IMC entre 18.5 y 24.9
                                                </small>
                                            </div>
                                            
                                        )}

                                    {error.BMI && <div className="invalid-feedback">{error.BMI}</div>}
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="physicalActivity" className="form-label ">
                                        Nivel de actividad física
                                    </label>
                                    <select
                                        name="physicalActivity"
                                        id="physicalActivity"
                                        className="form-select"
                                        value={formData.physicalActivity}
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecciona una opción</option>
                                        <option value="Sedentario">Sedentario</option>
                                        <option value="Leve">Leve</option>
                                        <option value="Moderado">Moderado</option>
                                        <option value="Intenso">Intenso</option>
                                        <option value="Atleta">Atleta</option>
                                    </select>
                                </div>
                        </div>
                        <div className="d-flex justify-content-end ">
                            <button type="button" className="btn btn-danger me-3" onClick={handleModal}>Eliminar perfil</button>
                            <button type="submit" className="btn btn-primary">Actualizar perfil</button>
                        </div>
                        <SuccessModal
                            showSuccessModal={showSuccessModal}
                            modalTitle={"¡Formulario enviado con éxito!"}
                            text={"Tus datos han sido actualizados correctamente."}
                            onRedirect={redirectToUserPage}
                        />
                        <DeleteModal
                            showDeleteModal={showUpModal}
                            modalTitle = "ELIMINAR USUARIO"
                            setShowDeleteModal={setShowUpModal}
                            errorMessage = "¡Advertencia!"
                            text = "¿Está seguro que desea eliminar el usuario y toda la información asociada a este? Esta acción no se podrá deshacer."
                            handleDelete = {handleDelete}
                            buttonText = "Eliminar usuario"


                        />


                    </form>

                </div>
            </div>
        </div >

            </div >
        </>
    )

}

export default Profile