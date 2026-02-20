import re
from flask import jsonify, request, abort
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    create_access_token,
    get_jwt
)

from app.blueprints.auth import auth_bp
from app.extensions import db
from app.models import User, TokenBlocklist



def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_password(password: str) -> list:
    errors = []

    if len(password) < 8:
        errors.append('Password must contain at least 8 characters')

    if not re.search(r'[A-Z]', password):
        errors.append('Password must contain at least one uppercase letter')

    if not re.search(r'[a-z]', password):
        errors.append('Password must contain at least one lowercase letter')

    if not re.search(r'\d', password):
        errors.append('Password must contain at least one number')

    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append('Password must contain at least one special character')

    return errors


def validate_username(username: str) -> list:
    errors = []

    if len(username) < 3:
        errors.append("Username must be at least 3 characters")

    if len(username) > 80:
        errors.append("Username must be 80 characters or less")

    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        errors.append('Username can contain only letters, numbers and underscores')

    return errors




@auth_bp.route('/auth/register', methods=['POST'])
def register():

    data = request.get_json()

    if not data:
        abort(400, description="Request body must be JSON")

    email = (data.get('email') or '').strip().lower()
    username = (data.get('username') or '').strip()
    password = data.get('password') or ''

    errors = []

    if not email:
        errors.append('Email is required')
    elif not validate_email(email):
        errors.append('Invalid email format')

    if not username:
        errors.append('Username is required')
    else:
        errors.extend(validate_username(username))

    if not password:
        errors.append('Password is required')
    else:
        errors.extend(validate_password(password))

    if errors:
        return jsonify({
            'error': 'Validation Error',
            'message': errors
        }), 400

    if User.find_by_email(email):
        return jsonify({
            'error': 'Conflict',
            'message': 'Email already registered'
        }), 409

    if User.find_by_username(username):
        return jsonify({
            'error': 'Conflict',
            'message': 'Username already taken'
        }), 409

    user = User(
        email=email,
        username=username,
        role=User.ROLE_USER
    )
    user.set_password(password)

    db.session.add(user)
    db.session.commit()

    return jsonify({
        'message': 'User Registered Successfully',
        'user': user.to_dict(include_email=True)
    }), 201



@auth_bp.route('/auth/login', methods=['POST'])
def login():

    data = request.get_json()

    if not data:
        abort(400, description="Request body must be JSON")

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({
            'error': 'Bad Request',
            'message': 'Email and password are required'
        }), 400

    user = User.find_by_email(email)

    if not user or not user.check_password(password):
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Invalid email or password'
        }), 401

    if not user.is_active:
        return jsonify({
            'error': 'Forbidden',
            'message': 'Account is disabled'
        }), 403

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        'message': 'Login Successful',
        'access_token': access_token,
        'user': user.to_dict(include_email=True)
    }), 200




@auth_bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():

    user_id = get_jwt_identity()
    user = User.query.get(int(user_id))

    if not user:
        return jsonify({
            'error': 'Not Found',
            'message': 'User not found'
        }), 404

    return jsonify({
        'user': user.to_dict(include_email=True)
    }), 200



@auth_bp.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():

    jwt_payload = get_jwt()
    jti = jwt_payload["jti"]

    blocked_token = TokenBlocklist(jti=jti)
    db.session.add(blocked_token)
    db.session.commit()

    return jsonify({
        'message': 'Logout Successful'
    }), 200