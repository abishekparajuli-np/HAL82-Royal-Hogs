import { useHati } from '../../context/HatiContext';

export default function WeatherBar() {
    const { weather } = useHati();
    if (!weather || weather.error) return null;

    const isRainy = /rain|storm|snow|drizzle/i.test(weather.description || '');
    const isHot = weather.temp > 32;

    return (
        <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center',
            padding: '7px 14px', fontSize: 11,
            background: 'rgba(59,130,246,0.07)',
            borderBottom: '1px solid rgba(59,130,246,0.18)',
            color: '#93c5fd',
        }}>
            <strong>🌤️ Live Weather</strong>

            <span>{weather.icon || ''} Temp: <strong style={{ color: '#f0ede8' }}>{weather.temp}°C</strong> (feels {weather.feels_like}°C)</span>
            <span>💧 Humidity: <strong style={{ color: '#f0ede8' }}>{weather.humidity}%</strong></span>
            <span>💨 Wind: <strong style={{ color: '#f0ede8' }}>{weather.wind_kmh} km/h</strong></span>
            <span>🌤️ <strong style={{ color: '#f0ede8' }}>{weather.description}</strong></span>

            {isRainy && (
                <span style={{
                    padding: '2px 8px', borderRadius: 10, fontSize: 10,
                    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5'
                }}>⚠️ Avoid open vehicles</span>
            )}
            {!isRainy && isHot && (
                <span style={{
                    padding: '2px 8px', borderRadius: 10, fontSize: 10,
                    background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5'
                }}>🌡️ Hot — prefer AC</span>
            )}
            <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.5 }}>via {weather.source}</span>
        </div>
    );
}