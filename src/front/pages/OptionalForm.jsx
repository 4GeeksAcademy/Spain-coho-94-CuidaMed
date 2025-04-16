import React from "react";
import { useState, useEffect } from "react";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import ProgressBar from "../components/ProgressBar";
import { useNavigate} from "react-router-dom"

const totalSteps = 3;

const sexOptions = [
  { value: "", label: "Selecciona una opción" },
  { value: "GENDER_FEMALE", label: "Femenino" },
  { value: "GENDER_MALE", label: "Masculino" },
  { value: "GENDER_NONBINARY", label: "No Binario" },
  { value: "GENDER_OTHER", label: "Otro" },
  { value: "GENDER_NONE", label: "Prefiero no decirlo" }
];

const bloodTypeOptions = [
  { value: "", label: "Selecciona una opción" },
  { value: "BLOOD_A_POSITIVE", label: "A+" },
  { value: "BLOOD_A_NEGATIVE", label: "A-" },
  { value: "BLOOD_B_POSITIVE", label: "B+" },
  { value: "BLOOD_B_NEGATIVE", label: "B-" },
  { value: "BLOOD_AB_POSITIVE", label: "AB+" },
  { value: "BLOOD_AB_NEGATIVE", label: "AB-" },
  { value: "BLOOD_O_POSITIVE", label: "O+" },
  { value: "BLOOD_O_NEGATIVE", label: "O-" }
];

const physicalActivityOptions = [
  { value: "", label: "Selecciona una opción" },
  { value: "ACTIVITY_SEDENTARY", label: "Sedentario" },
  { value: "ACTIVITY_LIGHT", label: "Leve" },
  { value: "ACTIVITY_MODERATE", label: "Moderado" },
  { value: "ACTIVITY_INTENSE", label: "Intenso" },
  { value: "ACTIVITY_ATHLETE", label: "Atleta" },
]

function OptionalForm() {
  
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
  const [redirectTimer, setRedirectTimer] = useState(null);
  const navigate = useNavigate();

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

      const heightInMetersReplace = formData.height.toString().replace(',', '.');
      const weightInKgReplace = formData.weight.toString().replace(',', '.');

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
        } else if (!/^[\p{L}\s'-]+$/u.test(formData.userName)) {// Este regex incluye letras de cualquier idioma, espacios, apóstrofes y guiones
          newErrors.userName = "El nombre solo debe contener letras";
        }
        if (!formData.phone) {
          newErrors.phone = "Número de teléfono requerido";
        } else {
          const cleanPhone = formData.phone.replace(/\s/g, ''); // Esta línea elimina espacios para la validación
          if (!cleanPhone.startsWith("+")) {
            newErrors.phone = "El número debe comenzar con '+' (Ejemplo: +34222331144)";
          } else if (!/^\+\d{11}$/.test(cleanPhone)) {
            newErrors.phone = "El número debe tener 12 caracteres (Ejemplo: +34XXXXXXXXX)";
          }
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
        if (formData.height) {
          const heightValue = parseFloat(formData.height.toString().replace(',', '.'));//Me aseguro de las comas se transformen en punto para el parseFloat

          if (isNaN(heightValue) || heightValue <= 0 || heightValue > 3) {
            newErrors.height = "Ingresa una altura válida (entre 0 y 3 metros)";
          }
        }

        if (formData.weight) {
          const weightValue = parseFloat(formData.weight.toString().replace(',', '.'));

          if (isNaN(weightValue) || weightValue <= 0 || weightValue > 500) {
            newErrors.weight = "Ingresa un peso válido (entre 0 y 500 kg)";
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
      } else if (!/^[\p{L}\s,;.-]+$/u.test(formData.dietaryPreference)) { // Permitir letras, espacios, comas, puntos, guiones y punto y coma
        newErrors.dietaryPreference = "El campo solo debe contener letras";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFinalStep(e)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
      const accessToken = localStorage.getItem("accessToken");

      const formattedData = {
        name: formData.userName,
        birth_date: formData.birthDate,
        phone: formData.phone,
        gender: formData.sex,
        last_weight: formData.weight ? parseFloat(formData.weight.replace(',', '.')) : null,
        last_height: formData.height ? parseFloat(formData.height.replace(',', '.')) : null,
        BMI: imc ? parseFloat(imc) : null,
        blood_type: formData.bloodType || null,
        dietary_preferences: formData.dietaryPreference || null,
        physical_activity: formData.physicalActivity || null
      };

      const response = await fetch(`${backendUrl}/api/users/general-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },

        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        throw new Error('Error al crear el usuario');
      }

      const data = await response.json();
      console.log("Respuesta existosa", data);

      setShowSuccessModal(true);

      const redirectTimer = setTimeout(() => {
        redirectToUserPage();
      }, 5000);

      setRedirectTimer(redirectTimer);

    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || "Ha ocurrido un error al procesar tu solicitud");
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false)
    }
  };

  function redirectToUserPage() {
    if (redirectTimer) {
      clearTimeout(redirectTimer);
    }
    

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
    setImc(null);

    navigate('/dashboard') 
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

              <form>
                <div className="mb-4">
                  <label htmlFor="height" className="form-label fs-5">
                    Altura (mt)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    className={`form-control form-control-lg ${errors.height ? "is-invalid" : ""}`}
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="Ejemplo: 1.75"
                    aria-describedby="heightHelp"
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
                    type="text"
                    inputMode="decimal"
                    className={`form-control form-control-lg ${errors.weight ? "is-invalid" : ""}`}
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="Ejemplo: 70"
                    aria-describedby="weightHelp"
                  />
                  {errors.weight && (
                    <div className="invalid-feedback ms-4">{errors.weight}</div>
                  )}
                </div>

                {imc && (
                  <div className="alert alert-info mb-4">
                    <div className="d-flex align-items-center">
                      <div className="me-3">
                        <strong className="fs-5">IMC:</strong> {imc}
                      </div>
                      <div>
                        <span className={`badge ${
                          imc < 18.5 ? "bg-warning" :
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

              <form>
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
      <ProgressBar
        step={step}
        totalSteps={totalSteps}
      />
      <SuccessModal
        showSuccessModal={showSuccessModal}
        modalTitle={"¡Formulario enviado con éxito!"}
        text={"Tus datos han sido registrados correctamente."}
        onRedirect={redirectToUserPage}
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
