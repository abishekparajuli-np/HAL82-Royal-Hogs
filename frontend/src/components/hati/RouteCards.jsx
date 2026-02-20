import { useState } from 'react';

export default function RouteCards({ options }) {
    const [selected, setSelected] = useState(0);

    if (!options || options.length === 0) return null;

    return (
        <div style={{
            flexShrink: 0,
            background: 'rgba(26,10,0,0.6)',
            borderBottom: '1px solid rgba(200,151,43,0.18)',
        }}>
            {/* Section label */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 18px 0',
            }}>
                <div style={{ height: 1, flex: 1, background: 'rgba(200,151,43,0.1)' }}></div>
                <span style={{
                    fontSize: 9, color: 'rgba(200,151,43,0.3)',
                    textTransform: 'uppercase', letterSpacing: '0.2em',
                }}>Transport Options</span>
                <div style={{ height: 1, flex: 1, background: 'rgba(200,151,43,0.1)' }}></div>
            </div>

            {/* Cards row */}
            <div style={{
                display: 'flex', gap: 8, overflowX: 'auto',
                padding: '10px 18px 14px',
                scrollbarWidth: 'none',
            }}>
                <style>{`
                    .route-card:hover { transform: translateY(-2px); }
                    .route-card::-webkit-scrollbar { display: none; }
                `}</style>

                {options.map((opt, i) => (
                    <div
                        key={i}
                        className="route-card"
                        onClick={() => setSelected(i)}
                        style={{
                            flexShrink: 0,
                            minWidth: 140,
                            padding: '12px 14px',
                            borderRadius: 2,
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'all .2s',
                            background: selected === i
                                ? opt.budget_pick
                                    ? 'rgba(74,44,10,0.5)'
                                    : 'rgba(139,26,26,0.2)'
                                : 'rgba(245,236,215,0.03)',
                            border: `1px solid ${selected === i
                                ? opt.budget_pick
                                    ? 'rgba(200,151,43,0.55)'
                                    : 'rgba(200,151,43,0.35)'
                                : 'rgba(200,151,43,0.12)'
                                }`,
                            boxShadow: selected === i
                                ? '0 4px 16px rgba(139,26,26,0.2)'
                                : 'none',
                        }}
                    >
                        {/* Budget pick badge */}
                        {opt.budget_pick && (
                            <div style={{
                                position: 'absolute', top: -9, left: '50%',
                                transform: 'translateX(-50%)',
                                background: '#8B1A1A',
                                border: '1px solid rgba(200,151,43,0.4)',
                                color: '#C8972B', fontSize: 8.5, fontWeight: 700,
                                padding: '2px 9px', borderRadius: 1,
                                whiteSpace: 'nowrap', letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                            }}>❈ Best Value</div>
                        )}

                        {/* Selected indicator dot */}
                        {selected === i && (
                            <div style={{
                                position: 'absolute', top: 7, right: 7,
                                width: 5, height: 5, borderRadius: '50%',
                                background: '#C8972B',
                                boxShadow: '0 0 6px rgba(200,151,43,0.6)',
                            }} />
                        )}

                        {/* Mode */}
                        <div style={{
                            fontSize: 13, fontWeight: 600,
                            color: selected === i ? '#F5ECD7' : 'rgba(245,236,215,0.55)',
                            fontFamily: "'Crimson Pro', Georgia, serif",
                            letterSpacing: '0.04em', marginBottom: 6,
                        }}>{opt.mode}</div>

                        {/* Divider */}
                        <div style={{
                            height: 1, background: 'rgba(200,151,43,0.12)',
                            margin: '6px 0',
                        }} />

                        {/* Time */}
                        <div style={{
                            fontSize: 10.5,
                            color: selected === i
                                ? 'rgba(200,151,43,0.8)'
                                : 'rgba(200,151,43,0.35)',
                            marginBottom: 3,
                            letterSpacing: '0.06em',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: 4,
                        }}>
                            <span style={{ opacity: 0.6 }}>⏱</span> {opt.time}
                        </div>

                        {/* Cost */}
                        <div style={{
                            fontSize: 10.5,
                            color: selected === i
                                ? 'rgba(245,236,215,0.7)'
                                : 'rgba(245,236,215,0.25)',
                            letterSpacing: '0.06em',
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: 4,
                        }}>
                            <span style={{ opacity: 0.5 }}>₨</span> {opt.cost}
                        </div>

                        {/* Note */}
                        {opt.note && (
                            <div style={{
                                fontSize: 9.5, marginTop: 7,
                                color: 'rgba(245,236,215,0.25)',
                                lineHeight: 1.5, letterSpacing: '0.03em',
                                fontStyle: 'italic',
                                fontFamily: "'Crimson Pro', serif",
                            }}>{opt.note}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}