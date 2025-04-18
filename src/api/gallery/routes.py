from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
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
    allowed_extensions = ['.jpg', '.jpeg', '.png']
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

#Esta ruta es para comprobar que se esta subiendo la imagen a TigrisDB
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