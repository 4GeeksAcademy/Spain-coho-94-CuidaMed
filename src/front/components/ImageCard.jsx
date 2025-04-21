import React from "react";

const ImageCard = ({
  imageUrl,
  imageTitle,
  imageDate,
  imageCategory,
  imageId,
  handleDelete,
}) => {
  const isPDF = imageUrl.toLowerCase().endsWith(".pdf");
  return (
    <div className="card h-100">
      {isPDF ? (
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(
            imageUrl
          )}&embedded=true`}
          title={imageTitle}
          className="card-img-top"
          style={{ height: "200px", width: "100%", border: "none" }}
        />
      ) : (
        <img
          src={imageUrl}
          className="card-img-top"
          alt={imageTitle}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}
      <div className="card-body">
        <h5 className="card-title">{imageTitle}</h5>
        <p className="card-text">
          <small className="text-muted">Fecha: {imageDate}</small>
        </p>
        <span className="badge bg-primary text-white">{imageCategory}</span>
      </div>
      <div className="card-footer bg-white">
        <div className="btn-group w-100">
          <a
            className="btn btn-outline-primary"
            href={imageUrl}
            target="_blank"
          >
            Ver
          </a>
          <button
            className="btn btn-outline-danger"
            onClick={() => handleDelete(imageId)}
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
export default ImageCard;
