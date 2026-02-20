from flask import Blueprint

auth_bp = Blueprint(__name__, url_prefix='/api')

from app.blueprints.auth import routes