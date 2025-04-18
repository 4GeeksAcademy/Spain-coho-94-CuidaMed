import React from "react"
import { useState } from "react"


const ForgotForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    infoMessage: false,
  })
  const [errors, setErrors] = useState({
    email: "",
    form: "",
  })

  // Creando una función genérica para todos los campos
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

  // Para borrar los errores al corregir el campo
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

  // Validación del email
    if (!formData.email) {
      newErrors.email = "El email es obligatorio"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Por favor, introduzca un email válido"
      valid = false
    }
    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {return}
    
    setIsLoading(true)

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

      /*const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
          method:"POST",
          headers:{
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
              email: formData.email,
          })
      })

      if(!response.ok){
          throw new Error("Error al enviar correo de recuperación de contraseña")
      }

      const data = await response.json()*/

      setFormData({...formData, infoMessage: true})
      
    } catch (error) {
      setErrors({...errors, form:error.message})
    } finally {
      setIsLoading(false)
    }
  }

  
  return (
    <>
        {errors.form && (
          <div className="alert alert-danger mb-4" role="alert">
            {errors.form}
          </div>
        )}

          <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email:</label>
                  <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  placeholder="email@ejemplo.com"
                  value={formData.email}
                  onChange={handleChange}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3 btn-blue" disabled={isLoading}>
                  {isLoading ? (
                  <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Cargando...
                  </>
                  ) : (
                  "Reestablecer contraseña"
                  )}
              </button>

              {formData.infoMessage == true &&
                <div className="bg-white shadow-sm rounded p-4 text-center" style={{ maxWidth: "400px", margin: "auto" }}>
                    <div className="d-flex flex-column align-items-center text-primary mb-2">
                        <i className="fas fa-envelope-open-text fa-lg mb-3"></i>
                        <h6 className="fw-bold mb-0">Revisa tu bandeja de entrada</h6>
                    </div>
                    <p className="text-muted small m-0">
                        Te hemos enviado un correo con un enlace para restablecer tu contraseña. Si no lo encuentras, revisa tu carpeta de spam o correo no deseado.
                    </p>
                </div>
                }
              <div className="d-flex align-items-center my-2">
                  <hr className="flex-grow-1" />
                  <span className="px-2 text-muted small">O</span>
                  <hr className="flex-grow-1" />
              </div>

              <div className="w-100 d-flex justify-content-center">
                <a href="/login" className="text-decoration-none">Volver al login</a>
              </div>

              <div className="text-center mt-2">
                  <p className="text-muted mb-0">
                  ¿No tienes cuenta? <br/>
                  <a href="/signup" className="text-decoration-none">
                    Registrate
                  </a>
                  </p>
              </div>
          </form>
      </>
      )
    
  }

export default ForgotForm