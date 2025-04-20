from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, GalleryImage
from datetime import datetime
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import secrets
from google.oauth2 import id_token
from google.auth.transport import requests
import boto3
from botocore.client import Config
import uuid
import os


gallery_bp = Blueprint('gallery', __name__)



# Create S3 service client
svc = boto3.client(
    's3',
    endpoint_url='https://fly.storage.tigris.dev',
    config=Config(s3={'addressing_style': 'virtual'}),
    aws_access_key_id= os.getenv("AWS_ACCESS_KEY_ID"),  # Asegúrate de que estas credenciales
    aws_secret_access_key=  os.getenv("AWS_SECRET_ACCESS_KEY")# tengan permisos suficientes
)
def upload_image_to_tigris(file, bucket_name):
    # Verificar si hay un archivo
    if not file:
        raise APIException("No se ha proporcionado ningún archivo", status_code=400)
    
    # Obtener nombre original y extensión
    original_filename = file.filename
    extension = os.path.splitext(original_filename)[1].lower()
    
    # Verificar que la extensión sea válida
    allowed_extensions = ['.jpg', '.jpeg', '.png', '.pdf']
    if extension not in allowed_extensions:
        raise APIException(f"Formato de archivo no permitido. Use: {', '.join(allowed_extensions)}", status_code=400)
    
    # Generar nombre único
    unique_filename = f"{uuid.uuid4()}{extension}"
    
    # Leer contenido del archivo
    file_content = file.read()
    
    # Subir a S3 usando put_object
    try:
        svc.put_object(
            Bucket=bucket_name,
            Key=unique_filename,
            Body=file_content,
            ContentType=f"image/{extension[1:]}",  # Establecer Content-Type adecuado
            ACL='public-read'  # Hacer el objeto público permanentemente
        )
        
        # Generar y devolver la URL al archivo subido
        object_url = f"https://{bucket_name}.fly.storage.tigris.dev/{unique_filename}"
        return object_url
    except Exception as e:
        raise APIException(f"Error al subir el archivo: {str(e)}", status_code=500)

"""# List buckets
response = svc.list_buckets()

for bucket in response['Buckets']:
    print(f'  {bucket["Name"]}')

# List objects
response = svc.list_objects_v2(Bucket='tigris-example')

for obj in response['Contents']:
    print(f'  {obj["Key"]}')

# Upload file
response = svc.upload_file('getting-started.py', 'tigris-example', 'getting-started.py')

# Download file
response = svc.download_file('tigris-example', 'getting-started.py', 'getting-started-2.py')"""

#Esta ruta es para comprobar que se esta subiendo la imagen a TigrisDB (Funcionando)
@gallery_bp.route("/test", methods=["POST"])
def testing_tigris():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No se encontró ningún archivo en el campo 'image'"}), 400
            
        image_file = request.files.get("image")
        
        if image_file.filename == '':
            return jsonify({"error": "No se seleccionó ningún archivo"}), 400
            
        image_url = upload_image_to_tigris(image_file, "cuidamed2")
        return jsonify({"success": True, "img_url": image_url}), 201
    except APIException as e:
        return jsonify({"error": str(e)}), e.status_code
    except Exception as e:
        return jsonify({"error": f"Error inesperado: {str(e)}"}), 500
    

#Rutas para la base de datos "GalleryImage"
@gallery_bp.route("/", methods=["POST"])
@jwt_required()
def upload_gallery_image():

    current_user_id = get_jwt_identity()

    user= User.query.get(current_user_id)
    if not user:
        return jsonify({'msg': 'Usuario no encontrado'}), 404
    
    # obtener datos del formulario
    data= request.form

    # verificar camos requeridos
    if not data.get('title') or not data.get('category') or not data.get('manual_datetime'):
        return jsonify ({'msg': 'Faltan campos requeridos'}), 400

    
    # verificar si hay archivo en solicitud
    image_file = request.files.get('image')
    if not image_file:
        return jsonify ({'msg':'No se proporciono ninguna imagen'}), 400
    
    # subir imagen a TigrisDB
    image_url = upload_image_to_tigris(image_file, "cuidamed2")
    if not image_url:
        return jsonify({'msg': 'Error al subir imagen a tigris'}), 500
    
    try:
        
      new_image = GalleryImage(
        user_id=current_user_id,
        title=data.get('title'),
        manual_datetime=datetime.strptime(data['manual_datetime'], "%d-%m-%Y %H:%M"),
        category= data.get('category'),
        image_url=image_url
      )

      db.session.add(new_image)
      db.session.commit()

      return jsonify({
            'msg': 'Imagen subida correctamente',
            'id': new_image.id,
            'title': new_image.title,
            'manual_datetime': new_image.manual_datetime.strftime("%d-%m-%Y") if new_image.manual_datetime else None,
            'category': new_image.category,
            'image_url': new_image.image_url
        }), 201

    except Exception as e:
            db.session.rollback()
            return jsonify({"msg": "Error al subir imagen", "error": str(e)}), 500
    
@gallery_bp.route("/", methods=["GET"])
@jwt_required()
def get_gallery_image():

    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)
    if not user:
        return jsonify ({'msg': 'Usuario no encotrado'}), 404
    
    gallery_images = GalleryImage.query.filter_by(user_id=current_user_id).order_by(GalleryImage.manual_datetime.desc()).all()

    result = [image.serialize_gallery_image() for image in gallery_images]

    return jsonify({
        'msg': 'Imágenes obtenidas correctamente',
        'total': len(result),
        'images': result
    }), 200


@gallery_bp.route("/<int:image_id>", methods=["DELETE"])
@jwt_required()
def delete_gallery_image(image_id):
    # Elimina una imagen de la galería por su ID en la base de datos
    try:
        current_user_id = get_jwt_identity()
        
        gallery_image = GalleryImage.query.get(image_id)
        
        if not gallery_image:
            return jsonify({"msg": "Imagen no encontrada"}), 404
            
        if str(gallery_image.user_id) != str(current_user_id):
            return jsonify({"msg": "No tienes permiso para eliminar esta imagen"}), 403
        
        # Variable para guardar advertencias
        warning = None
        
        # Código para eliminar el archivo de TigrisDB
        try:
            # Extraer el nombre del archivo de la URL
            image_filename = gallery_image.image_url.split('/')[-1]
            bucket_name = "cuidamed2"
            
            # Eliminar el archivo de Tigris
            svc.delete_object(
                Bucket=bucket_name,
                Key=image_filename
            )
        except Exception as e:
            # Guardar el error para usarlo después
            warning = f"La imagen se eliminó de la base de datos, pero hubo un problema al eliminarla del almacenamiento: {str(e)}"
        
        # Eliminar el registro de la base de datos
        db.session.delete(gallery_image)
        db.session.commit()
        
        if warning:
            return jsonify({"msg": warning}), 200
        else:
            return jsonify({"msg": "Imagen eliminada correctamente"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": f"Error al eliminar la imagen: {str(e)}"}), 500



