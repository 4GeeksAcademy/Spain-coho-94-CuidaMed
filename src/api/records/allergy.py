"""
En este archivo están todas las rutas de registro de Alergia
Ruta /api/records/allergy
Metodo POST - GET - DELETE
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, Allergy, SeverityEnum
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from enum import Enum

allergy_blueprint = Blueprint('allergy', __name__)

@allergy_blueprint.route('/', methods=['POST'])
@jwt_required()
def create_allergy():
    current_user_id = get_jwt_identity()
    
    data = request.get_json()
    
    if not data or not data.get('allergen') or not data.get('symptoms') or not data.get('severity'):
        return jsonify({"msg": "Faltan campos obligatorios (alergia, sintomas, severidad)"}), 400
    
    try:
        # Validar campo severidad, visto que es un Select(Frontend)
        # El valor debe ser exactamente igual c omo está en el Models (SeverityEnum)
        try:
            severity = SeverityEnum(data['severity'])
        except ValueError:
            return jsonify({"msg": "El valor de severidad no es válido"}), 400
        
        # Crear nueva alergia
        new_allergy = Allergy(
            user_id=current_user_id,
            allergen=data['allergen'],
            symptoms=data['symptoms'],
            severity=severity
        )
        
        db.session.add(new_allergy)
        db.session.commit()
        
        return jsonify({
            "msg": "Alergia registrada con éxito",
            "id": new_allergy.id,
            "allergen": new_allergy.allergen,
            "symptoms": new_allergy.symptoms,
            "severity": new_allergy.severity.value,
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al registrar alergia", "error": str(e)}), 500
    


@allergy_blueprint.route('/', methods=['GET'])
@jwt_required()
def get_allergies():
    try:
        current_user_id = get_jwt_identity()
        
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        
        # Buscar todas las alergias del usuario
        allergies = Allergy.query.filter_by(user_id=current_user_id).all()
       
        return jsonify([
            {
                "id": allergy.id,
                "allergen": allergy.allergen,
                "symptoms": allergy.symptoms,
                "severity": allergy.severity.value,
            }
            for allergy in allergies
        ]), 200
   
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al obtener alergias", "error": str(e)}), 500

    
@allergy_blueprint.route('/<int:allergy_id>', methods=['DELETE'])
@jwt_required()
def delete_allergy(allergy_id):
    try:
        current_user_id = get_jwt_identity()
        
        allergy = Allergy.query.filter_by(id=allergy_id, user_id=current_user_id).first()
        
        # Verificar si existe
        if not allergy:
            return jsonify({'msg': 'Registro de alergia no encontrado'}), 404
        
        db.session.delete(allergy)
        db.session.commit()
        
        return jsonify({'msg': 'Alergia eliminada correctamente'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar alergias", "error": str(e)}), 500