import RegisterForm from "../components/RegisterForm"
import logo from "/src/front/assets/img/Logo.png"
import backgroundImage from "/src/front/assets/img/medical-enrollment-form-document-medicare-concept.jpeg"


const SignUp = () => {
  return (
    <div className="d-flex align-items-center justify-content-center py-5 min-vh-100" style={{backgroundImage:`linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)),url(${backgroundImage})`,    backgroundSize: "cover",
      backgroundPosition: "center", backgroundRepeat: "no-repeat"}}>
      <div className="card border-0 shadow-lg" style={{ maxWidth: "450px", width: "100%" }}>
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h1><img src={logo} className="img-fluid" /></h1>
            <p className="text-muted">¡Crea tu cuenta para empezar a cuidarte!</p>
          </div>
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default SignUp