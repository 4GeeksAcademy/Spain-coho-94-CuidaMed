"""
En este archivo están todas las rutas para antecedentes personales
Ruta /api/records/personal_antecedents
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, PersonalAntecedent
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

personal_antecedents_blueprint = Blueprint('personal_antecedents', __name__)