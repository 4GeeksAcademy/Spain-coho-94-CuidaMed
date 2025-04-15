"""
En este archivo están todas las rutas para antecedentes personales
Ruta /api/records/personal_antecedents
Metodo POST - GET - DELETE
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, PersonalAntecedent
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

personal_antecedents_blueprint = Blueprint('personal_antecedents', __name__)

@personal_antecedents_blueprint.route('/', methods=['POST'])
@jwt_required()
def create_personal_antecedents():
        current_user_id = get_jwt_identity()

        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        data = request.get_json()

         # Verificar datos obligatorios (el usuario debe escribir si padece alguna enfermedad base)
        if 'disease' not in data:
            return jsonify({"msg": "El nombre de la enfermedad es obligatorio"}), 400
    
        # Crear nuevo antecedente personal
        new_personal_antecedent = PersonalAntecedent(
            user_id=current_user_id,
            disease=data['disease']    
        )
    
        # Procesar la fecha si el usuario la introduce (no es obligatorio)
        if 'diagnosis_date' in data and data['diagnosis_date']:
            try:
                new_personal_antecedent.diagnosis_date = datetime.strptime(data['diagnosis_date'], "%d-%m-%Y")
            except ValueError:
                return jsonify({"msg": "Formato de fecha inválido"}), 400

        db.session.add(new_personal_antecedent)
        db.session.commit()
        
        return jsonify(new_personal_antecedent.serialize_personal_antecedent()), 201

@personal_antecedents_blueprint.route('/', methods=['GET'])
@jwt_required()
def get_personal_antecedents():
    try:
        current_user_id = get_jwt_identity()
        
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        
        # Obtener todos los antecedentes personales del usuario
        antecedents = PersonalAntecedent.query.filter_by(user_id=current_user_id).all()
        
        # Si no hay antecedentes
        if not antecedents:
            return jsonify({"msg": "Antecedentes no existentes"}), 200
        
        result = [antecedent.serialize_personal_antecedent() for antecedent in antecedents]
        
        return jsonify(result), 200
    
    except Exception as e:
        return jsonify({"msg": "Error al obtener los antecedentes personales", "error": str(e)}), 500


        