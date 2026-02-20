import time
from flask import request, jsonify
from app.blueprints.hati import hati_bp
from app.models.Services.hati_ai_service import (
    chat_with_hati, fetch_images, fetch_weather,
    get_route_options, reset_history
)


@hati_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    msg = data.get('message', '').strip()
    if not msg:
        return jsonify({'error': 'empty'}), 400
    return jsonify({'response': chat_with_hati(msg)})


@hati_bp.route('/arrival', methods=['POST'])
def arrival():
    data = request.get_json()
    place = data.get('place', 'Nepal')
    lat = data.get('lat', 27.7172)
    lon = data.get('lon', 85.3240)
    imgs = fetch_images(place)
    weather = fetch_weather(lat, lon)
    msg = (f'Tourist just arrived at {place}, Nepal. '
           f'Give the arrival greeting with history, local phrases, '
           f'must-see spots. Under 180 words.')
    reply = chat_with_hati(msg)
    return jsonify({'response': reply, 'images': imgs, 'weather': weather})


@hati_bp.route('/route', methods=['POST'])
def route():
    data = request.get_json()
    dist_km = float(data.get('distance_km', 5))
    lat = data.get('lat', 27.7172)
    lon = data.get('lon', 85.3240)
    weather = fetch_weather(lat, lon)
    return jsonify({'options': get_route_options(dist_km, weather), 'weather': weather})


@hati_bp.route('/weather', methods=['POST'])
def weather():
    data = request.get_json()
    lat = data.get('lat', 27.7172)
    lon = data.get('lon', 85.3240)
    return jsonify(fetch_weather(lat, lon))


@hati_bp.route('/reset', methods=['POST'])
def reset():
    reset_history()
    return jsonify({'ok': True})


@hati_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'timestamp': time.time()})