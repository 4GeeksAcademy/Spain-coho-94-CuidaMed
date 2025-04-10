import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import NavbarPrivate from "../components/NavbarPrivate"
import Submenu from "../components/Submenu"
import { Footer } from "../components/Footer"

// Base component that maintains the navbar and footer throughout the page and the scroll to top functionality.
export const LayoutPrivate = () => {
    return (
        <ScrollToTop>
            <NavbarPrivate />
            <Submenu />
                <Outlet />
            <Footer />
        </ScrollToTop>
    )
}