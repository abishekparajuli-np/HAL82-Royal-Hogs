from flask import Blueprint

hati_bp=Blueprint('hati',__name__,url_prefix='/api/hati')

from . import routes