"""
En este archivo están todas las rutas de Antecedentes Familiare
Ruta /api/records/medical_history
"""
from flask import request, jsonify, Blueprint
from api.models import db, MedicalHistory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

medical_history_blueprint = Blueprint('medical_history', __name__)