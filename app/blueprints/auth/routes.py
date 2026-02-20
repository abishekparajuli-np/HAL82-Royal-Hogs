import re
from flask import jsonify, request, abort
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
    get_jwt_identity,
)
from datetime import datetime
from app.blueprints.auth import auth_bp
from app.extensions import db
from app.models.User import User


def validate_email(email: str) -> bool:

    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_password(password: str) -> list:
    errors = []
    if len(password) < 8:
        errors.append('Password must be at least 8 characters')
    if not re.search(r'[A-Z]', password):
        errors.append('Password must contain at least one uppercase letter')
    if not re.search(r'[a-z]', password):
        errors.append('Password must contain at least one lowercase letter')
    if not re.search(r'\d', password):
        errors.append('Password must contain at least one number')
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        # BUG FIX: errors.append() accepts only one argument.
        # Passing two args (string + password variable) created a tuple in the list.
        errors.append('Password must contain at least one special character: !@#$%^&*(),.?')
    return errors


def validate_username(username: str) -> list:
    errors = []
    # BUG FIX: the two error messages were completely swapped.
    if len(username) > 80:
        errors.append('Username must be 80 characters or less')
    if len(username) < 3:
        errors.append('Username must be at least 3 characters')
    # BUG FIX: regex was missing end anchor ($) and quantifier (+),
    # so a username like "ok!" would incorrectly pass validation.
    if not re.match(r'^[a-zA-Z0-9_]+$', username):
        errors.append('Username can only contain letters, numbers, and underscores')
    return errors


@auth_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        abort(400, 'Request body must be JSON')

    email    = (data.get('email') or '').strip().lower()
    # BUG FIX: data.get('password' or '') evaluates 'password' or '' first,
    # always resolving to the key 'password' — misleading and fragile.
    password = (data.get('password') or '').strip()
    username = (data.get('username') or '').strip().lower()

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
            'message': errors,
            'status_code': 400
        }), 400

    if User.find_by_email(email):
        return jsonify({
            'error': 'Conflict',
            'message': 'Email already registered',
            'status_code': 409
        }), 409

    if User.find_by_username(username):
        return jsonify({
            'error': 'Conflict',
            'message': 'Username already taken',
            'status_code': 409
        }), 409

    user = User(email=email, username=username, role=User.ROLE_USER)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()

    access_token  = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    # BUG FIX: successful resource creation should return 201, not 200.
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict(include_email=True),
        'access_token': access_token,
        'refresh_token': refresh_token,
        'status_code': 201
    }), 201


@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        abort(400, 'Request body must be JSON')

    email    = (data.get('email') or '').strip().lower()
    password = (data.get('password') or '').strip()

    # BUG FIX: original used `and`, so the guard only triggered when BOTH fields
    # were missing. Using `or` correctly catches either field being absent.
    if not email or not password:
        return jsonify({
            'error': 'Bad Request',
            'message': 'Email and password are required',
            'status_code': 400
        }), 400

    user = User.find_by_email(email)
    if not user or not user.check_password(password):
        return jsonify({
            'error': 'Unauthorized',
            'message': 'Invalid email or password',
            'status_code': 401
        }), 401

    if not user.is_active:
        return jsonify({
            'error': 'Forbidden',
            'message': 'Account is disabled. Please contact support.',
            'status_code': 403
        }), 403

    access_token  = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))

    # BUG FIX 1: 'user': user passed a raw SQLAlchemy object — not JSON-serializable.
    # BUG FIX 2: status_code in body was hardcoded to 403. Corrected to 200.
    # BUG FIX 3: HTTP status was missing from the return statement entirely.
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(include_email=True),
        'access_token': access_token,
        'refresh_token': refresh_token,
        'status_code': 200
    }), 200


# BUG FIX: changed GET -> POST. Refresh tokens are credentials and must not
# travel as URL parameters or in a GET request.
@auth_bp.route('/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))

    if not user:
        return jsonify({
            'error': 'Unauthorized',
            'message': 'User not found',
            'status_code': 401
        }), 401

    if not user.is_active:
        return jsonify({
            'error': 'Forbidden',
            'message': 'Account is disabled. Contact support.',
            'status_code': 403
        }), 403

    access_token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': access_token}), 200


@auth_bp.route('/auth/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))

    if not user:
        return jsonify({
            'error': 'Unauthorized',
            'message': 'User not found',
            'status_code': 401
        }), 401

    return jsonify({'user': user.to_dict(include_email=True)}), 200


@auth_bp.route('/auth/logout', methods=['POST'])
@jwt_required()
def logout():
    # NOTE: for production, blocklist the JWT token here (e.g. store jti in Redis).
    return jsonify({'message': 'Logout successful'}), 200