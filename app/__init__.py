from flask import Flask, jsonify
from flask_cors import CORS
from app.config import BaseConfig
from app.extensions import db, migrate, jwt

def create_app():
    app = Flask(__name__, static_folder='static', static_url_path='')
    app.config.from_object(BaseConfig)

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

    _init_extensions(app)
    _register_blueprints(app)
    _register_error_handler(app)
    _register_shell_context(app)

    # --- Add this at the end, before returning ---
    from flask import send_from_directory
    import os

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')


    return app


def _init_extensions(app):
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    _init_redis(app)
    _configure_jwt(app)


def _init_redis(app):
    import redis
    redis_url = app.config.get('REDIS_URL')
    if redis_url:
        try:
            redis_client = redis.from_url(redis_url, decode_responses=True)
            app.extensions['redis'] = redis_client
            app.logger.info('Connection Established With Redis')
        except redis.ConnectionError as e:
            app.logger.warning('Redis connection failed {}'.format(e))
            app.extensions['redis'] = None


def _configure_jwt(app):
    from app.models import User

    @jwt.user_lookup_loader
    def load_user(jwt_header, jwt_data):
        user_id = jwt_data['sub']
        return User.query.get(user_id)

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, error):
        return jsonify({
            'error': 'Token Expired',
            'message': 'Token Already Expired',
            'status_code': 401
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'error': 'Invalid Token',
            'message': 'Token Verification failed',
            'status_code': 401
        }), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'error': 'Authorization Failed',
            'message': 'Missing Access Token',
            'status_code': 401
        }), 401


def _register_blueprints(app):
    from app.blueprints.health import health_bp, routes  
    app.register_blueprint(health_bp, url_prefix='/api')
    from app.blueprints.auth import auth_bp, routes
    app.register_blueprint(auth_bp, url_prefix='/api')


def _register_error_handler(app):
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'error': 'Bad Request',
            'message': str(error.description),
            'status_code': 400,
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'error': 'Not Found',
            'message': str(error.description),
            'status_code': 404
        }), 404 

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'error': 'Internal Error',
            'message': str(error.description),
            'status_code': 500
        }), 500


def _register_shell_context(app):
    @app.shell_context_processor
    def make_shell_context():
        from app.models import User
        return {
            'db': db,
            'User': User
        }