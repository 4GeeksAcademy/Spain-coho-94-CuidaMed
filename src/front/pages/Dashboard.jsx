import React from "react";
import { Link } from 'react-router-dom';
import { LayoutPrivate } from "./LayoutPrivate";
import RecentRecords from "../components/RecentRecords";
import WeightStatistics from "../components/WeightStatistics";
import CurrentMedication from "../components/CurrentMedication";
import EmergencyContact from "../components/EmergencyContact";


const Dashboard = () => {
    return (
        <>
            {/*<LayoutPrivate />*/}
            <div className="background-pattern"></div>
            <div className="container">
                <h1 className="mb-4 mt-4">Bienvenido a CuidaMed Usuario</h1>

                <div className="row g-4">
                    <div className="col-md-6">
                        <RecentRecords/>
                    </div>

                    <div className="col-md-6">
                        <WeightStatistics/>
                    </div>
                    <div className="col-md-6">
                        <CurrentMedication/>
                    </div>
                    <div className="col-md-6">
                        <EmergencyContact/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard