import { useState, useEffect } from "react"
import ImageCard from "../components/ImageCard"
import ErrorModal from "../components/ErrorModal"


const Gallery = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("")
    const [showUploadModal, setShowUploadModal] = useState(false)
    const [filteredImages, setFilteredImages] = useState([])
    const [imageHistory, setImageHistory] = useState([])
    const [uploadForm, setUploadForm] = useState({
      title: "",
      category: "",
      date: "",
      file: null
    });
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [error, setError] = useState({
      title: "",
      category: "",
      date: "",
      file: "",
      delete:""
    })

    const categories = ["Radiografía", "Analítica", "Documento"]
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "";
    const accessToken = localStorage.getItem("accessToken");

    useEffect(()=>{
        const fetchImages = async () => {
          try {
            const response = await fetch(`${backendUrl}/api/gallery`, {
              method: 'GET',
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
              }
            });

            const data = await response.json();

            if(!response.ok){
              throw new Error(data.error || " Error al obtener las imágenes")
            }

            setImageHistory(
              data.images.map(img => ({
                id: img.id,
                title: img.title,
                category: img.category,
                date: img.manual_datetime,
                url: img.image_url
              })));

          } catch (error) {
            console.error("Error al cargar imágenes:", error.message);
          }
        }
        fetchImages()
    },[]);

    useEffect(()=>{
        setFilteredImages( imageHistory.filter((image) => {
            const matchesSearch = image.title.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesCategory = selectedCategory === "" || image.category === selectedCategory
            return matchesSearch && matchesCategory
        }))
    }
    ,[searchTerm, selectedCategory, imageHistory])
    
    const handleUploadChange = (e) => {
      const { name, value, files } = e.target;
    
      setUploadForm((prev) => ({
        ...prev,
        [name]: name === "file" ? files[0] : value,
      }));
    
      if (error[name]) {
        setError((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    };
    
    const validateUploadForm = () => {
      
      const allowedExtensions = ["image/jpeg", "image/png", "application/pdf"];
      const newError={...error}
      let valid = true

      if (!uploadForm.title.trim()) {
        newError.title = "El título es obligatorio.";
        valid = false
      } else if (uploadForm.title.length > 300) {
        newError.title = "El título no puede tener más de 300 caracteres.";
        valid = false
      }
    
      if (!uploadForm.category) {
        newError.category = "Por favor, seleccione una categoría";
        valid = false
      }
    
      if (!uploadForm.date) {
        newError.date = "La fecha es obligatoria.";
        valid = false
      }
    
      if (!uploadForm.file) {
        newError.file = "Debes seleccionar una imagen o documento.";
        valid = false
      } else if (!allowedExtensions.includes(uploadForm.file.type)) {
        newError.file = "Formato no válido. Usa JPG, PNG o PDF.";
        valid = false
      }

      setError(newError)
      return valid
    };
    

    const formatDatetime = (datetimeStr) => {
      const dateObj = new Date(datetimeStr);
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // enero = 0
      const year = dateObj.getFullYear();
      const hours = String(dateObj.getHours()).padStart(2, "0");
      const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    }

    const handleUpload = async (e) => {

      e.preventDefault();
      if (!validateUploadForm()) return;
      
      const formattedDate = formatDatetime(uploadForm.date)
      
      const formData = new FormData();
      formData.append("title", uploadForm.title);
      formData.append("category", uploadForm.category);
      formData.append("manual_datetime", formattedDate);
      formData.append("image", uploadForm.file);
      
      try {
        const response = await fetch(`${backendUrl}/api/gallery`,{
          method:'POST',
          headers: {
            "Authorization": `Bearer ${accessToken}`
          },
          body: formData

        })

        const data = await response.json();

        if(!response.ok){
          throw new Error(data.error)
        }

        setShowUploadModal(false);
        setUploadForm({ title: "", category: "", date: "", file: null });
        setImageHistory(prev => [
          {
            id: data.id, 
            title: data.title,
            category: data.category,
            date: uploadForm.date,
            url: data.image_url 
          },
          ...prev
        ]);
      } catch (error) {
        console.log(`Error al subir la imagen: ${error.message}`)
      }
    }

    const handleDelete = async (imageId) => {
      try {
        const response = await fetch(`${backendUrl}/api/gallery/${imageId}`,
          {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        const data = await response.json();

        if(response.ok){
          throw new Error("Error al eliminar el archivo")
        }

        setImageHistory(imageHistory.filter((file)=>file.id !== imageId))

      } catch (err) {
        setError({...error, delete: err.message})
        setShowErrorModal(true)
        
      }
    }

    
  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-4">
        <i className="fas fa-images text-primary me-2 fa-lg"></i>
        <h1 className="mb-0">Galería Médica</h1>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row g-3">
            {/* Buscador */}
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="fas fa-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar imágenes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            {/* Filtro por categorías */}
            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="fas fa-filter"></i>
                </span>
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* Botón que activa el modal */}
            <div className="col-md-2">
              <button
                className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                onClick={() => setShowUploadModal(true)}
              >
                <i className="fas fa-upload me-2"></i>
                <span>Subir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-images text-muted mb-3 fa-3x"></i>
          <p className="mb-0">No se encontraron imágenes.</p>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredImages.map((image) => (
            <div key={image.id} className="col">
                <ImageCard 
                    imageUrl={image.url} 
                    imageTitle={image.title} 
                    imageCategory={image.category} 
                    imageDate={image.date}
                    imageId={image.id}
                    handleDelete={handleDelete}
                />
            </div>
          ))}
        </div>
      )}

      {/* Modal para subir imágenes */}
      {showUploadModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Subir Imagen</h5>
                <button type="button" className="btn-close" onClick={() => setShowUploadModal(false)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="imageTitle" className="form-label">
                      Título
                    </label>
                    <input 
                      type="text" 
                      className={`form-control ${error.title ? 'is-invalid' : ''}`}
                      id="imageTitle"
                      name="title"
                      value={uploadForm.title}
                      onChange={handleUploadChange}
                      />
                      {error.title && <div className="invalid-feedback">{error.title}</div>}  
                  </div>

                  <div className="mb-3">
                    <label htmlFor="imageCategory" className="form-label">
                      Categoría
                    </label>
                    <select 
                      className={`form-select ${error.category ? 'is-invalid' : ''}`}
                      id="imageCategory"
                      name="category"
                      value={uploadForm.category}
                      onChange={handleUploadChange}
                      >
                      <option value="">Seleccionar categoría...</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {error.category !== "" && <div className="invalid-feedback">{error.category}</div>}  
                  </div>

                  <div className="mb-3">
                    <label htmlFor="imageDate" className="form-label">
                      Fecha
                    </label>
                    <input 
                      type="date" 
                      className={`form-control ${error.date ? 'is-invalid' : ''}`}
                      id="imageDate"
                      name="date"
                      value={uploadForm.date}
                      onChange={handleUploadChange}
                      />
                    {error.date && <div className="invalid-feedback">{error.date}</div>}  
                  </div>

                  <div className="mb-3">
                    <label htmlFor="imageFile" className="form-label">
                      Archivo
                    </label>
                    <input 
                      type="file" 
                      className={`form-control ${error.file ? 'is-invalid' : ''}`}
                      id="imageFile" 
                      name="file"
                      onChange={handleUploadChange}
                      />
                    {error.file && <div className="invalid-feedback">{error.file}</div>}  
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowUploadModal(false)
                  setError({
                    title:"",
                    category:"",
                    date:"",
                    file:"",
                  })
                }}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpload}>
                  Subir
                </button>
                
              </div>
            </div>
          </div>
        </div>
      )}
      {showErrorModal &&
        <ErrorModal
          showErrorModal={showErrorModal}
          modalTitle={"Error al eliminar el archivo"}
          setShowErrorModal={setShowErrorModal}
          errorMessage={error.delete}
          text={"Por favor, inténtalo de nuevo más tarde."}
        />        
      }

    </div>
  )
}

export default Gallery