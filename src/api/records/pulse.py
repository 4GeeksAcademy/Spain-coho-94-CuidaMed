"""
En este archivo están todas las rutas relacionadas con la mediciòn de Pulso
Ruta /api/records/pulse 
"""
from flask import request, jsonify, Blueprint
from api.models import db, Pulse
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

pulse_blueprint = Blueprint('pulse', __name__)

@pulse_blueprint.route('/', methods=['POST'])
@jwt_required()
def add_pulse_record():
    current_user_id = get_jwt_identity()

    data = request.get_json()

    if not data or not data.get('pulse') or not data.get('manual_datetime'):
        return jsonify({"msg": "Faltan campos por rellenar"}), 400

    try:
        new_pulse = Pulse(
            user_id=current_user_id,
            pulse=data['pulse'],
            manual_datetime=datetime.strptime(
                data['manual_datetime'], "%d-%m-%Y %H:%M"),
            comments=data.get('comments')
        )

        db.session.add(new_pulse)
        db.session.commit()

        return jsonify({"message": "Registro creado con éxito"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al guardar el registro", "error": str(e)}), 500
    
@pulse_blueprint.route('/', methods=['GET'])
@jwt_required()
def get_weight_records():
    current_user_id = get_jwt_identity()

    try:

        records = Pulse.query.filter_by(user_id=current_user_id).order_by(
            Pulse.manual_datetime.desc()).all()

        return jsonify([
            {
                'id': record.id,
                'pulse': record.pulse,
                'manual_datetime': record.manual_datetime.strftime("%d-%m-%Y %H:%M"),
                'comments': record.comments
            }
            for record in records
        ]), 200

    except Exception as e:
        return jsonify({"msg": "Error al obtener los registros", "error": str(e)}), 500

