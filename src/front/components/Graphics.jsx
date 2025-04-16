import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';


const Graphics = ({ chartType, setChartType, patientData, dataKeys, dataType }) => {
    // Selección de colores según el tipo de dato entregado
    const getColorForKey = (key) => {
        const colorMap = {
            glucosa: "#FF8C00",
            peso: "#4169E1",
            sistólica: "#DC143C",
            diastólica: "#4682B4",
            pulso: "#32CD32"
        };
        return colorMap[key] || "#0d6efd";
    };

    // Configuración de etiquetas para el eje Y según el tipo de dato
    const getYAxisLabel = () => {
        switch (dataType) {
            case 'glucose': return 'Glucosa (mg/dL)';
            case 'weight': return 'Peso (kg)';
            case 'bloodpressure': return 'Presión (mmHg)';
            case 'pulse': return 'Pulso (bpm)';
            default: return '';
        }
    };

    return (
        <>
            <div className="col-md-6 mb-4 ms-5 mt-3">
                <label htmlFor="graphicType" className="form-label">Tipo de Gráfico</label>
                <select
                    name="graphicType"
                    id="graphicType"
                    className="form-select"
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                >
                    <option value="line">Línea</option>
                    <option value="area">Área</option>
                </select>
            </div>
            <div className="mb-4" style={{ height: "400px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'line' ? (
                        <LineChart data={patientData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" label={{value: 'Fecha', position: 'insideBottomRight', offset: -5 }} />
                            <YAxis label={{value: getYAxisLabel(), angle: -90, position: 'insideLeft' }} />
                            <Tooltip />
                            <Legend />
                            {dataKeys.map((key) => (
                                <Line
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={getColorForKey(key)}
                                activeDot={{ r: 8 }}
                                strokeWidth={2}
                                name={key.charAt(0).toUpperCase() + key.slice(1)}
                                />
                            ))}
                        </LineChart>
                    ) : (
                        <AreaChart data={patientData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" label={{value: 'Fecha', position: 'insideBottomRight', offset: -5 }} />
                            <YAxis label={{value: getYAxisLabel(), angle: -90, position: 'insideLeft' }}/>
                            <Tooltip />
                            <Legend />
                            {dataKeys.map((key) => (
                                <Area
                                key={key}
                                type="monotone"
                                dataKey={key}
                                stroke={getColorForKey(key)}
                                fill={getColorForKey(key)}
                                fillOpacity={0.3}
                                name={key.charAt(0).toUpperCase() + key.slice(1)}
                                />
                            ))}
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </div>
        </>
    )
}

export default Graphics;