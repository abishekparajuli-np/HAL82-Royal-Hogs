import time
from flask import request, jsonify
from app.blueprints.hati import hati_bp
from app.models.Services.hati_ai_service import (
    chat_with_hati,
    chat_with_hati_rich,
    reset_history,
    fetch_weather,
    get_route_options,
    fetch_images,
)


@hati_bp.route('/chat', methods=['POST'])
def chat():
    data = request.get_json(silent=True) or {}
    msg = data.get('message', '').strip()
    if not msg:
        return jsonify({'error': 'Message is required'}), 400

    result = chat_with_hati_rich(msg)          # returns {reply, images}

    return jsonify({
        'response': result['reply'],
        'images':   result['images'],           # {} when not an itinerary request
    })


@hati_bp.route('/arrival', methods=['POST'])
def arrival():
    data = request.get_json(silent=True) or {}
    place = data.get('place', 'Nepal').strip()
    lat   = float(data.get('lat', 27.7172))
    lon   = float(data.get('lon', 85.3240))

    imgs    = fetch_images(place)
    weather = fetch_weather(lat, lon)

    prompt = (
        f'Tourist just arrived at {place}, Nepal. '
        f'Give the arrival greeting with history, local phrases, '
        f'and must-see spots. Under 180 words.'
    )
    reply = chat_with_hati(prompt)

    return jsonify({
        'response': reply,
        'images':   imgs,
        'weather':  weather,
    })


@hati_bp.route('/route', methods=['POST'])
def route():
    data    = request.get_json(silent=True) or {}
    dist_km = float(data.get('distance_km', 5))
    lat     = float(data.get('lat', 27.7172))
    lon     = float(data.get('lon', 85.3240))

    weather = fetch_weather(lat, lon)
    options = get_route_options(dist_km, weather)

    return jsonify({
        'options': options,
        'weather': weather,
    })


@hati_bp.route('/weather', methods=['POST'])
def weather():
    data = request.get_json(silent=True) or {}
    lat  = float(data.get('lat', 27.7172))
    lon  = float(data.get('lon', 85.3240))

    return jsonify(fetch_weather(lat, lon))


@hati_bp.route('/reset', methods=['POST'])
def reset():
    reset_history()
    return jsonify({'ok': True})


@hati_bp.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'timestamp': time.time()})