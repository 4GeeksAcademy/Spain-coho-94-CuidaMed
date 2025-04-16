import React, { useEffect } from 'react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Graphics from '../components/Graphics';

const MedicalDataChart = () => {
    const { dataType } = useParams();
    const navigate = useNavigate();

    const [chartType, setChartType] = useState('line');
    const [patientData, setPatientData] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    //Validación para dataType
    useEffect(() => {
        const validTypes = ['glucose', 'weight', 'bloodpressure', 'pulse'];
        if(!validTypes.includes(dataType)) {
            navigate('/statistics/glucose')// redirigir a un tipo válido si el dataType entregado no es válido
        }
    },[dataType, navigate]);
    
    // Formatear la fecha desde el formato del backend al formato del gráfico
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

    //Función generica para hacer el fetch de datos
    const fetchData = async (endpoint) => {
        setIsLoading(true);
        setError(null);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
            const accessToken = localStorage.getItem("accessToken");

            if(!accessToken) {
                throw new Error('No hay token de autenticación');
            }

            const response = await fetch(`${backendUrl}/api/records/${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            
            if (!response.ok) {
                throw new Error(`Error al obtener datos: ${response.statusText}`);
            }

            const data = await response.json()
            console.log(data)
            return data;
            

        } catch (error) {
            setError(error.message);
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            let formattedData = [];

            switch (dataType) {
                case 'glucose':
                    const glucoseData = await fetchData('glucose');
                    formattedData = glucoseData.map(record => {
                        return {
                            date: formatDate(record.manual_datetime),
                            glucosa: record.glucose,
                            id: record.id
                        }
                    });
                    break;
                
                case 'weight':
                    const weightData = await fetchData('weight');
                    formattedData = weightData.map(record => {
                        return {
                            date: formatDate(record.manual_datetime),
                            peso: record.weight,
                            id: record.id
                        }
                    });
                    break;
                
                case 'bloodpressure':
                    const bpData = await fetchData('bloodpressure');
                    formattedData = bpData.map(record => {
                        return {
                        date: formatDate(record.manual_datetime),
                        sistólica: record.systolic,
                        diastólica: record.diastolic,
                        id:record.id
                        }
                    });
                    break;

                case 'pulse':
                    const pulseData = await fetchData('pulse');
                    formattedData = pulseData.map(record => {
                        return {
                            date: formatDate(record.manual_datetime),
                            pulso: record.pulse,
                            id: record.id
                        }
                    });
                    break;

                default:
                    break;
            }
            // Ordenar por fecha el formattedData
            formattedData.sort((a,b) => new Date(a.date) - new Date(b.date));
            setPatientData(formattedData)
        };
        loadData()
    }, [dataType]);

     //función para determinar qué campos renderizar en el gráfico según el tipo de datos
     const getDataKeys = () => {
        switch (dataType) {
            case 'glucose': return ['glucosa'];
            case 'weight': return ['peso'];
            case 'bloodpressure': return ['sistólica', 'diastólica'];
            case 'pulse': return ['pulso'];
            default: return ['glucosa']
        }
     };

     const dataTypeNames = {
        'glucose': 'Glucosa',
        'weight': 'Peso',
        'bloodpressure': 'Tensión Arterial',
        'pulse': 'Pulso'
     };
    return (
        <>
            <div className="container mt-4">
                <h2>Gráfico de {dataTypeNames[dataType] || 'datos médicos'}</h2>
                
                {isLoading && <p>Cargando datos...</p>}
                {error && <p className='text-danger'>Error: {error}</p>}
                {!isLoading && !error && patientData.length === 0 && 
                    <p>No hay datos disponibles para mostrar.</p>
                }
                {patientData.length > 0 && (
                    <Graphics
                    chartType={chartType}
                    setChartType={setChartType}
                    patientData={patientData}
                    dataKeys={getDataKeys()}
                    dataType={dataType}
                    />
                )}
            </div>
        </>
    );
};

export default MedicalDataChart;