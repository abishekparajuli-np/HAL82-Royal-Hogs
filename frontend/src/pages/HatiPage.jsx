import { HatiProvider, useHati } from '../context/HatiContext';
import HatiMap from '../components/hati/HatiMap';
import HatiChat from '../components/hati/HatiChat';

function HatiLayout() {
    const { activeTab, setActiveTab, weather, reset } = useHati();

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100vh',
            background: '#F9F3E8', color: '#2A1608',
            fontFamily: "'Crimson Pro', Georgia, serif",
            overflow: 'hidden',
        }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@300;400;500;600&family=Tiro+Devanagari+Sanskrit&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                .hati-tab:hover { color: #9B2335 !important; }
                .reset-btn:hover {
                    background: rgba(155,35,53,0.08) !important;
                    border-color: rgba(155,35,53,0.5) !important;
                    color: #7D1C2B !important;
                }
            `}</style>


            {/* ── Tab Bar ── */}
            <div style={{
                display: 'flex',
                background: '#FAF4E8',
                borderBottom: '1px solid rgba(184,137,42,0.18)',
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
                                ? '2px solid #9B2335'
                                : '2px solid transparent',
                            background: activeTab === id
                                ? 'rgba(155,35,53,0.04)'
                                : 'transparent',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: 7,
                        }}
                    >
                        <span style={{ fontSize: 13 }}>{icon}</span>
                        <span style={{
                            fontSize: 11, fontWeight: 600,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: activeTab === id ? '#9B2335' : 'rgba(61,32,16,0.35)',
                        }}>{label}</span>
                    </div>
                ))}
            </div>

            {/* ── Status bar ── */}
            <div style={{
                padding: '4px 20px',
                background: '#F5EDD8',
                borderBottom: '1px solid rgba(184,137,42,0.12)',
                display: 'flex', alignItems: 'center', gap: 16,
                flexShrink: 0,
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#16a34a',
                        boxShadow: '0 0 6px rgba(22,163,74,0.5)',
                    }} />
                    <span style={{
                        fontSize: 9, color: 'rgba(61,32,16,0.45)',
                        letterSpacing: '0.15em', textTransform: 'uppercase',
                    }}>
                        HATI Online
                    </span>
                </div>
                <div style={{ width: 1, height: 10, background: 'rgba(184,137,42,0.2)' }} />
                <span style={{
                    fontSize: 9, color: 'rgba(61,32,16,0.3)',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                    ❈ Powered by HATI
                </span>
            </div>

            {/* ── Panels ── */}
            <div style={{
                flex: 1, overflow: 'hidden',
                display: activeTab === 'map' ? 'flex' : 'none',
                flexDirection: 'column',
            }}>
                <HatiMap />
            </div>
            <div style={{
                flex: 1, overflow: 'hidden',
                display: activeTab === 'chat' ? 'flex' : 'none',
                flexDirection: 'column',
            }}>
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