from flask import Flask, jsonify
from flask_cors import CORS
from app.extensions import db,jwt,migrate

def create_app():
    app = Flask(__name__)

    CORS(app, resources={
        r'/api/*': {
            "origins": [
                "http://localhost:5173", "http://127.0.0.1:5173",
                "http://localhost:5000", "http://127.0.0.1:5000"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    })




    return app

def _init_extensions(app):
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app,db)