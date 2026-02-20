import { useHati } from '../../context/HatiContext';

export default function WeatherBar() {
    const { weather } = useHati();
    if (!weather || weather.error) return null;

    const isRainy = /rain|storm|snow|drizzle/i.test(weather.description || '');
    const isHot = weather.temp > 32;

    return (
        <div style={{
            flexShrink: 0,
            background: '#FFFFFF',
            borderBottom: '1px solid rgba(184,137,42,0.18)',
        }}>
            {/* Section label */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 18px 0',
            }}>
                <div style={{ height: 1, flex: 1, background: 'rgba(184,137,42,0.18)' }} />
                <span style={{
                    fontSize: 9, color: '#9C6840', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.2em',
                }}>Live Weather</span>
                <div style={{ height: 1, flex: 1, background: 'rgba(184,137,42,0.18)' }} />
            </div>

            {/* Stats row */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', alignItems: 'center',
                gap: 6, padding: '8px 18px 12px',
            }}>

                {/* Temperature */}
                <div style={statPill}>
                    <span style={pillIcon}>{weather.icon || '🌤️'}</span>
                    <span style={pillLabel}>Temp</span>
                    <span style={pillValue}>{weather.temp}°C</span>
                    <span style={pillMuted}>feels {weather.feels_like}°C</span>
                </div>

                <Divider />

                {/* Humidity */}
                <div style={statPill}>
                    <span style={pillIcon}>💧</span>
                    <span style={pillLabel}>Humidity</span>
                    <span style={pillValue}>{weather.humidity}%</span>
                </div>

                <Divider />

                {/* Wind */}
                <div style={statPill}>
                    <span style={pillIcon}>💨</span>
                    <span style={pillLabel}>Wind</span>
                    <span style={pillValue}>{weather.wind_kmh} km/h</span>
                </div>

                <Divider />

                {/* Description */}
                <div style={statPill}>
                    <span style={{ ...pillValue, color: '#9C6840', fontStyle: 'italic', fontWeight: 400 }}>
                        {weather.description}
                    </span>
                </div>

                {/* Alerts */}
                {isRainy && (
                    <>
                        <Divider />
                        <div style={alertPillRain}>⚠ Avoid open vehicles</div>
                    </>
                )}
                {!isRainy && isHot && (
                    <>
                        <Divider />
                        <div style={alertPillHot}>🌡 Hot — prefer AC transport</div>
                    </>
                )}

                {/* Source */}
                <div style={{
                    marginLeft: 'auto', fontSize: 9,
                    color: 'rgba(61,32,16,0.3)',
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                }}>
                    via {weather.source}
                </div>
            </div>
        </div>
    );
}

function Divider() {
    return (
        <div style={{ width: 1, height: 14, background: 'rgba(184,137,42,0.2)', flexShrink: 0 }} />
    );
}

/* ── style tokens ── */
const statPill = {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '4px 0',
};

const pillIcon = {
    fontSize: 12, opacity: 0.8,
};

const pillLabel = {
    fontSize: 9, color: '#9C6840',
    textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600,
};

const pillValue = {
    fontSize: 11.5, color: '#2A1608',
    fontFamily: "'Crimson Pro', Georgia, serif",
    fontWeight: 700, letterSpacing: '0.04em',
};

const pillMuted = {
    fontSize: 9.5, color: 'rgba(61,32,16,0.38)',
    letterSpacing: '0.03em',
};

const alertPillRain = {
    padding: '3px 10px', borderRadius: 999, fontSize: 9.5,
    background: '#FDF0F1',
    border: '1px solid rgba(155,35,53,0.25)',
    color: '#7D1C2B',
    letterSpacing: '0.07em', textTransform: 'uppercase',
    fontWeight: 600,
};

const alertPillHot = {
    padding: '3px 10px', borderRadius: 999, fontSize: 9.5,
    background: '#FDF8ED',
    border: '1px solid rgba(184,137,42,0.3)',
    color: '#7A5A10',
    letterSpacing: '0.07em', textTransform: 'uppercase',
    fontWeight: 600,
};