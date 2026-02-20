import { useState } from 'react';

export default function RouteCards({ options }) {
    const [selected, setSelected] = useState(0);

    if (!options || options.length === 0) return null;

    return (
        <div style={{
            display: 'flex', gap: 7, overflowX: 'auto',
            padding: '9px 14px',
            background: 'rgba(0,0,0,0.2)',
            borderBottom: '1px solid rgba(255,193,7,0.15)',
        }}>
            {options.map((opt, i) => (
                <div
                    key={i}
                    onClick={() => setSelected(i)}
                    style={{
                        flexShrink: 0, minWidth: 125, padding: '7px 11px',
                        borderRadius: 9, textAlign: 'center', cursor: 'pointer',
                        position: 'relative',
                        background: selected === i
                            ? opt.budget_pick ? 'rgba(16,185,129,0.15)' : 'rgba(255,193,7,0.10)'
                            : opt.budget_pick ? 'rgba(16,185,129,0.07)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${selected === i
                                ? opt.budget_pick ? '#10b981' : '#ffc107'
                                : opt.budget_pick ? 'rgba(16,185,129,0.5)' : 'rgba(255,193,7,0.15)'
                            }`,
                        transition: 'all .2s',
                    }}
                >
                    {opt.budget_pick && (
                        <div style={{
                            position: 'absolute', top: -9, left: '50%', transform: 'translateX(-50%)',
                            background: '#10b981', color: '#fff', fontSize: 9, fontWeight: 700,
                            padding: '1px 7px', borderRadius: 10, whiteSpace: 'nowrap',
                        }}>✅ Best Budget</div>
                    )}
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#f0ede8' }}>{opt.mode}</div>
                    <div style={{ fontSize: 10.5, color: 'rgba(255,193,7,0.55)', marginTop: 2 }}>⏱ {opt.time}</div>
                    <div style={{ fontSize: 10.5, color: '#6ee7b7', marginTop: 1 }}>💰 {opt.cost}</div>
                    {opt.note && (
                        <div style={{ fontSize: 9.5, color: 'rgba(240,237,232,0.4)', marginTop: 2, lineHeight: 1.3 }}>
                            {opt.note}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}