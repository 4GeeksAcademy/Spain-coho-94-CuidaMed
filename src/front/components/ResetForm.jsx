import React from "react"
import { useState } from "react"
import { useNavigate} from "react-router"


export default function RegisterForm({token}) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
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


  // Validación de contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria"
      valid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres"
      valid = false
    }

  // Validación de confirmar contraseña 
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Por favor, confirme la contraseña"
      valid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
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

      const response = await fetch(`${backendUrl}/api/auth/reset-password/${token}`, {
          method:"POST",
          headers:{
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
              password: formData.password
          })
      })

      if(!response.ok){
          throw new Error(data.error || "Error al restablecer contraseña")
      }

      const data = await response.json()
    
      navigate("/login") 
      
    } catch (error) {
      setErrors(error.message)
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
                  <label htmlFor="password" className="form-label">Nueva contraseña</label>
                  <input
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  placeholder="Crea una contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="mb-4">
                  <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
                  <input
                  type="password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirma tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  />
                  {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
              </div>

              <button type="submit" className="btn btn-primary w-100 mb-3 btn-blue" disabled={isLoading}>
                  {isLoading ? (
                  <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Restableciendo contraseña...
                  </>
                  ) : (
                  "Restablecer contraseña"
                  )}
              </button>
          </form>
      </>
      )
    
  }


