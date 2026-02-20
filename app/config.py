from datetime import timedelta
import os
class BaseConfig:

    SECRET_KEY=os.getenv('SECRET_KEY','dev-fallback-key-change-me')

    SQLALCHEMY_DATABASE_URI = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:abishek@localhost:5432/ratna_forum"
    )

    REDIS_URL = os.getenv(
        "REDIS_URL",
        "redis://localhost:6379/0"
    )

    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,       
        'pool_recycle': 300,         
        'pool_size': 10,             
        'max_overflow': 20,          
    }

    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-dev-key-change-me')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME= 'Authorization'
    JWT_HEADER_TYPE='Bearer'
    JWT_COOKIE_CSRF_PROTECT = False  