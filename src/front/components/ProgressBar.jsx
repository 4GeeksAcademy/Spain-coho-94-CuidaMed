import React from "react";

const ProgressBar = (props) => {
    return (
      <div className="text-center py-2 border-top">
        <div className="container">
          <div className="d-flex justify-content-center align-items-center mb-3 mt-2">
            <span className="fw-medium me-3">Paso {props.step} de {props.totalSteps}</span>
            <div
              className="progress"
              style={{ height: "10px", width: "300px" }}
            >
              <div
                className="progress-bar bg-primary"
                role="progressbar"
                style={{ width: `${(props.step / props.totalSteps) * 100}%` }}
                aria-valuenow={(props.step / props.totalSteps) * 100}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

export default ProgressBar;