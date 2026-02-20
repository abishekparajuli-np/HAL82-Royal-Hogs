import os

class BaseConfig:
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-fallback-key-change-me')
    