"""
En este archivo están todas las rutas de registro de Alergia
Ruta /api/records/allergy
Metodo POST - GET - DELETE
"""
from flask import request, jsonify, Blueprint
from api.models import db, Allergy
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

allergy_blueprint = Blueprint('allergy', __name__)