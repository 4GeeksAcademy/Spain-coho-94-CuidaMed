import { Outlet } from "react-router-dom/dist";
import { useState, useEffect } from "react";
import ScrollToTop from "../components/ScrollToTop";
import NavbarPrivate from "../components/NavbarPrivate";
import Submenu from "../components/Submenu";
import { Footer } from "../components/Footer";
import ErrorModal from "../components/ErrorModal";

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const LayoutPrivate = () => {
  // comprobar que el token existe, mostrar modal avisando que necesita iniciar sesión para estar aquí y devolver al usuario al login.
  const [showModalToken, setShowModalToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setShowModalToken(true);
    }
  }, []);

  return (
    <>
      <ScrollToTop>
        <NavbarPrivate />
        <Submenu />
        <Outlet />
        <Footer />
      </ScrollToTop>

      {showModalToken && (
        <ErrorModal
          showErrorModal={showModalToken}
          modalTitle="No puedes entrar aquí"
          setShowErrorModal={setShowModalToken}
          errorMessage="Solo usuarios logueados pueden entrar en esta página"
          modalNavigate="login"
          buttonText="Iniciar sesión"
        />
      )}
    </>
  );
};
