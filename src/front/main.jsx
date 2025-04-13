import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'  // Global styles for your application
import { RouterProvider } from "react-router-dom";  // Import RouterProvider to use the router
import { router } from "./routes";  // Import the router configuration
import { StoreProvider } from './hooks/useGlobalReducer';  // Import the StoreProvider for global state management
import { BackendURL } from './components/BackendURL';
import { GoogleOAuthProvider } from '@react-oauth/google';

const Main = () => {
    
    if(! import.meta.env.VITE_BACKEND_URL ||  import.meta.env.VITE_BACKEND_URL == "") return (
        <React.StrictMode>
              <BackendURL/ >
        </React.StrictMode>
        );
    return (
        <React.StrictMode>  
            {/* Envolviendo la aplicación en el componente de google */}
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                {/* Provide global state to all components */}
                <StoreProvider> 
                    {/* Set up routing for the application */} 
                    <RouterProvider router={router}>
                    </RouterProvider>
                </StoreProvider>
            </GoogleOAuthProvider>
        </React.StrictMode>
    );
}

// Render the Main component into the root DOM element.
ReactDOM.createRoot(document.getElementById('root')).render(<Main />)
