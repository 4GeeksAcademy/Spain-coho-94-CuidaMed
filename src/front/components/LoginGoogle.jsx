import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useState } from "react"
import { useNavigate } from "react-router"

const LoginGoogle = () => {
    const navigate = useNavigate()
    const [errors, setErrors] = useState("")

    const handleSuccess = async (credentialResponse) => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "";


            const response = await fetch(`${backendUrl}/api/auth/google-login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });

            if (!response.ok) {
                throw new Error("Error en la autenticación de datos");
            }

            const data = await response.json();

            localStorage.setItem("accessToken", data.access_token);

            if (data.new_user) {
                navigate("/optionalform")
            } else {
                navigate("/dashboard")
            }


        } catch (error) {
            console.log(error.message)
            setErrors(error.message)
        }
    }


    return (
        <div className="form-group">
            
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                    setErrors("Error al iniciar sesión con Google");
                }}
                className={errors ? "is-invalid" : ""}
            />
             
            {errors && <div className="invalid-feedback d-block">{errors}</div>}
        
        
        </div>

    );
}
export default LoginGoogle