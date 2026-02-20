import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from app.extensions import db, jwt, migrate
from app.config import config_by_name

# Load .env file
load_dotenv()


def create_app():
    app = Flask(__name__)

    # Load config based on FLASK_ENV
    env = os.getenv("FLASK_ENV", "development")
    app.config.from_object(config_by_name[env])

    # Enable CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:5000",
                "http://127.0.0.1:5000"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })

    _init_extensions(app)
    _register_blueprints(app)
    _register_shell_context(app)
    _configure_jwt(app)

    return app


def _init_extensions(app):
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)


def _register_blueprints(app):
    from app.blueprints.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api")


def _register_shell_context(app):
    from app.models import User
    return app.shell_context_processor(lambda: {
        "db": db,
        "User": User
    })


def _configure_jwt(app):
    from app.models import TokenBlocklist

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        token = TokenBlocklist.query.filter_by(jti=jti).first()
        return token is not None

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            "error": "Token Expired",
            "message": "The token has expired"
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            "error": "Invalid Token",
            "message": "Signature verification failed"
        }), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            "error": "Authorization Required",
            "message": "Request does not contain access token"
        }), 401