import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { LayoutPrivate } from "./LayoutPrivate";
import RecentRecords from "../components/RecentRecords";
import WeightStatistics from "../components/WeightStatistics";
import CurrentMedication from "../components/CurrentMedication";
import EmergencyContact from "../components/EmergencyContact";


const Dashboard = () => {

    const [dashboardInfo, setDashboardInfo] = useState({
        lastBloodPressure: {},
        lastGlucose: {},
        lastWeight: {},
        lastEmergencyContact: {},
        currentMedication: []
    })
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        
        const fetchInfo = async () => {
            
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
            const accessToken = localStorage.getItem("accessToken");
            
            // Verificar si el token existe
            if (!accessToken) {
                setError("No se encontró el token de acceso. Por favor inicie sesión nuevamente.");
                
                return;
            }

            
            try {
                
                setIsLoading(true);
                setError(""); // Limpiar errores anteriores
                
                const response = await fetch(`${backendUrl}/api/users/dashboard`, { // Añadido '/' antes de api
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    }
                });

                const data = await response.json();
                
                if (!response.ok) {
                    // Manejo específico de errores basado en códigos
                    if (response.status === 422) {
                        throw new Error("Error de validación: " + (data.msg || data.error || "Datos no procesables"));
                    } else if (response.status === 401) {
                        // Sesión expirada o token inválido
                        localStorage.removeItem("accessToken"); // Limpiar token inválido
                        throw new Error("Sesión expirada o no autorizada. Por favor inicie sesión nuevamente.");
                    } else {
                        throw new Error(data.msg || data.error || "Error al acceder al área privada");
                    }
                }
                
                // Transformar datos a camelCase y manejar valores nulos
                setDashboardInfo({
                    lastBloodPressure: data.last_blood_pressure || null,
                    lastGlucose: data.last_glucose || null,
                    lastWeight: data.last_weight || null,
                    lastEmergencyContact: data.last_emergency_contact || null,
                    currentMedication: Array.isArray(data.current_medication) ? data.current_medication : []
                });
            } catch (error) {
                console.error("Error al obtener datos del dashboard:", error);
                setError(error.message || "Error al comunicarse con el servidor");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchInfo();
    }, []);

    return (
        <>
            
            <div className="background-pattern"></div>
            <div className="container">
                <h1 className="mb-4 mt-4">Bienvenido a CuidaMed</h1>

                {isLoading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Cargando area privada...
                    </>
                ) : (
                    <div className="row g-4">
                        <div className="col-md-6">
                            <RecentRecords
                                lastBloodPressure={dashboardInfo.lastBloodPressure}
                                lastGlucose={dashboardInfo.lastGlucose}
                                lastWeight={dashboardInfo.lastWeight}
                            />
                        </div>

                        <div className="col-md-6">
                            <WeightStatistics />
                        </div>
                        <div className="col-md-6">
                            <CurrentMedication currentMedication={dashboardInfo.currentMedication} />
                        </div>
                        <div className="col-md-6">
                            <EmergencyContact lastEmergencyContact={dashboardInfo.lastEmergencyContact} />
                        </div>
                    </div>
                )}


            </div>
        </>
    )
}

export default Dashboard