import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router"

const LoginGoogle = () => {
    const navigate = useNavigate()
    return (
        <GoogleLogin
            onSuccess={async (credentialResponse) => {
                try {
                    const decoded = jwtDecode(credentialResponse.credential);
                    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";


                    const response = await fetch(`${backendUrl}/api/auth/google-login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: credentialResponse.credential }),
                    });

                    if (!response.ok) {
                        throw new Error("Error en la autenticación con el backend");
                    }

                    const data = await response.json();

                    localStorage.setItem("access_token", data.access_token);

                    if (data.new_user) {
                        navigate("/optionalform")
                    } else {
                        navigate("/dashboard")
                    }


                } catch (error) {
                    console.error("❌ Fallo al autenticar:", error.message);
                }
            }}
            onError={() => {
                console.log("❌ Error al iniciar sesión con Google");
            }}
        />
    );
}
export default LoginGoogle