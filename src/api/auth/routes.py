"""
En este archivo están todas las rutas del Autenticacion de Usuario
Signup(Registro Usuario - Login Usuario)
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import os
import secrets
from google.oauth2 import id_token
from google.auth.transport import requests

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()

    # Validar datos recibidos
    if not data or not data.get('email') or not data.get('password') or not data.get('confirmarpassword'):
        return jsonify({"error": "Datos incompletos"}), 400

    # Verificar si el usuario ya existe
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "El correo electrónico ya está registrado"}), 409

    # Crear nuevo usuario
    new_user = User(
        email=data['email'],
        password=data['password']
    )

    # Guardar en la base de datos
    db.session.add(new_user)
    db.session.commit()

    # Generar tokens
    access_token = create_access_token(identity=str(new_user.id))

    return jsonify({
        "message": "Usuario registrado exitosamente",
        "user_id": new_user.id,
        "access_token": access_token
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    # Validar datos recibidos
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"error": "Datos incompletos"}), 400

    # Buscar usuario por email
    user = User.query.filter_by(email=data['email']).first()

    # Verificar credenciales
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Credenciales inválidas"}), 401

    # Generar tokens
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "access_token": access_token,
        "user_id": user.id
    }), 200

@auth_bp.route("/google-login", methods=["POST"])
def google_login():
    data = request.get_json()
    token = data.get("token")
    print(os.getenv("VITE_GOOGLE_CLIENT_ID"))
    try:
        # Verifica el token
        google_info = id_token.verify_oauth2_token(token, requests.Request(), os.getenv("VITE_GOOGLE_CLIENT_ID"))

        email = google_info['email']
        name = google_info.get('name')

        # Buscar o crear usuario en tu BD
        google_user = User.query.filter_by(email=email).first()
        if not google_user:
            random_password = secrets.token_urlsafe(32)
            is_new_user = True
            google_user = User(email=email, password=random_password)  # o un campo especial
            db.session.add(google_user)
            db.session.commit()
        else:
            is_new_user = False

        # Generar token JWT interno
        access_token = create_access_token(identity=str(google_user.id))

        return jsonify({
            "message": "Usuario registrado exitosamente",
            "user_id": google_user.id,
            "access_token": access_token,
            "new_user": is_new_user
        }), 201

    except ValueError:
        return jsonify({"error": "Token inválido"}), 401
