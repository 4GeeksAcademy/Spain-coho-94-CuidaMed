"""
En este archivo están todas las rutas de Contacto de Emergencia, por ahora mantedremos solo 1 contacto por usuario
Ruta /api/records/emergency_contact
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, EmergencyContact
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

emergency_contact_blueprint = Blueprint('emergency_contact', __name__)

# En este método se toma en cuenta que si el contacto ya existe, el usuario lo puede modificar el contacto
# Si el contacto de emergencia no existe, el usuario lo crea
@emergency_contact_blueprint.route('/', methods=['POST'])
@jwt_required()
def create_emergency_contact():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({"msg": "No se recibieron datos"}), 400

        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404
        
        # Verificar si ya existe un contacto de emergencia para este usuario
        existing_contact = EmergencyContact.query.filter_by(user_id=current_user_id).first()
        
        if existing_contact:
            # Actualizar el contacto existente
            existing_contact.first_name_contact = data['first_name_contact']
            existing_contact.last_name_contact = data['last_name_contact']
            existing_contact.relationship_type = data['relationship_type']
            existing_contact.phone_contact = data['phone_contact']
            existing_contact.email_contact = data['email_contact']
            
            db.session.commit()
            
            return jsonify({
                "message": "Contacto de emergencia actualizado exitosamente",
                "contact": existing_contact.serialize_emergency_contacts()
            }), 200
        else:
            # Crear un nuevo contacto si no existe
            new_contact = EmergencyContact(
                user_id=current_user_id,
                first_name_contact=data['first_name_contact'],
                last_name_contact=data['last_name_contact'],
                relationship_type=data['relationship_type'],
                phone_contact=data['phone_contact'],
                email_contact=data['email_contact']
            )
            
            db.session.add(new_contact)
            db.session.commit()
            
            return jsonify({
                "message": "Contacto de emergencia creado exitosamente",
                "contact": new_contact.serialize_emergency_contacts()
            }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"msg": "Error al guardar/actualizar contacto", "error": str(e)}), 500
    

@emergency_contact_blueprint.route('/', methods=['GET'])
@jwt_required()
def get_emergency_contact():
    try:
        # Obtener el ID del usuario actual
        current_user_id = get_jwt_identity()
        
        # Verificar si el usuario existe
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        # Buscar el contacto de emergencia del usuario
        contact = EmergencyContact.query.filter_by(user_id=current_user_id).first()
        
        if not contact:
            return jsonify({"message": "No se encontró contacto de emergencia para este usuario"}), 404
        
        return jsonify(contact.serialize_emergency_contacts()), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Visto que por ahora se va a manejar un solo contacto de emergencia por usuario, 
# no esta especificado el id del contacto de emergencia(porqué solo existirá 1)
@emergency_contact_blueprint.route('/', methods=['DELETE'])
@jwt_required()
def delete_emergency_contact():
    try:
        # Obtener el ID del usuario actual
        current_user_id = get_jwt_identity()
        
        # Verificar si el usuario existe
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404
        
        # Buscar el contacto de emergencia del usuario
        contact = EmergencyContact.query.filter_by(user_id=current_user_id).first()
        
        if not contact:
            return jsonify({"message": "No se encontró contacto de emergencia para este usuario"}), 404
        
        # Eliminar el contacto
        db.session.delete(contact)
        db.session.commit()
        
        return jsonify({"message": "Contacto de emergencia eliminado exitosamente"}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500





