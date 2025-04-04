from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, DateTime, Float, Enum, Date, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import ForeignKey
from datetime import date
from datetime import datetime
from typing import List
import enum

db = SQLAlchemy()

# Por ahora 10 Tablas, 01/04/2025 => 8/10


class User(db.Model):
    __tablename__ = 'users'

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(String(256), nullable=False)
    registration_date: Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.now(), nullable=False)

    # Relaciones
    general_data = relationship(
        "GeneralData", back_populates="user", cascade="all, delete-orphan")
    emergency_contacts = relationship(
        "EmergencyContact", back_populates="user")
    medical_history = relationship(
        "MedicalHistory", back_populates="user", cascade="all, delete-orphan")
    weight_history: Mapped[List["Weight"]
                           ] = relationship(back_populates="user", cascade="all, delete-orphan")
    height_history: Mapped[List["Height"]
                           ] = relationship(back_populates="user", cascade="all, delete-orphan")
    pulse_history: Mapped[List["Pulse"]
                          ] = relationship(back_populates="user", cascade="all, delete-orphan")
    blood_pressure_history: Mapped[List["BloodPressure"]] = relationship(
        back_populates="user", cascade="all, delete-orphan")
    allergies: Mapped[List["Allergy"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    glucose_history: Mapped[List["Glucose"]] = relationship(
        back_populates="user", cascade="all, delete-orphan")

    # Constructor para la clase User que inicializa con email y password

    def __init__(self, email, password):
        self.email = email
        self.set_password(password)

    # Método para establecer la contraseña (hasheada)
    def set_password(self, password):
        self.password = generate_password_hash(password)

    # Método para verificar si una contraseña coincide con el hash almacenado
    def check_password(self, password):
        return check_password_hash(self.password, password)

    def serialize_user(self):

        return {
            "id": self.id,
            "email": self.email,
            "registration_date": self.registration_date.isoformat(),
        }


class Gender (enum.Enum):

    # Enumeraciones para los campos con opciones fijas
    # Tomar en cuenta en el frontend que los inputs del select, sean exactamente iguales que los que están en los "Enum"
    # Opciones de Generos
    GENDER_MALE = "M"
    GENDER_FEMALE = "F"
    GENDER_NONBINARY = "NB"
    GENDER_OTHER = "O"
    GENDER_NONE = "NS/NC"


class BloodType (enum.Enum):

    # Tipos de sangre
    BLOOD_A_POSITIVE = "A+"
    BLOOD_A_NEGATIVE = "A-"
    BLOOD_B_POSITIVE = "B+"
    BLOOD_B_NEGATIVE = "B-"
    BLOOD_AB_POSITIVE = "AB+"
    BLOOD_AB_NEGATIVE = "AB-"
    BLOOD_O_POSITIVE = "O+"
    BLOOD_O_NEGATIVE = "O-"


class PhysicalActivity (enum.Enum):

    # Actividad Fisica
    ACTIVITY_SEDENTARY = "Sedentario"
    ACTIVITY_LIGHT = "Leve"
    ACTIVITY_MODERATE = "Moderado"
    ACTIVITY_INTENSE = "Intenso"
    ACTIVITY_ATHLETE = "Atleta"


class GeneralData(db.Model):
    __tablename__ = 'general_data'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), unique=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    birth_date: Mapped[date] = mapped_column(Date, nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False)
    last_weight: Mapped[float] = mapped_column(
        Float(precision=2), nullable=True) # ejemplo 55,20 en kg - en caso exacto seria 55.0 en kg
    last_height: Mapped[float] = mapped_column(
        Float(precision=2), nullable=True) # ejemplo 1.25 en m
    BMI:  Mapped[float] = mapped_column(Float(precision=2), nullable=True) # El peso se mide en kilogramos (kg), La altura se mide en metros (m)
    gender: Mapped[Gender] = mapped_column(
        Enum(Gender, name="gender_enum"), nullable=False)
    blood_type: Mapped[BloodType] = mapped_column(
        Enum(BloodType, name="blood_type_enum"), nullable=True)
    dietary_preferences: Mapped[str] = mapped_column(
        String(150), nullable=True)
    physical_activity: Mapped[PhysicalActivity] = mapped_column(
        Enum(PhysicalActivity, name="activity_level_enum"), nullable=True)

    # Relación con el usuario
    user = relationship("User", back_populates="general_data")

    def serialize_general_data(self):

        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'birth_date': self.birth_date.isoformat(),
            'phone': self.phone,
            'last_weight': self.last_weight,
            'last_height': self.last_height,
            'BMI': self.BMI,
            'gender': self.gender.value if self.gender else None,
            'blood_type': self.blood_type.value if self.blood_type else None,
            'dietary_preferences': self.dietary_preferences,
            'physical_activity': self.physical_activity.value if self.physical_activity else None,
        }


class EmergencyContact(db.Model):
    __tablename__ = 'emergency_contacts'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id'), nullable=False)
    first_name_contact: Mapped[str] = mapped_column(
        String(100), nullable=False)
    last_name_contact: Mapped[str] = mapped_column(String(100), nullable=False)
    relationship_type: Mapped[str] = mapped_column(String(50), nullable=False)
    phone_contact: Mapped[str] = mapped_column(String(20), nullable=False)
    email_contact: Mapped[str] = mapped_column(String(100), nullable=False)

    # Relación con el usuario
    user = relationship(
        "User", back_populates="emergency_contacts")

    def serialize_emergency_contacts(self):

        return {
            'id': self.id,
            'user_id': self.user_id,
            'first_name_contact': self.first_name_contact,
            'last_name_contact': self.last_name_contact,
            'relationship_type': self.relationship_type,
            'phone_contact': self.phone_contact,
            'email_contact': self.email_contact
        }


class MedicalHistory(db.Model):
    __tablename__ = 'medical_history'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id'), nullable=False)
    registration_date:  Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.now(), nullable=False)
    kinship: Mapped[str] = mapped_column(
        String(50), nullable=False)  # parentesco(Madre-Padre)
    disease: Mapped[str] = mapped_column(
        String(150), nullable=False)  # enfermedad

    # Relación con el usuario
    user = relationship(
        "User", back_populates="medical_history")

    def serialize_medical_history(self):

        return {
            'id': self.id,
            'user_id': self.user_id,
            'registration_date': self.registration_date.isoformat(),
            'kinship': self.kinship,
            'disease': self.disease
        }


class Weight(db.Model):
    __tablename__ = 'weight'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id'), nullable=False)
    registration_date:  Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.now(), nullable=False)
    weight: Mapped[float] = mapped_column(Float(precision=2), nullable=False)

    # Relación con el usuario
    user = relationship("User", back_populates="weight_history")

    def serialize_weight(self):

        return {
            'id': self.id,
            'user_id': self.user_id,
            'registration_date': self.registration_date.isoformat(),
            'weight': self.weight
        }


class Height(db.Model):
    __tablename__ = 'height'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id'), nullable=False)
    registration_date:  Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.now(), nullable=False)
    height: Mapped[float] = mapped_column(Float(precision=2), nullable=False)

    # Relacion con el Usuario
    user = relationship("User", back_populates="height_history")

    def serialize_height(self):

        return {
            'id': self.id,
            'user_id': self.user_id,
            'registration_date': self.registration_date.isoformat(),
            'height': self.height
        }


class Pulse(db.Model):
    __tablename__ = 'pulse'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id'), nullable=False)
    registration_date: Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.now())
    pulse: Mapped[int] = mapped_column(Integer, nullable=False)

    # Relationship
    user = relationship("User", back_populates="pulse_history")

    def serialize_pulse(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'registration_date': self.registration_date.isoformat(),
            'pulse': self.pulse
        }


class BloodPressure(db.Model):
    __tablename__ = 'blood_pressure'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id'), nullable=False)
    registration_date: Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.now())
    systolic: Mapped[int] = mapped_column(Integer, nullable=False)  # Sistólica
    diastolic: Mapped[int] = mapped_column(
        Integer, nullable=False)  # Diastólica

    # Relacion con Usuario
    user = relationship("User", back_populates="blood_pressure_history")

    def serialize_blood_pressure(self):

        return {
            'id': self.id,
            'user_id': self.user_id,
            'registration_date': self.registration_date.isoformat(),
            'systolic': self.systolic,
            'diastolic': self.diastolic
        }


class SeverityEnum(enum.Enum):

    LEVE = "Leve"
    MODERADA = "Moderada"
    GRAVE = "Grave"
    MUY_GRAVE = "Muy grave"


class Allergy(db.Model):
    __tablename__ = 'allergies'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id'), nullable=False)
    registration_date: Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.now())
    allergen: Mapped[str] = mapped_column(
        String(100), nullable=False)  # Qué causa la alergia
    desencadenante: Mapped[str] = mapped_column(
        String(200), nullable=False)  # Qué activa la reacción
    symptoms: Mapped[str] = mapped_column(
        String(300), nullable=False)  # Síntomas que experimenta
    severity: Mapped[SeverityEnum] = mapped_column(
        Enum(SeverityEnum), name="severity_enum", nullable=False)

    # Relacion con el usuario
    user = relationship("User", back_populates="allergies")

    def serialize_allergy(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'registration_date': self.registration_date.isoformat(),
            'allergen': self.allergen,
            'desencadenante': self.desencadenante,
            'symptoms': self.symptoms,
            'severity': self.severity.value if self.severity else None
        }


class Glucose(db.Model):
    __tablename__ = 'glucose'

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey('users.id'), nullable=False)
    registration_date: Mapped[datetime] = mapped_column(
        DateTime(), default=datetime.now())
    glucose: Mapped[float] = mapped_column(Float(precision=2), nullable=False)

    # Relacion con el usuario
    user = relationship("User", back_populates="glucose_history")

    def serialize_glucose(self):

        return {
            'id': self.id,
            'user_id': self.user_id,
            'registration_date': self.registration_date.isoformat(),
            'glucose': self.glucose
        }
