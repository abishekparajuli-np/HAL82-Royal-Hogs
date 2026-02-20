import { useEffect } from 'react';
import { HatiProvider, useHati } from '../context/HatiContext';
import HatiMap from '../components/hati/HatiMap';
import HatiChat from '../components/hati/HatiChat';

function HatiLayout() {
    const { activeTab, setActiveTab, weather, reset } = useHati();

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100vh',
            background: '#0d1117', color: '#f0ede8',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            overflow: 'hidden',
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

            {/* Header */}
            <header style={{
                padding: '8px 16px', background: 'rgba(0,0,0,0.5)',
                borderBottom: '1px solid rgba(255,193,7,0.15)',
                display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, flexWrap: 'wrap',
            }}>
                <div style={{ fontSize: 24 }}>🐘</div>
                <div>
                    <div style={{ fontFamily: 'serif', fontSize: 19, color: '#ffc107' }}>HATI</div>
                    <div style={{ fontSize: 9.5, color: 'rgba(240,237,232,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        Himalayan Adaptive Travel Intelligence
                    </div>
                </div>
                <div style={{
                    padding: '3px 9px', borderRadius: 20, fontSize: 10.5,
                    background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#6ee7b7',
                }}>🇳🇵 Nepal Guide</div>

                {weather && weather.temp !== undefined && (
                    <div style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 10.5, marginLeft: 'auto',
                        background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)', color: '#93c5fd',
                    }}>
                        {weather.icon || '🌤️'} {weather.temp}°C · {weather.description}
                    </div>
                )}

                <button onClick={reset} style={{
                    marginLeft: weather ? 0 : 'auto',
                    padding: '3px 9px', borderRadius: 20, fontSize: 10.5,
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                    color: '#fca5a5', cursor: 'pointer', fontFamily: 'inherit',
                }}>↺ Reset All</button>
            </header>

            {/* Tabs */}
            <div style={{
                display: 'flex', background: 'rgba(0,0,0,0.3)',
                borderBottom: '1px solid rgba(255,193,7,0.15)', flexShrink: 0,
            }}>
                {[['map', '🗺️ Smart Map & Routes'], ['chat', '💬 Destination Buddy']].map(([id, label]) => (
                    <div key={id} onClick={() => setActiveTab(id)} style={{
                        flex: 1, padding: 9, textAlign: 'center', fontSize: 12, fontWeight: 500,
                        color: activeTab === id ? '#ffc107' : 'rgba(240,237,232,0.4)',
                        borderBottom: activeTab === id ? '2px solid #ffc107' : '2px solid transparent',
                        background: activeTab === id ? 'rgba(255,193,7,0.04)' : 'transparent',
                        cursor: 'pointer', transition: 'all .2s',
                    }}>{label}</div>
                ))}
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