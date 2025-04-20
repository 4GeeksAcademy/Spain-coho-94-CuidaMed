import React from "react"
import { useState } from "react"
import { useNavigate} from "react-router"
import LoginGoogle from "./LoginGoogle"


export default function RegisterForm() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    email: "",
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

  // Validación del email
    if (!formData.email) {
      newErrors.email = "El email es obligatorio"
      
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Por favor, introduzca un email válido"
      
      
      valid = false
    }

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

      const response = await fetch(`${backendUrl}/api/auth/signup`, {
          method:"POST",
          headers:{
            "Content-Type": "application/json",
          },
          body:JSON.stringify({
              email: formData.email,
              password: formData.password,
              confirmarpassword: formData.confirmPassword,
          })
      })

      if (!response.ok) {
        if (response.status === 409) {
          setErrors((prev) => ({
            ...prev,
            email: "El correo electrónico ya está registrado",
          }))
        } else {
          setErrors((prev) => ({
            ...prev,
            form: data.error || "Error al registrar usuario",
          }))
        }
        return
      }

      const data = await response.json()

      localStorage.setItem("accessToken", data.access_token)
    
      navigate("/optionalform") 
      
    } catch (error) {
      console.log(error.message)
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
                  <label htmlFor="email" className="form-label">Email</label>
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

              <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
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
                      Creando tu cuenta...
                  </>
                  ) : (
                  "Crear cuenta"
                  )}
              </button>

              <div className="d-flex align-items-center my-3">
                  <hr className="flex-grow-1" />
                  <span className="px-2 text-muted small">O</span>
                  <hr className="flex-grow-1" />
              </div>

              <div className="d-flex justify-content-center">
                <LoginGoogle />
              </div>

              <div className="text-center mt-4">
                  <p className="text-muted mb-0">
                  ¿Ya tienes cuenta? <br/>
                  <a href="/login" className="text-decoration-none">
                    Entrar
                  </a>
                  </p>
              </div>
          </form>
      </>
      )
    
  }


