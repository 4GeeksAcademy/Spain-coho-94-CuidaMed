"""
En este archivo están todas las rutas de Datos Generales
Ruta /api/users/general-data
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, GeneralData, Gender, BloodType, PhysicalActivity, BloodPressure, Glucose, Weight, Medication, EmergencyContact
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import or_
from datetime import datetime

users_bp = Blueprint('users', __name__)


@users_bp.route('/dashboard', methods=['GET'])
@jwt_required()
def user_dashboard():
    try:
        # Obtener ID del usuario actual
        current_user_id = get_jwt_identity()
        
        # Verificar existencia del usuario
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({'error': 'Usuario no encontrado', 'code': 'USER_NOT_FOUND'}), 404

        # Inicializar valores por defecto
        response = {
            'last_blood_pressure': None,
            'last_glucose': None,
            'last_weight': None,
            'last_emergency_contact': None,
            'current_medication': []
        }
        
        # Obtener última tensión arterial
        try:
            last_blood_pressure = BloodPressure.query.filter_by(user_id=current_user_id).order_by(BloodPressure.manual_datetime.desc()).first()
            response['last_blood_pressure'] = last_blood_pressure.serialize_blood_pressure() if last_blood_pressure else None
        except Exception as e:
            # Registrar el error pero continuar con el resto de consultas
            print(f"Error al obtener la tensión arterial: {str(e)}")
            # Opcionalmente, podrías agregar un logger más sofisticado aquí
            
        # Obtener última glucosa
        try:
            last_glucose = Glucose.query.filter_by(user_id=current_user_id).order_by(Glucose.manual_datetime.desc()).first()
            response['last_glucose'] = last_glucose.serialize_glucose() if last_glucose else None
        except Exception as e:
            print(f"Error al obtener la glucosa: {str(e)}")
            
        # Obtener último peso
        try:
            last_weight = Weight.query.filter_by(user_id=current_user_id).order_by(Weight.manual_datetime.desc()).first()
            response['last_weight'] = last_weight.serialize_weight() if last_weight else None
        except Exception as e:
            print(f"Error al obtener el peso: {str(e)}")
            
        # Obtener medicaciones actuales
        try:
            last_medication = Medication.query.filter(
                Medication.user_id == current_user_id,
                or_(Medication.treatment_end_date > datetime.now(), Medication.treatment_end_date == None)
            ).order_by(Medication.registration_date.desc()).limit(3).all()
            response['current_medication'] = [medication.serialize_medication() for medication in last_medication] if last_medication else []
        except Exception as e:
            print(f"Error al obtener las medicaciones: {str(e)}")
            
        # Obtener contacto de emergencia
        try:
            emergency_contact = EmergencyContact.query.filter_by(user_id=current_user_id).first()
            response['last_emergency_contact'] = emergency_contact.serialize_emergency_contact() if emergency_contact else None
        except Exception as e:
            print(f"Error al obtener el contacto de emergencia: {str(e)}")
            
        # Verificar si se obtuvo al menos un dato
        all_empty = (
            response['last_blood_pressure'] is None and
            response['last_glucose'] is None and
            response['last_weight'] is None and
            response['last_emergency_contact'] is None and
            len(response['current_medication']) == 0
        )
        
        # Opcionalmente, puedes incluir esta información en la respuesta
        response['all_empty'] = all_empty
        
        return jsonify(response), 200
        
    except Exception as e:
        # Manejo de errores generales
        import traceback
        error_details = traceback.format_exc()
        print(f"Error no capturado en dashboard: {str(e)}\n{error_details}")
        
        # En producción, podrías querer ocultar los detalles de error al usuario
        return jsonify({
            'error': 'Ha ocurrido un error al obtener los datos del dashboard',
            'code': 'DASHBOARD_ERROR',
            # Solo incluir detalles en desarrollo/staging
            'details': str(e) if app.config.get('DEBUG', False) else None
        }), 500


@users_bp.route('/general-data', methods=['GET'])
@jwt_required()
def get_general_data():
    try:
        current_user_id = get_jwt_identity()

        # Buscar datos generales
        general_data = GeneralData.query.filter_by(
            user_id=current_user_id).first()

        if not general_data:
            return jsonify({'msg': 'No hay datos generales registrados para este usuario'}), 404

        return jsonify({
            'general_data': general_data.serialize_general_data()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Método POST para crear datos generales
@users_bp.route('/general-data', methods=['POST'])
@jwt_required()
def add_general_data():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        # Verificar que se proporcionen los datos necesarios
        # Estos datos los debe ingresar el Usuario, son requeridos(Obligatorios)
        required_fields = ['name', 'birth_date', 'phone', 'gender']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'El campo {field} es requerido'}), 400

        # Parsear la fecha de nacimiento al formato DD-MM-YY
        try:
            # Puede ser que el usuario ingresa la fecha en formato DD-MM-YYYY o DD-MM-YY
            birth_date_str = data['birth_date']
            # Varios formatos comunes
            for fmt in ['%d-%m-%Y', '%d-%m-%y', '%d/%m/%Y', '%d/%m/%y']:
                try:
                    birth_date = datetime.strptime(birth_date_str, fmt)
                    # Pasa al formato deseado DD-MM-YY
                    formatted_birth_date = birth_date.strftime('%d-%m-%y')
                    break
                except ValueError:
                    continue
            else:
                # Si ninguno de los formatos funciona
                return jsonify({'error': 'Formato de fecha inválido. Use DD-MM-YYYY o DD-MM-YY'}), 400
        except Exception as e:
            return jsonify({'error': f'Error al procesar la fecha: {str(e)}'}), 400

        # Verificar si ya existen datos generales
        existing_data = GeneralData.query.filter_by(
            user_id=current_user_id).first()
        if existing_data:
            return jsonify({'error': 'Ya existen datos generales para este usuario. Deseas editarlos'}), 409

        # Crear nuevos datos generales con la fecha formateada
        general_data = GeneralData(
            user_id=current_user_id,
            name=data['name'],
            birth_date=formatted_birth_date,  # Usamos la fecha formateada
            phone=data['phone'],
            gender=Gender[data['gender']] if data['gender'] in [
                g.name for g in Gender] else None
        )

        # Añadir campos opcionales si se proporcionan
        if 'last_weight' in data:
            general_data.last_weight = data['last_weight']
        if 'last_height' in data:
            general_data.last_height = data['last_height']
        if 'BMI' in data:
            general_data.BMI = data['BMI']
        if 'blood_type' in data:
            general_data.blood_type = BloodType[data['blood_type']] if data['blood_type'] in [
                bt.name for bt in BloodType] else None
        if 'dietary_preferences' in data:
            general_data.dietary_preferences = data['dietary_preferences']
        if 'physical_activity' in data:
            general_data.physical_activity = PhysicalActivity[data['physical_activity']] if data['physical_activity'] in [
                pa.name for pa in PhysicalActivity] else None

        db.session.add(general_data)
        db.session.commit()

        return jsonify({
            'msg': 'Datos generales creados exitosamente',
            'general_data': general_data.serialize_general_data()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

    
@users_bp.route('/general-data', methods=['PUT'])
@jwt_required()
def update_general_data():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        # Función para parsear fechas en múltiples formatos
        general_data = GeneralData.query.filter_by(
            user_id=current_user_id).first()

        if not general_data:
            return jsonify({'error': 'No existen datos generales para este usuario'}), 404

        # Función para parsear fechas en múltiples formatos
        def parse_date(date):
            formats = ['%d-%m-%Y', '%Y-%m-%d']
            for format in formats:
                try:
                    return datetime.strptime(date, format).date()
                except ValueError:
                    continue
            raise ValueError('Invalid date format')

        # Actualización directa de campos
        if 'name' in data:
            general_data.name = data['name']

        if 'birth_date' in data:
            # Manejar tanto DD-MM-YYYY como YYYY-MM-DD
            if isinstance(data['birth_date'], str):
                general_data.birth_date = parse_date(data['birth_date'])
            else:
                general_data.birth_date = data['birth_date']

        if 'phone' in data:
            general_data.phone = data['phone']

        if 'gender' in data:
            general_data.gender = Gender[data['gender']] if data['gender'] in [
                g.name for g in Gender] else None

        if 'last_weight' in data:
             general_data.last_weight = float(data['last_weight']) if data['last_weight'] is not None else None

        if 'last_height' in data:
            general_data.last_height = float(
                data['last_height']) if data['last_height'] is not None else None

        if 'blood_type' in data:
            general_data.blood_type = BloodType[data['blood_type']] if data['blood_type'] in [
                bt.name for bt in BloodType] else None

        if 'dietary_preferences' in data:
            general_data.dietary_preferences = data['dietary_preferences']

        if 'physical_activity' in data:
            general_data.physical_activity = (
                PhysicalActivity[data['physical_activity']]
                if data['physical_activity'] in [pa.name for pa in PhysicalActivity]
                else None
            )

        db.session.commit()

        return jsonify({
            'msg': 'Datos generales actualizados exitosamente',
            'general_data': general_data.serialize_general_data()
        }), 200

    except ValueError as e:
        return jsonify({'error': str(e)}), 422
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
