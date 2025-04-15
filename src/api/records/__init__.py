from .weight import weight_blueprint
from .personal_antecedents import personal_antecedents_blueprint
from .pulse import pulse_blueprint
from .medications import medications_blueprint
from .medical_history import medical_history_blueprint
from flask import Blueprint

from .blood_pressure import blood_pressure_blueprint
from .emergency_contact import emergency_contact_blueprint
from .glucose import glucose_blueprint
from .height import height_blueprint

records_blueprint = Blueprint('records', __name__)

records_blueprint.register_blueprint(
    blood_pressure_blueprint, url_prefix='/bloodpressure')

records_blueprint.register_blueprint(
    emergency_contact_blueprint, url_prefix='/emergency_contact')

records_blueprint.register_blueprint(glucose_blueprint, url_prefix='/glucose')

records_blueprint.register_blueprint(height_blueprint, url_prefix='/height')

records_blueprint.register_blueprint(
    medical_history_blueprint, url_prefix='/medical_history')

records_blueprint.register_blueprint(
    medications_blueprint, url_prefix='/medications')

records_blueprint.register_blueprint(
    personal_antecedents_blueprint, url_prefix='/personal_antecedents')

records_blueprint.register_blueprint(pulse_blueprint, url_prefix='/pulse')

records_blueprint.register_blueprint(weight_blueprint, url_prefix='/weight')
