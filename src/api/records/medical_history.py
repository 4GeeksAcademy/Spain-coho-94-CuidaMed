"""
En este archivo están todas las rutas de Antecedentes Familiare
Ruta /api/records/medical_history
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, MedicalHistory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

medical_history_blueprint = Blueprint('medical_history', __name__)


@medical_history_blueprint.route('/', methods=['POST'])
@jwt_required()
def create_medical_history():
    try:
        current_user_id = get_jwt_identity()

        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        data = request.get_json()

        # Verificar campo requerido parentesco madre/padre
        if 'kinship' not in data:
            return jsonify({"msg": "Falta el campo parentesco madre/padre"}), 400

        # Verificar campo requerido enfermedad
        if 'disease' not in data:
            return jsonify({"msg": "Falta el campo escribir enfermedad"}), 400

        # Crear nuevo registro de antecedentes familiares
        new_medical_history = MedicalHistory(
            user_id=current_user_id,
            kinship=data['kinship'],
            disease=data['disease']
        )

        db.session.add(new_medical_history)
        db.session.commit()

        # No devuelvo registration_date porque no es necesario
        return jsonify({
            'message': "Antecedentes familiares creado con éxito",
            'id': new_medical_history.id,
            'kinship': new_medical_history.kinship,
            'disease': new_medical_history.disease
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al guardar el registro antecedentes familiares", "error": str(e)}), 500
    
    
@medical_history_blueprint.route('/', methods=['GET'])
@jwt_required()
def get_medical_history():
    try:
        current_user_id = get_jwt_identity()
        
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        
        # Buscar todos los antecedentes familiares del usuario
        medical_histories = MedicalHistory.query.filter_by(user_id=current_user_id).all()
       
        return jsonify([
            {
            "id": medical_history.id,
            'kinship': medical_history.kinship,
            'disease': medical_history.disease
            }
            for medical_history in medical_histories
        ]), 200
   
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al obtener antecedentes familiares", "error": str(e)}), 500
    
@medical_history_blueprint.route('/<int:history_id>', methods=['DELETE'])
@jwt_required()
def delete_medical_history(history_id):
    try:

        current_user_id = get_jwt_identity()

        # Buscar el antecedente por ID
        medical_history = MedicalHistory.query.filter_by(
                id=history_id, user_id=current_user_id).first()
        
        # Verificar que existe el antecedente
        if not medical_history:
            return jsonify({"msg": "Antecedentes no encontrado"}), 404
        
        db.session.delete(medical_history)
        db.session.commit()
        
        return jsonify({"msg": "Antecedente eliminado correctamente"}), 200
        
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al eliminar el este antecedente: " + str(e)}), 500

