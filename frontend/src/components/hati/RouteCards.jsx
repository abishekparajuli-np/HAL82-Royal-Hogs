import { useState } from 'react';

export default function RouteCards({ options }) {
    const [selected, setSelected] = useState(0);

    if (!options || options.length === 0) return null;

    return (
        <div style={{
            flexShrink: 0,
            background: '#FDFAF3',
            borderBottom: '1px solid rgba(184,137,42,0.18)',
        }}>
            {/* Section label */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 18px 0',
            }}>
                <div style={{ height: 1, flex: 1, background: 'rgba(184,137,42,0.18)' }} />
                <span style={{
                    fontSize: 9, color: '#9C6840', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.2em',
                }}>Transport Options</span>
                <div style={{ height: 1, flex: 1, background: 'rgba(184,137,42,0.18)' }} />
            </div>

            {/* Cards row */}
            <div style={{
                display: 'flex', gap: 8, overflowX: 'auto',
                padding: '10px 18px 14px',
                scrollbarWidth: 'none',
            }}>
                <style>{`
                    .route-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(61,32,16,0.1) !important; }
                `}</style>

                {options.map((opt, i) => {
                    const isSelected = selected === i;
                    const isBudget = opt.budget_pick;

                    return (
                        <div
                            key={i}
                            className="route-card"
                            onClick={() => setSelected(i)}
                            style={{
                                flexShrink: 0,
                                minWidth: 145,
                                padding: '12px 14px',
                                borderRadius: 10,
                                textAlign: 'center',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all .2s',
                                background: isSelected
                                    ? '#FFFFFF'
                                    : '#F5EDD8',
                                border: `1.5px solid ${isSelected
                                    ? isBudget
                                        ? '#B8892A'
                                        : '#9B2335'
                                    : 'rgba(184,137,42,0.2)'
                                    }`,
                                boxShadow: isSelected
                                    ? `0 4px 16px rgba(${isBudget ? '184,137,42' : '155,35,53'},0.15)`
                                    : '0 1px 4px rgba(61,32,16,0.06)',
                            }}
                        >
                            {/* Budget pick badge */}
                            {isBudget && (
                                <div style={{
                                    position: 'absolute', top: -10, left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#B8892A',
                                    color: '#FFFFFF',
                                    fontSize: 8.5, fontWeight: 700,
                                    padding: '2px 9px', borderRadius: 999,
                                    whiteSpace: 'nowrap', letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 1px 6px rgba(184,137,42,0.35)',
                                }}>❈ Best Value</div>
                            )}

                            {/* Selected dot */}
                            {isSelected && (
                                <div style={{
                                    position: 'absolute', top: 8, right: 8,
                                    width: 6, height: 6, borderRadius: '50%',
                                    background: isBudget ? '#B8892A' : '#9B2335',
                                    boxShadow: `0 0 6px rgba(${isBudget ? '184,137,42' : '155,35,53'},0.5)`,
                                }} />
                            )}

                            {/* Mode label */}
                            <div style={{
                                fontSize: 13, fontWeight: 700,
                                color: isSelected ? '#2A1608' : '#6B3D1E',
                                fontFamily: "'Crimson Pro', Georgia, serif",
                                letterSpacing: '0.03em', marginBottom: 6,
                            }}>{opt.mode}</div>

                            {/* Divider */}
                            <div style={{
                                height: 1,
                                background: isSelected
                                    ? 'rgba(184,137,42,0.2)'
                                    : 'rgba(184,137,42,0.12)',
                                margin: '6px 0',
                            }} />

                            {/* Time */}
                            <div style={{
                                fontSize: 10.5,
                                color: isSelected ? '#9B2335' : '#9C6840',
                                marginBottom: 3,
                                letterSpacing: '0.05em', fontWeight: 600,
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: 4,
                            }}>
                                <span style={{ opacity: 0.7 }}>⏱</span> {opt.time}
                            </div>

                            {/* Cost */}
                            <div style={{
                                fontSize: 10.5,
                                color: isSelected ? '#6B3D1E' : '#9C6840',
                                letterSpacing: '0.05em',
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: 4,
                            }}>
                                <span style={{ opacity: 0.6 }}>₨</span> {opt.cost}
                            </div>

                            {/* Note */}
                            {opt.note && (
                                <div style={{
                                    fontSize: 9.5, marginTop: 7,
                                    color: isSelected
                                        ? 'rgba(61,32,16,0.45)'
                                        : 'rgba(61,32,16,0.3)',
                                    lineHeight: 1.5, letterSpacing: '0.02em',
                                    fontStyle: 'italic',
                                    fontFamily: "'Crimson Pro', serif",
                                }}>{opt.note}</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}