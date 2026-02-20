import { useHati } from '../../context/HatiContext';

export default function WeatherBar() {
    const { weather } = useHati();
    if (!weather || weather.error) return null;

    const isRainy = /rain|storm|snow|drizzle/i.test(weather.description || '');
    const isHot = weather.temp > 32;

    return (
        <div style={{
            flexShrink: 0,
            background: 'rgba(26,10,0,0.55)',
            borderBottom: '1px solid rgba(200,151,43,0.18)',
        }}>
            {/* Section label */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 18px 0',
            }}>
                <div style={{ height: 1, flex: 1, background: 'rgba(200,151,43,0.1)' }} />
                <span style={{
                    fontSize: 9, color: 'rgba(200,151,43,0.3)',
                    textTransform: 'uppercase', letterSpacing: '0.2em',
                }}>Live Weather</span>
                <div style={{ height: 1, flex: 1, background: 'rgba(200,151,43,0.1)' }} />
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
                    <span style={{ ...pillValue, color: 'rgba(245,236,215,0.55)', fontStyle: 'italic' }}>
                        {weather.description}
                    </span>
                </div>

                {/* Alerts */}
                {isRainy && (
                    <>
                        <Divider />
                        <div style={alertPill}>
                            ⚠ Avoid open vehicles
                        </div>
                    </>
                )}
                {!isRainy && isHot && (
                    <>
                        <Divider />
                        <div style={alertPill}>
                            🌡 Hot — prefer AC transport
                        </div>
                    </>
                )}

                {/* Source */}
                <div style={{ marginLeft: 'auto', fontSize: 9, color: 'rgba(200,151,43,0.2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    via {weather.source}
                </div>
            </div>
        </div>
    );
}

function Divider() {
    return (
        <div style={{ width: 1, height: 14, background: 'rgba(200,151,43,0.12)', flexShrink: 0 }} />
    );
}

/* ── style tokens ── */
const statPill = {
    display: 'flex', alignItems: 'center', gap: 5,
    padding: '4px 0',
};

const pillIcon = {
    fontSize: 12, opacity: 0.7,
};

const pillLabel = {
    fontSize: 9, color: 'rgba(200,151,43,0.38)',
    textTransform: 'uppercase', letterSpacing: '0.14em',
};

const pillValue = {
    fontSize: 11.5, color: '#F5ECD7',
    fontFamily: "'Crimson Pro', Georgia, serif",
    fontWeight: 600, letterSpacing: '0.04em',
};

const pillMuted = {
    fontSize: 9.5, color: 'rgba(245,236,215,0.25)',
    letterSpacing: '0.03em',
};

const alertPill = {
    padding: '3px 10px', borderRadius: 2, fontSize: 9.5,
    background: 'rgba(139,26,26,0.15)',
    border: '1px solid rgba(139,26,26,0.35)',
    color: '#e07070', letterSpacing: '0.08em',
    textTransform: 'uppercase',
};