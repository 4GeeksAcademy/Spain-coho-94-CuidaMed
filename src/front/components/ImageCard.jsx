import React from "react";

const ImageCard = ({imageUrl, imageTitle, imageDate, imageCategory, imageId}) => {
    return(
        <div className="card h-100">
            <img                   
                src={imageUrl}
                className="card-img-top"
                alt={imageTitle}
                style={{ height: "200px", objectFit: "cover" }}
            />
            <div className="card-body">
            <h5 className="card-title">{imageTitle}</h5>
            <p className="card-text">
                <small className="text-muted">Fecha: {imageDate}</small>
            </p>
            <span className="badge bg-primary text-white">{imageCategory}</span>
            </div>
            <div className="card-footer bg-white">
            <div className="btn-group w-100">
                <button className="btn btn-outline-primary">Ver</button>
                {/* Aquí hacemos que te redirija a la URL para ampliar imagen */}
                <button className="btn btn-outline-danger">Eliminar</button>
            </div>
            </div>
        </div>
    )
}
export default ImageCard