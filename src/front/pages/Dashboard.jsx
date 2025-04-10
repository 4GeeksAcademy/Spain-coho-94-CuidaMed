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
        currentMedication: [{medication_name: "paracetamol", dosage_instructions: "Una por dia"}]
    })
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchInfo = async () => {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "";

            const accessToken = localStorage.getItem("accessToken")

            try {
                setIsLoading(true)
                const response = await fetch(`${backendUrl}/api/dashboard`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + accessToken
                        }
                    });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Error al acceder al area privada");
                }

                setDashboardInfo({
                    lastBloodPressure: data.last_blood_pressure || undefined,
                    lastGlucose: data.last_glucose || undefined,
                    lastWeight: data.last_weight || undefined,
                    lastEmergencyContact: data.last_emergency_contact || undefined,
                    currentMedication: data.current_medication || []
                })

            } catch (error) {
                setError(error.message)

            } finally {
                setIsLoading(false)
            }
        }

        fetchInfo()

    }, [])

    return (
        <>
            {/*<LayoutPrivate />*/}
            <div className="background-pattern"></div>
            <div className="container">
                <h1 className="mb-4 mt-4">Bienvenido a CuidaMed Usuario</h1>

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