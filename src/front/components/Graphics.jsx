import React from "react";
import { useState } from "react";
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
  Area,
  ReferenceLine,
  ReferenceArea,
} from "recharts";

const Graphics = ({
  chartType,
  setChartType,
  patientData,
  dataKeys,
  dataType,
  subType = null,
}) => {
  // Estado para controlar la visualización de rangos en el gráfico
  const [showRanges, setShowRanges] = useState(false);
  const [showReferenceLines, setShowReferenceLines] = useState(false);

  // Rangos normales y de peligro según el tipo de dataType
  const healthRanges = {
    glucose: {
      normal: { min: 70, max: 100 }, // mg/dL en ayunas
      warning: { min: 100, max: 125 }, // resistencia a la insulina
      danger: { min: 126, max: 300 }, // diabetes
    },
    weight: {
      normal: { min: 50, max: 80 },
      danger: { min: 80, max: 120 },
    },
    bloodpressure: {
      sistolica: {
        normal: { min: 80, max: 120 }, //normotenso
        warning: { min: 121, max: 139 }, //normotenso con alerta
        danger: { min: 140, max: 200 }, //hipertenso
      },
      diastolica: {
        normal: { min: 60, max: 79 },
        warning: { min: 80, max: 90 },
        danger: { min: 91, max: 200 },
      },
    },
    pulse: {
      normal: { min: 60, max: 100 }, //normocardio
      warning: {min: 101, max: 119},
      danger: { min: 120, max: 150 }, //taquicardia
    },
  };
  // Selección de colores según el tipo de dato entregado
  const getColorForKey = (key) => {
    const colorMap = {
      glucosa: "#FF8C00",
      glucose: "#FF8C00",
      peso: "#4169E1",
      weight: "#4169E1",
      sistólica: "#DC143C",
      sistolica: "#DC143C",
      diastólica: "#4682B4",
      diastolica: "#4682B4",
      pulso: "#32CD32",
      pulse: "#32CD32",
    };
    return colorMap[key] || "#0d6efd";
  };

  // Configuración de etiquetas para el eje Y según el tipo de dato
  const getYAxisLabel = () => {
    switch (dataType) {
      case "glucose":
        return "Glucosa (mg/dL)";
      case "weight":
        return "Peso (kg)";
      case "bloodpressure":
        if (subType === "sistolica") return "Presión Sistólica (mmHg)";
        if (subType === "diastolica") return "Presión Diastólica (mmHg)";
        return "Presión (mmHg)";
      case "pulse":
        return "Pulso (bpm)";
      default:
        return "";
    }
  };

  // Acceder a los rangos según el tipo de dato actual
  const getCurrentRanges = () => {
    if (dataType === "bloodpressure") {
      if (subType == "sistolica"){
        return { sistolica: healthRanges.bloodpressure.sistolica };
      } else if (subType === "diastolica") {
        return { diastolica: healthRanges.bloodpressure.diastolica }
      }
      return {
        sistolica: healthRanges.bloodpressure.sistolica,
        diastolica: healthRanges.bloodpressure.diastolica,
      };
    }
    return healthRanges[dataType];
  };

  
  //Función para subsanar el comportamiento de la biblioteca recharts:
  const calculateYDomain = () => {
    const ranges = getCurrentRanges();
    let minValue = Infinity;
    let maxValue = -Infinity;

    //Establecer el mínimo y el máximo para cada rango de salud
    dataKeys.forEach((key) => {
      let keyRanges;

      if (dataType === "bloodpressure") {
        keyRanges = ranges[key];
      } else {
        keyRanges = ranges;
      }

      if(!keyRanges) {
        return;
      }

      if (keyRanges.normal && keyRanges.normal.min < minValue) {
        minValue = keyRanges.normal.min;
      }

      if (keyRanges.danger && keyRanges.danger.max > maxValue) {
        maxValue = keyRanges.danger.max;
      } else if (keyRanges.warning && keyRanges.warning.max > maxValue) {
        maxValue = keyRanges.warning.max;
      } else if (keyRanges.normal && keyRanges.normal.max > maxValue) {
        maxValue = keyRanges.normal.max;
      }
    });

    //Añadir margen al rango
    minValue = Math.max(0, minValue * 0.9);
    maxValue = maxValue * 1.1;

    //Considerar los datos actuales para el dominio
    if (patientData && patientData.length > 0) {
      patientData.forEach(record => {
        dataKeys.forEach(key => {
          if (record[key] > maxValue) {
            maxValue = record[key * 1.1];
          }
        });
      });
    }

    return [minValue, maxValue];
  };

  // Verificación para las alertas de datos
  const checkAlerts = () => {
    if (!patientData || patientData.length === 0) {
      return [];
    }

    const ranges = getCurrentRanges();
    const alerts = [];

    // Tomar sólo el último registro
    const lastRecord = patientData[patientData.length - 1];

    dataKeys.forEach((key) => {
      const value = lastRecord[key];

      let keyRanges;

      if (dataType === "bloodpressure") {
        keyRanges = ranges[key];
      } else {
        keyRanges = ranges;
      }

      if (!keyRanges) {
        return;
      }

      if (value < keyRanges.normal.min) {
        alerts.push({
          type: "warning",
          message: `${
            key.charAt(0).toUpperCase() + key.slice(1)
          } bajo: ${value}`,
          key,
        });
      } else if (
        (keyRanges.danger && value >= keyRanges.danger.min) ||
        (keyRanges.warning && value > keyRanges.warning.max)
      ) {
        alerts.push({
          type: "danger",
          message: `${
            key.charAt(0).toUpperCase() + key.slice(1)
          } alto: ${value}`,
          key,
        });
      }
    });

    return alerts;
  };

  const alerts = checkAlerts();

  // Renderización de las referencias según el tipo de gráfico
  const renderReferenceAreas = () => {
    if (!showRanges) {
      return null;
    }

    const ranges = getCurrentRanges();
    const refAreas = [];

    dataKeys.forEach((key) => {
      let keyRanges;

      if (dataType === "bloodpressure") {
        keyRanges = ranges[key];
      } else {
        keyRanges = ranges;
      }

      if (!keyRanges) {
        return;
      }

      //Área de Peligro
      if (keyRanges.danger) {
        refAreas.push(
          <ReferenceArea
            key={`danger-${key}`}
            y1={keyRanges.danger.min}
            y2={keyRanges.danger.max}
            stroke="none"
            fill="red"
            fillOpacity={0.15}
          />
        );
      }

      //Àrea advertencia
      if (keyRanges.warning) {
        refAreas.push(
          <ReferenceArea
            key={`warning-${key}`}
            y1={keyRanges.warning.min}
            y2={keyRanges.warning.max}
            stroke="none"
            fill="orange"
            fillOpacity={0.15}
          />
        );
      }

      //Àrea Normal
      if (keyRanges.normal) {
        refAreas.push(
          <ReferenceArea
            key={`normal-${key}`}
            y1={keyRanges.normal.min}
            y2={keyRanges.normal.max}
            stroke="none"
            fill="green"
            fillOpacity={0.15}
          />
        );
      }
    });

    return refAreas;
  };

  //Líneas de referencia
  const renderReferenceLines = () => {
    if (!showReferenceLines) {
      return null;
    }

    const ranges = getCurrentRanges();
    const refLines = [];

    dataKeys.forEach((key) => {
      let keyRanges;

      if (dataType === "bloodpressure") {
        keyRanges = ranges[key];
      } else {
        keyRanges = ranges;
      }

      if (!keyRanges) {
        return;
      }

      //Àrea Normal
      if (keyRanges.normal) {
        refLines.push(
          <ReferenceLine
            key={`min-normal-${key}`}
            y={keyRanges.normal.min}
            stroke="green"
            strokeDasharray="3 3"
            label={{
              value: `Mín. normal: ${keyRanges.normal.min}`,
              position: "insideLeft",
              style: { fontSize: "12px", fill: "green" },
            }}
          />
        );
      }

      //Àrea advertencia
      if (keyRanges.normal && (keyRanges.warning || keyRanges.danger)) {
        refLines.push(
          <ReferenceLine
            key={`max-normal-${key}`}
            y={keyRanges.normal.max}
            stroke="orange"
            strokeDasharray="3 3"
            label={{
              value: `Límite superior: ${keyRanges.normal.max}`,
              position: "insideRight",
              style: { fontSize: "12px", fill: "orange" },
            }}
          />
        );
      }

      if (keyRanges.danger) {
        refLines.push(
          <ReferenceLine
            key={`danger-${key}`}
            y={keyRanges.danger.min}
            stroke="red"
            strokeDasharray="3 3"
            label={{
              value: `Umbral crítico: ${keyRanges.danger.min}`,
              position: "insideLeft",
              style: { fontSize: "12px", fill: "red" },
            }}
          />
        );
      }
    });

    return refLines;
  };

  return (
    <>
      <div className="d-flex flex-wrap align-items-center mb-4">
        <div className="me-4">
          <label htmlFor="graphicType" className="form-label">
            Tipo de Gráfico
          </label>
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

        <div className="form-check ms-4 mt-4">
          <input
            type="checkbox"
            className="form-check-input"
            id="showRanges"
            checked={showRanges}
            onChange={() => setShowRanges(!showRanges)}
          />
          <label htmlFor="showRanges" className="form-check-label">
            Mostrar rangos saludables
          </label>
        </div>

        <div className="form-check ms-4 mt-4">
          <input
            type="checkbox"
            className="form-check-input"
            id="showReferenceLines"
            checked={showReferenceLines}
            onChange={() => setShowReferenceLines(!showReferenceLines)}
          />
          <label htmlFor="showReferenceLines" className="form-check-label">
            Mostrar líneas de referencia
          </label>
        </div>
      </div>

      {alerts.length > 0 && (
        <div className="mb-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className={`alert alert-${
                alert.type === "danger" ? "danger" : "warning"
              } py-2`}
            >
              {alert.message}
            </div>
          ))}
        </div>
      )}

      <div className="mb-4" style={{ height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={patientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                label={{
                  value: "Fecha",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                domain={calculateYDomain()}
                label={{
                  value: getYAxisLabel(),
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />
              {renderReferenceAreas()}
              {renderReferenceLines()}

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
              <XAxis
                dataKey="date"
                label={{
                  value: "Fecha",
                  position: "insideBottomRight",
                  offset: -5,
                }}
              />
              <YAxis
                domain={calculateYDomain()}
                label={{
                  value: getYAxisLabel(),
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />

              {renderReferenceAreas()}
              {renderReferenceLines()}

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
      {(showRanges || showReferenceLines) && (
        <div className="mt-3 mb-4">
          <h5>Leyenda:</h5>
          <div className="d-flex flex-wrap">
            {showRanges && (
              <>
                <div className="me-4 mb-2">
                  <span className="badge bg-success me-1">■</span> Rango normal
                </div>
                <div className="me-4 mb-2">
                  <span className="badge bg-warning me-1">■</span> Advertencia
                </div>
                <div className="me-4 mb-2">
                  <span className="badge bg-danger me-1">■</span> Peligro
                </div>
              </>
            )}

            {showReferenceLines && (
              <>
                <div className="me-4 mb-2">
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    - - -
                  </span>{" "}
                  Límite inferior normal
                </div>
                <div className="me-4 mb-2">
                  <span style={{ color: "orange", fontWeight: "bold" }}>
                    - - -
                  </span>{" "}
                  Límite superior normal
                </div>
                <div className="me-4 mb-2">
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    - - -
                  </span>{" "}
                  Umbral crítico
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Graphics;
