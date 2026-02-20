import threading
import requests as req
from groq import Groq

client = None
WEATHER_API_KEY = ''

SYSTEM_PROMPT = """
You are HATI (Himalayan Adaptive Travel Intelligence), a friendly local guide for Nepal.

When a tourist ARRIVES at or asks about a place:
1. Start with: "Namaste! 🙏 Welcome to [place]!"
2. 2-3 sentences on history & significance
3. Local phrases section (label it "🗣️ Useful Local Phrases:"):
   - [Phrase] ([Pronunciation]) = [Meaning]
   Give 3 phrases specific to that location/culture
4. Must-see spots section (label it "📸 Must-See Here:"):
   List 3 spots, one line each

For follow-up questions: reply in max 4 sentences.
For transport questions: suggest Tempo/Microbus/Taxi/Bus with NPR costs.
STRICT: Never exceed 180 words. Be warm, local, and concise.
"""

conversation_history = []
history_lock = threading.Lock()


def init_app(app):
    global client, WEATHER_API_KEY
    api_key = app.config.get('GROQ_API_KEY')
    if not api_key:
        app.logger.warning('GROQ_API_KEY not set — HATI will not work')
        return
    client = Groq(api_key=api_key)
    WEATHER_API_KEY = app.config.get('WEATHER_API_KEY', '')
    app.logger.info('HATI AI Service initialized')


def chat_with_hati(message):
    if not client:
        return 'HATI service not initialized. Check GROQ_API_KEY.'
    with history_lock:
        conversation_history.append({'role': 'user', 'content': message})
        msgs = list(conversation_history)
    try:
        res = client.chat.completions.create(
            model='llama-3.3-70b-versatile',
            max_tokens=320,
            messages=[{'role': 'system', 'content': SYSTEM_PROMPT}, *msgs]
        )
        reply = res.choices[0].message.content
        with history_lock:
            conversation_history.append({'role': 'assistant', 'content': reply})
        return reply
    except Exception as e:
        return f'Error: {str(e)}'


def reset_history():
    with history_lock:
        conversation_history.clear()


def fetch_images(place_name, count=4):
    images = []
    try:
        r1 = req.get('https://en.wikipedia.org/w/api.php', params={
            'action': 'query', 'titles': place_name,
            'prop': 'pageimages', 'piprop': 'thumbnail',
            'pithumbsize': 500, 'format': 'json', 'origin': '*'
        }, timeout=6)
        for page in r1.json().get('query', {}).get('pages', {}).values():
            src = page.get('thumbnail', {}).get('source')
            if src:
                images.append(src)

        r2 = req.get('https://commons.wikimedia.org/w/api.php', params={
            'action': 'query', 'generator': 'search',
            'gsrsearch': f'{place_name} Nepal',
            'gsrnamespace': 6, 'prop': 'imageinfo',
            'iiprop': 'url', 'gsrlimit': count + 3, 'format': 'json', 'origin': '*'
        }, timeout=6)
        for page in r2.json().get('query', {}).get('pages', {}).values():
            for info in page.get('imageinfo', []):
                url = info.get('url', '')
                if url.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    if url not in images:
                        images.append(url)
    except Exception:
        pass
    return images[:count]


def fetch_weather(lat, lon):
    try:
        if WEATHER_API_KEY:
            r = req.get(
                'https://api.openweathermap.org/data/2.5/weather',
                params={'lat': lat, 'lon': lon, 'appid': WEATHER_API_KEY, 'units': 'metric'},
                timeout=6
            )
            d = r.json()
            return {
                'temp': round(d['main']['temp']),
                'feels_like': round(d['main']['feels_like']),
                'humidity': d['main']['humidity'],
                'description': d['weather'][0]['description'].title(),
                'icon': d['weather'][0]['main'],
                'wind_kmh': round(d['wind']['speed'] * 3.6),
                'source': 'OpenWeatherMap'
            }
        else:
            r = req.get(
                'https://api.open-meteo.com/v1/forecast',
                params={
                    'latitude': lat, 'longitude': lon,
                    'current': 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
                    'wind_speed_unit': 'kmh', 'timezone': 'Asia/Kathmandu'
                },
                timeout=6
            )
            d = r.json()['current']
            code = d.get('weather_code', 0)
            code_map = {
                0: ('Clear Sky', '☀️'), 1: ('Mainly Clear', '🌤️'), 2: ('Partly Cloudy', '⛅'),
                3: ('Overcast', '☁️'), 45: ('Foggy', '🌫️'), 48: ('Icy Fog', '🌫️'),
                51: ('Light Drizzle', '🌦️'), 53: ('Drizzle', '🌦️'), 55: ('Heavy Drizzle', '🌧️'),
                61: ('Light Rain', '🌧️'), 63: ('Rain', '🌧️'), 65: ('Heavy Rain', '🌧️'),
                71: ('Light Snow', '🌨️'), 73: ('Snow', '❄️'), 75: ('Heavy Snow', '❄️'),
                80: ('Showers', '🌦️'), 81: ('Rain Showers', '🌧️'), 82: ('Violent Showers', '⛈️'),
                95: ('Thunderstorm', '⛈️'), 99: ('Hail Storm', '⛈️')
            }
            desc, icon = code_map.get(code, ('Unknown', '🌡️'))
            return {
                'temp': round(d['temperature_2m']),
                'feels_like': round(d['apparent_temperature']),
                'humidity': d['relative_humidity_2m'],
                'description': desc,
                'icon': icon,
                'wind_kmh': round(d['wind_speed_10m']),
                'source': 'Open-Meteo'
            }
    except Exception as e:
        return {'error': str(e)}


def get_route_options(dist_km, weather=None):
    opts = []
    dk = float(dist_km)

    weather_note = ''
    if weather and 'description' in weather:
        icon = weather.get('icon', '')
        if any(w in weather['description'].lower() for w in ['rain', 'storm', 'snow', 'drizzle']):
            weather_note = f" ⚠️ {icon} {weather['description']} — avoid open vehicles"
        elif weather.get('temp', 20) > 32:
            weather_note = f" 🌡️ Hot day ({weather['temp']}°C) — prefer AC taxi"

    if dk < 5:
        opts.append({'mode': '🚶 Walking', 'time': f'{int(dk * 14 + 2)} min',
                     'cost': 'Free', 'cost_mid': 0, 'note': 'Best for < 2 km' + weather_note})
        opts.append({'mode': '🛺 Tempo / E-Rickshaw', 'time': f'{int(dk * 5 + 3)} min',
                     'cost': 'NPR 15–30', 'cost_mid': 22, 'note': 'Fixed city routes only'})

    if dk < 30:
        micro_base = max(15, int(dk * 7))
        micro_max = max(25, int(dk * 11))
        opts.append({'mode': '🚌 Microbus / Minibus', 'time': f'{int(dk * 5 + 5)} min',
                     'cost': f'NPR {micro_base}–{micro_max}',
                     'cost_mid': int((micro_base + micro_max) / 2),
                     'note': 'Most economical for up to 25 km'})
        if dk < 20:
            bk_base = max(80, int(dk * 30))
            bk_max = max(150, int(dk * 50))
            opts.append({'mode': '🛵 Bike Taxi (Pathao/InDrive)', 'time': f'{int(dk * 3 + 2)} min',
                         'cost': f'NPR {bk_base}–{bk_max}',
                         'cost_mid': int((bk_base + bk_max) / 2),
                         'note': 'Fast, app-based, avoid in rain'})

    if dk < 60:
        taxi_base = max(150, int(100 + dk * 60))
        taxi_max = max(200, int(100 + dk * 80))
        opts.append({'mode': '🚕 Taxi (metered)', 'time': f'{int(dk * 3 + 5)} min',
                     'cost': f'NPR {taxi_base}–{taxi_max}',
                     'cost_mid': int((taxi_base + taxi_max) / 2),
                     'note': 'Insist on meter; surge at night'})

    if dk >= 15:
        bus_base = max(60, int(dk * 5))
        bus_max = max(100, int(dk * 8))
        opts.append({'mode': '🚌 Local Bus', 'time': f'{int(dk * 3.5)} min',
                     'cost': f'NPR {bus_base}–{bus_max}',
                     'cost_mid': int((bus_base + bus_max) / 2),
                     'note': 'Cheapest intercity option'})
        tb_base = max(200, int(dk * 12))
        tb_max = max(350, int(dk * 20))
        opts.append({'mode': '🚐 Tourist / Deluxe Bus', 'time': f'{int(dk * 2.5)} min',
                     'cost': f'NPR {tb_base}–{tb_max}',
                     'cost_mid': int((tb_base + tb_max) / 2),
                     'note': 'AC, reserved seat, more comfortable'})

    if dk >= 50:
        jeep_base = max(500, int(dk * 10))
        jeep_max = max(800, int(dk * 16))
        opts.append({'mode': '🚙 Shared Jeep / Sumo', 'time': f'{int(dk * 2)} min',
                     'cost': f'NPR {jeep_base}–{jeep_max}',
                     'cost_mid': int((jeep_base + jeep_max) / 2),
                     'note': 'For mountain / off-road routes'})

    paid_opts = [o for o in opts if o['cost_mid'] > 0]
    if paid_opts:
        best = min(paid_opts, key=lambda x: x['cost_mid'])
        best['budget_pick'] = True

    return opts