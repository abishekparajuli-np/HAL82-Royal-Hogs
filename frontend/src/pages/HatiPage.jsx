import { useEffect } from 'react';
import { HatiProvider, useHati } from '../context/HatiContext';
import HatiMap from '../components/hati/HatiMap';
import HatiChat from '../components/hati/HatiChat';

function HatiLayout() {
    const { activeTab, setActiveTab, weather, reset } = useHati();

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100vh',
            background: '#1A0A00', color: '#F5ECD7',
            fontFamily: "'Crimson Pro', Georgia, serif",
            overflow: 'hidden',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600&family=Tiro+Devanagari+Sanskrit&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .hati-tab:hover { color: #C8972B !important; }
                .reset-btn:hover { background: rgba(139,26,26,0.3) !important; color: #f5a5a5 !important; }
            `}</style>

            {/* Header */}
            <header style={{
                padding: '10px 20px',
                background: 'rgba(26,10,0,0.95)',
                borderBottom: '1px solid rgba(200,151,43,0.25)',
                backgroundImage: 'linear-gradient(90deg, rgba(139,26,26,0.1) 0%, rgba(200,151,43,0.05) 50%, rgba(139,26,26,0.1) 100%)',
                display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, flexWrap: 'wrap',
                boxShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}>

                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: 3,
                        background: 'rgba(139,26,26,0.4)',
                        border: '1px solid rgba(200,151,43,0.35)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 18,
                    }}>🐘</div>
                    <div>
                        <div style={{
                            fontFamily: "'Tiro Devanagari Sanskrit', serif",
                            fontSize: 17, color: '#C8972B', letterSpacing: '0.1em', lineHeight: 1.2,
                        }}>HATI</div>
                        <div style={{
                            fontSize: 9, color: 'rgba(245,236,215,0.35)',
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                        }}>Himalayan Adaptive Travel Intelligence</div>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ width: 1, height: 28, background: 'rgba(200,151,43,0.15)', flexShrink: 0 }}></div>

                {/* Nepal badge */}
                <div style={{
                    padding: '4px 10px', borderRadius: 2, fontSize: 10,
                    background: 'rgba(139,26,26,0.15)',
                    border: '1px solid rgba(200,151,43,0.25)',
                    color: '#C8972B', letterSpacing: '0.12em', textTransform: 'uppercase',
                    display: 'flex', alignItems: 'center', gap: 5,
                }}>
                    <span>🇳🇵</span> Nepal Guide
                </div>

                {/* Spacer */}
                <div style={{ flex: 1 }}></div>

                {/* Weather */}
                {weather && weather.temp !== undefined && (
                    <div style={{
                        padding: '5px 12px', borderRadius: 2, fontSize: 10.5,
                        background: 'rgba(74,44,10,0.35)',
                        border: '1px solid rgba(200,151,43,0.2)',
                        color: 'rgba(245,236,215,0.7)',
                        display: 'flex', alignItems: 'center', gap: 6,
                        letterSpacing: '0.05em',
                    }}>
                        <span>{weather.icon || '🌤️'}</span>
                        <span style={{ color: '#C8972B', fontWeight: 600 }}>{weather.temp}°C</span>
                        <span style={{ color: 'rgba(245,236,215,0.4)', fontSize: 9 }}>·</span>
                        <span style={{ textTransform: 'capitalize', fontSize: 10 }}>{weather.description}</span>
                    </div>
                )}

                {/* Reset */}
                <button className="reset-btn" onClick={reset} style={{
                    padding: '5px 12px', borderRadius: 2, fontSize: 10,
                    background: 'rgba(139,26,26,0.1)',
                    border: '1px solid rgba(139,26,26,0.35)',
                    color: '#e07070', cursor: 'pointer',
                    fontFamily: 'inherit', letterSpacing: '0.1em',
                    textTransform: 'uppercase', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: 5,
                }}>
                    <span>↺</span> Reset
                </button>
            </header>

            {/* Tab Bar */}
            <div style={{
                display: 'flex',
                background: 'rgba(15,5,0,0.6)',
                borderBottom: '1px solid rgba(200,151,43,0.2)',
                flexShrink: 0, padding: '0 4px',
            }}>
                {[
                    ['map', '🗺️', 'Smart Map & Routes'],
                    ['chat', '💬', 'Destination Buddy'],
                ].map(([id, icon, label]) => (
                    <div
                        key={id}
                        className="hati-tab"
                        onClick={() => setActiveTab(id)}
                        style={{
                            flex: 1, padding: '10px 16px',
                            textAlign: 'center', cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderBottom: activeTab === id
                                ? '2px solid #C8972B'
                                : '2px solid transparent',
                            background: activeTab === id
                                ? 'rgba(200,151,43,0.05)'
                                : 'transparent',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: 7,
                        }}
                    >
                        <span style={{ fontSize: 13 }}>{icon}</span>
                        <span style={{
                            fontSize: 11, fontWeight: 500,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: activeTab === id
                                ? '#C8972B'
                                : 'rgba(245,236,215,0.3)',
                        }}>{label}</span>
                    </div>
                ))}
            </div>

            {/* Status bar */}
            <div style={{
                padding: '4px 20px',
                background: 'rgba(10,3,0,0.5)',
                borderBottom: '1px solid rgba(200,151,43,0.08)',
                display: 'flex', alignItems: 'center', gap: 16,
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#10b981',
                        boxShadow: '0 0 6px rgba(16,185,129,0.6)',
                    }}></div>
                    <span style={{ fontSize: 9, color: 'rgba(245,236,215,0.25)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                        HATI Online
                    </span>
                </div>
                <div style={{ width: 1, height: 10, background: 'rgba(200,151,43,0.1)' }}></div>
                <span style={{ fontSize: 9, color: 'rgba(245,236,215,0.15)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    ❈ Powered by Himalayan AI
                </span>
            </div>

            {/* Panels */}
            <div style={{ flex: 1, overflow: 'hidden', display: activeTab === 'map' ? 'flex' : 'none', flexDirection: 'column' }}>
                <HatiMap />
            </div>
            <div style={{ flex: 1, overflow: 'hidden', display: activeTab === 'chat' ? 'flex' : 'none', flexDirection: 'column' }}>
                <HatiChat />
            </div>
        </div>
    );
}

export default function HatiPage() {
    return (
        <HatiProvider>
            <HatiLayout />
        </HatiProvider>
    );
}