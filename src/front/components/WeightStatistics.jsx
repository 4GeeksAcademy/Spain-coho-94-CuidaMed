import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Graphics from '../components/Graphics';

const WeightStatistics = () => {
    const [chartType, setChartType] = useState('area');
    const [patientData, setPatientData] = useState([]);
    const [error, setError] = useState(null);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const accessToken = localStorage.getItem("accessToken");

    const formatDate = (dateString) => {
        try{
            const [datePart, timePart] = dateString.split(' ');
            const [day, month, year] = datePart.split('-');
            return `${day}/${month}/${year}`;
        } catch (e) {
            console.error("Error al formatear la fecha", e);
            return dateString
        }
    };

const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

    useEffect(() => {
        const fetchRecordData = async () => {
            try {
                
                const response = await fetch(`${backendUrl}/api/records/weight`,
                    {
                        method: 'GET',
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${accessToken}`
                        }
                    });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "Error al obtener el historial de registros")
                }

                setPatientData(data.map(item => 
                    ({
                        id:item.id,
                        peso:item.weight,
                        date: formatDate(item.manual_datetime), 
                    })
                ));

            } catch (error) {
                setError({...error, list: error.message })
            }
        }
        fetchRecordData();
    }, [])

    return (
        <div className="card h-100">
            <div className="card-header bg-danger text-white">
                <h5 className="card-title mb-0">Gráfico de peso</h5>
            </div>
            <div className="card-body" style={{"maxHeight": "250px", "overflow": "auto"}} ref={scrollRef}>
            <Graphics
                    chartType={chartType}
                    setChartType={setChartType}
                    patientData={patientData}
                    dataKeys={['peso']}
                    dataType={"weight"}
                    options={"no-show"}
                    />
            </div>
        </div>
    )
}

export default WeightStatistics