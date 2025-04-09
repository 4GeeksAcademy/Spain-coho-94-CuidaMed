import React from "react";

const SuccessModal = (props) => {
    if(!props.showSuccessModal) return null;

    return(
    <>
      <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1" >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-success text-white">
              <h5 className="modal-title">{props.modalTitle}</h5>
            </div>
            <div className="modal-body text-center py-3">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill fs-1 text-success"></i>
                <span className="fs-1 text-success">✓</span>
              </div>
              <p className="mb-0">{props.text}</p>
            </div>
          </div>
        </div>
      </div>
    </>
    )
  };

export default SuccessModal;
