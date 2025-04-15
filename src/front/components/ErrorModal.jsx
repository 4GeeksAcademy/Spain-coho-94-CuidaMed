import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorModal = (props) => {
  const navigate = useNavigate();
  if (!props.showErrorModal) return null;

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title fw-bold">{props.modalTitle}</h5>
              <button
                className="btn-close btn-close-white"
                type="button"
                onClick={() => {
                  props.setShowErrorModal(false);
                  if (props.modalNavigate) {
                    navigate(`/${props.modalNavigate}`);
                  }
                }}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center py-4">
              <div className="mb-3">
                <span className="fs-1 text-danger">⚠️</span>
              </div>
              <p className="mb-3">
                {props.errorMessage ||
                  "Ha ocurrido un error al procesar tu solicitud."}
              </p>
              <p className="mb-0">{props.text}</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  props.setShowErrorModal(false);
                  if (props.modalNavigate) {
                    navigate(`/${props.modalNavigate}`);
                  }
                }}
              >
                {props.buttonText || "Cerrar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorModal;
