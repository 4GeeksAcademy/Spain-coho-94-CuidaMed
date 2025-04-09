import React from "react";
import { useState, useEffect } from "react";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import useGlobalReducer from "../hooks/useGlobalReducer";

const totalSteps = 3;

const sexOptions = [
  { value: "", label: "Selecciona una opción" },
  { value: "F", label: "Femenino" },
  { value: "M", label: "Masculino" },
  { value: "NB", label: "No Binario" },
  { value: "O", label: "Otro" },
  { value: "NS/NC", label: "Prefiero no decirlo" }
];

const bloodTypeOptions = [
  { value: "", label: "Selecciona una opción" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" }
];

const physicalActivityOptions = [
  { value: "", label: "Selecciona una opción" },
  { value: "sedentary", label: "Sedentario" },
  { value: "light", label: "Leve" },
  { value: "moderate", label: "Moderado" },
  { value: "intense", label: "Intenso" },
  { value: "athlete", label: "Atleta" },
]

function OptionalForm() {
  const { store, dispatch } = useGlobalReducer();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userName: "",
    phone: "",
    birthDate: "",
    sex: "",
    height: "",
    weight: "",
    bloodType: "",
    dietaryPreference: "",
    physicalActivity: "",
  });
  const [errors, setErrors] = useState({});
  const [age, setAge] = useState(null)
  const [imc, setImc] = useState(null)

  //Construyo estados para los modales
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = parseFloat(formData.height);
      const weightInKg = parseFloat(formData.weight);

      if (heightInMeters > 0 && weightInKg > 0) {
        const calculatedImc = weightInKg / (heightInMeters * heightInMeters);
        setImc(calculatedImc.toFixed(2));
      } else {
        setImc(null);
      }
    } else {
      setImc(null);
    }
  }, [formData.height, formData.weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const nextStep = (e) => {
    if (validateStep(e)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const getStepImage = () => {
    switch (step) {
      case 1:
        return "src/front/assets/img/StepOneOptionalForm.jpg";
      case 2:
        return "src/front/assets/img/StepTwoOptionalForm.png";
      case 3:
        return "src/front/assets/img/StepThreeOptionalForm.jpg";
      default:
        return "https://placehold.co/600x400";
    }
  };

  function validateStep(e) {
    e.preventDefault();
    e.stopPropagation();

    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.userName) {
          newErrors.userName = "Necesitamos tu nombre";
        } else if (formData.userName.trim().length < 6) {
          newErrors.userName = "El nombre debe tener un mínimo de 6 caracteres";
        } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(formData.userName)) {
          newErrors.userName = "El nombre solo debe contener letras";
        }
        if (!formData.phone) {
          newErrors.phone = "Número de teléfono requerido";
        } else if (!formData.phone.startsWith("+")) {
          newErrors.phone = "El número debe comenzar con '+' (Ejemplo: +34222331144)";
        } else if (formData.phone.length !== 12) {
          newErrors.phone = "El número debe tener 12 caracteres (Ejemplo: +34222331144)";
        }
        if (!formData.birthDate) {
          newErrors.birthDate = "Fecha de nacimiento requerida";
        } else {
          const birthDate = new Date(formData.birthDate);
          const today = new Date();

          if (isNaN(birthDate.getTime())) {
            newErrors.birthDate = "Fecha inválida";
          } else if (birthDate > today) {
            newErrors.birthDate = "La fecha no puede ser en el futuro";
          } else {
            const age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const finalAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate()) ? age - 1 : age;
            setAge(finalAge)
          }
        }
        if (formData.sex === "") newErrors.sex = "Por favor selecciona una opción";
        break;
      case 2:
        if (formData.height && (isNaN(formData.height) || formData.height <= 0 || formData.height > 3)) {
          newErrors.height = "Ingresa una altura válida (entre 0 y 3 metros)";
        }

        if (formData.weight && (isNaN(formData.weight) || formData.weight <= 0 || formData.weight > 500)) {
          newErrors.weight = "Ingresa un peso válido (entre 0 y 500 kg)";
        }
        break;
      case 3:
        if (formData.dietaryPreference) {
          if (formData.dietaryPreference.trim() === "") {
            newErrors.dietaryPreference = "No puedes completar esta sección sólo con espacios"
          } else if (formData.dietaryPreference.length > 100) {
            newErrors.dietaryPreference = "La respuesta no puede contener más de 100 caracteres"
          } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(formData.dietaryPreference)) {
            newErrors.dietaryPreference = "El campo solo debe contener letras";
          }
        }
        break;
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0; // Esto lo que hace es que si newErrors está vacío devuelve true y si no está vacío devuelve false
  }

  const validateFinalStep = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newErrors = {};

    if (formData.dietaryPreference) {
      if (formData.dietaryPreference.trim() === "") {
        newErrors.dietaryPreference = "No puedes completar esta sección sólo con espacios"
      } else if (formData.dietaryPreference.length > 100) {
        newErrors.dietaryPreference = "La respuesta no puede contener más de 100 caracteres"
      } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(formData.dietaryPreference)) {
        newErrors.dietaryPreference = "El campo solo debe contener letras";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowSuccessModal(false);
    if(!validateFinalStep(e)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try{
      const response = await fetch('URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.token}`
        },

        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el usuario'); 
      }

      const data = await response.json();
      console.log("Respuesta existosa", data);

      setShowSuccessModal(true);

      setTimeout(() => {
        setShowSuccessModal(false);
        setStep(1);
      setErrors({});
      setFormData({
        userName: "",
        phone: "",
        birthDate: "",
        sex: "",
        height: "",
        weight: "",
        bloodType: "",
        dietaryPreference: "",
        physicalActivity: "",
      });
      setAge(null);
      setImc(null)
      }, 3000)

      
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || "Ha ocurrido un error al procesar tu solicitud");
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false)
    }
  }

  function renderSteps() {
    switch (step) {
      case 1:
        return (
          <div className="p-4 p-md-5">
            <h2 className="display-6 mb-4 fw-bold">Información Personal</h2>
            <p className="lead mb-5">
              Registra tu información personal para continuar
            </p>

            <form>
              <div className="mb-4">
                <label htmlFor="userName" className="form-label fs-5">
                  Nombre completo<span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control form-control-lg ${errors.userName ? "is-invalid" : ""}`}
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Escribe tu nombre completo"
                />
                {errors.userName && (
                  <div className="invalid-feedback ms-4">{errors.userName}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="form-label fs-5">
                  Número telefónico<span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  className={`form-control form-control-lg ${errors.phone ? "is-invalid" : ""}`}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Escribe tu número de teléfono Ej. +34666554488"
                />
                {errors.phone && (
                  <div className="invalid-feedback ms-4">{errors.phone}</div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="birthDate" className="form-label fs-5">
                  Fecha de Nacimiento<span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control form-control-lg ${errors.birthDate ? "is-invalid" : ""}`}
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
                {errors.birthDate && (
                  <div className="invalid-feedback ms-4">{errors.birthDate}</div>
                )}
                {age && <div className="alert alert-info mb-4 mt-3"><strong>Edad:</strong> {age} años</div>}
              </div>

              <div className="mb-4">
                <label htmlFor="sex" className="form-label fs-5">
                  Sexo<span className="text-danger">*</span>
                </label>
                <select
                  className={`form-select form-select-lg ${errors.sex ? "is-invalid" : ""}`}
                  name="sex"
                  id="sex"
                  value={formData.sex}
                  onChange={handleChange}
                >
                  {sexOptions.map(option => {
                    return (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>)
                  })}
                </select>
                {errors.sex && (
                  <div className="invalid-feedback ms-4">{errors.sex}</div>
                )}
              </div>

              <div className="d-flex justify-content-end mt-5">
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary btn-lg"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        );
      case 2:
        return (
          <>
            <div className="p-4 p-md-5">
              <h2 className="display-6 mb-4 fw-bold">Información Médica</h2>
              <p className="lead mb-5">
                Proporciona tus datos de salud básicos
              </p>

              <form action="">
                <div className="mb-4">
                  <label htmlFor="height" className="form-label fs-5">
                    Altura (mt)
                  </label>
                  <input
                    type="number"
                    className={`form-control form-control-lg ${errors.height ? "is-invalid" : ""}`}
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Ejemplo: 1.75"
                  />
                  {errors.height && (
                    <div className="invalid-feedback ms-4">{errors.height}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="weight" className="form-label fs-5">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    className={`form-control form-control-lg ${errors.weight ? "is-invalid" : ""}`}
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Ejemplo: 70"
                  />
                  {errors.weight && (
                    <div className="invalid-feedback ms-4">{errors.weight}</div>
                  )}
                </div>

                {imc && (
                  <div className="alert alert-info mb-4">
                    <strong>IMC:</strong> {imc} - {
                      imc < 18.5 ? "Bajo peso" :
                        imc < 25 ? "Peso normal" :
                          imc < 30 ? "Sobrepeso" :
                            "Obesidad"
                    }
                  </div>
                )}

                <div className="mb-4">
                  <label htmlFor="bloodType" className="form-label fs-5">
                    Tipo de Sangre
                  </label>
                  <select
                    name="bloodType"
                    id="bloodType"
                    className="form-select form-select-lg"
                    value={formData.bloodType}
                    onChange={handleChange}
                  >
                    {bloodTypeOptions.map(option => {
                      return (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>)
                    })}
                  </select>
                </div>
                <div className="d-flex justify-content-between mt-5">
                  <button
                    className="btn btn-outline-primary btn-lg"
                    type="button"
                    onClick={prevStep}
                  >
                    Atrás
                  </button>
                  <button
                    className="btn btn-primary btn-lg"
                    type="button"
                    onClick={nextStep}
                  >
                    Continuar
                  </button>
                </div>
              </form>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="p-4 p-md-5">
              <h2 className="display-6 mb-4 fw-bold">Estilo de Vida</h2>
              <p className="lead mb-5">
                Cuéntanos sobre tus preferencias y hábitos
              </p>

              <form action="">
                <div className="mb-4">
                  <label
                    htmlFor="dietaryPreference"
                    className="form-label fs-5"
                  >
                    Preferencias de Dieta
                  </label>
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.dietaryPreference ? "is-invalid" : ""}`}
                    id="dietaryPreference"
                    name="dietaryPreference"
                    value={formData.dietaryPreference}
                    onChange={handleChange}
                    placeholder="Escribe tu preferencias de dieta Ej. Vegetariano"
                  />
                  {errors.dietaryPreference && (
                    <div className="invalid-feedback ms-4">{errors.dietaryPreference}</div>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="physicalActivity" className="form-label fs-5">
                    Nivel de Actividad Física
                  </label>
                  <select
                    name="physicalActivity"
                    id="physicalActivity"
                    className="form-select form-select-lg"
                    value={formData.physicalActivity}
                    onChange={handleChange}
                  >
                    {physicalActivityOptions.map(option => {
                      return (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>)
                    })}
                  </select>
                </div>

                <div className="d-flex justify-content-between mt-5">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn btn-outline-primary btn-lg"
                  >
                    Atrás
                  </button>
                  <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmit}
                  disabled={isSubmitting}>
                   {isSubmitting ? 'Enviando...' : "Enviar"}
                  </button>
                </div>
              </form>
            </div>
          </>
        );
    }
  }
  const ProgressBar = () => {
    return (
      <div className="text-center py-2 border-top">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center mb-3 mt-2">
            <span className="fw-medium me-3">Paso {step} de {totalSteps}</span>
            <div
              className="progress"
              style={{ height: "10px", width: "300px" }}
            >
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${(step / 3) * 100}%` }}
                aria-valuenow={(step / 3) * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="vh-100 d-flex flex-column">
      <div className="flex-grow-1 d-flex">
        <div className="w-50 overflow-auto position-relative">
          <div
            className="background-pattern"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "#eaf4fb",
              backgroundImage: "url(src/front/assets/img/patronfondo.png)",
              backgroundRepeat: "repeat",
              backgroundSize: "auto",
              opacity: 0.2,
              zIndex: -1,
            }}
          ></div>
          <div className="container-fluid py-4 max-width-md mx-auto">
            {renderSteps()}
          </div>
        </div>

        <div className="w-50 bg-info position-relative">
          <img
            src={getStepImage()}
            alt={`Imagen paso ${step}`}
            className="w-100 h-100 object-fit-cover"
          />
        </div>
      </div>
      <ProgressBar />
      <SuccessModal 
        showSuccessModal={showSuccessModal}
        modalTitle={"¡Formulario enviado con éxito!"}
        text={"Tus datos han sido registrados correctamente."}
      />
      <ErrorModal
      showErrorModal={showErrorModal}
      modalTitle={"Error al enviar el formulario"}
      setShowErrorModal={setShowErrorModal}
      errorMessage={errorMessage}
      text={"Por favor, inténtalo de nuevo más tarde."}
      />
    </div>
  );
}

export default OptionalForm;
