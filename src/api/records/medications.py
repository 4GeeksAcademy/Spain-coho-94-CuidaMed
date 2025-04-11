"""
En este archivo están todas las rutas de medicación/tratamientos
Ruta /api/records/medications
"""
from flask import request, jsonify, Blueprint
from api.models import db, Medication
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

medications_blueprint = Blueprint('medications', __name__)

@medications_blueprint.route('/', methods=['POST'])
@jwt_required()
def create_medication():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Verificar datos obligatorios
    if 'medication_name' not in data:
        return jsonify({"message": "El nombre del medicamento es obligatorio"}), 400
    
    # Crear nuevo objeto de medicamento
    new_medication = Medication(
        user_id=current_user_id,
        medication_name=data['medication_name'],
        dosage_instructions=data.get('dosage_instructions'),
        adverse_reactions=data.get('adverse_reactions')
    )
    
    # Procesar fechas si están presentes
    if 'treatment_start_date' in data and data['treatment_start_date']:
        try:
            new_medication.treatment_start_date = datetime.strptime(data['treatment_start_date'], "%d-%m-%Y")
        except ValueError:
            return jsonify({"message": "Formato de fecha inválido para fecha de inicio"}), 400
    
    if 'treatment_end_date' in data and data['treatment_end_date']:
        try:
            new_medication.treatment_end_date = datetime.strptime(data['treatment_end_date'], "%d-%m-%Y")
        except ValueError:
            return jsonify({"message": "Formato de fecha inválido para fecha de fin"}), 400
    
    db.session.add(new_medication)
    db.session.commit()
    
    return jsonify(new_medication.serialize_medication()), 201


@medications_blueprint.route('/', methods=['GET'])
@jwt_required()
def get_medications():
    current_user_id = get_jwt_identity()
    
    try:
        # Buscar todos los medicamentos del usuario ordenados por fecha de registro (más recientes primero)
        user_medications = Medication.query.filter_by(user_id=current_user_id).order_by(Medication.registration_date.desc()).all()
        
        # Serializar los resultados
        medications_list = [medication.serialize_medication() for medication in user_medications]
        
        # Construir respuesta
        response = {
            "data": medications_list,
            "medications_empty": len(medications_list) == 0
        }
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({"msg": "Error al obtener los tratamientos", "error": str(e)}), 500