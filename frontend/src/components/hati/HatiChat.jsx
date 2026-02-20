import { useRef, useEffect, useState } from 'react';
import { useHati } from '../../context/HatiContext';

const CHIPS = [
    { label: '🛕 Pashupatinath', text: 'Tell me about Pashupatinath Temple' },
    { label: '☸️ Boudhanath', text: 'Tell me about Boudhanath Stupa' },
    { label: '🏔️ Pokhara', text: 'Tell me about Pokhara' },
    { label: '🛍️ Thamel', text: 'Tell me about Thamel' },
    { label: '🚌 Budget Routes', text: 'Best budget routes from Thamel to Patan?' },
    { label: '🐘 Chitwan', text: 'Tell me about Chitwan National Park' },
];

function MessageBubble({ msg }) {
    const isUser = msg.role === 'user';
    return (
        <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 8,
            marginBottom: 13, flexDirection: isUser ? 'row-reverse' : 'row',
            animation: 'fadeIn .22s ease',
        }}>
            {/* Avatar */}
            <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                background: isUser
                    ? 'linear-gradient(135deg,#92400e,#d97706)'
                    : msg.isArrival
                        ? 'linear-gradient(135deg,#059669,#34d399)'
                        : 'linear-gradient(135deg,#065f46,#059669)',
            }}>
                {isUser ? '✈️' : msg.isArrival ? '🎉' : '🐘'}
            </div>

            <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column' }}>
                {/* Bubble */}
                <div style={{
                    padding: '9px 13px', fontSize: 12.5, lineHeight: 1.65, whiteSpace: 'pre-wrap',
                    borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: isUser
                        ? 'linear-gradient(135deg,#92400e,#78350f)'
                        : msg.isArrival
                            ? 'rgba(16,185,129,0.08)'
                            : 'rgba(255,255,255,0.04)',
                    border: isUser ? 'none'
                        : msg.isArrival ? '1px solid rgba(16,185,129,0.28)'
                            : '1px solid rgba(255,193,7,0.15)',
                    boxShadow: isUser ? '0 3px 10px rgba(120,53,15,.28)' : 'none',
                    color: '#f0ede8',
                }}>
                    {msg.text}
                </div>

                {/* Images */}
                {msg.images && msg.images.length > 0 && (
                    <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '5px 0', marginTop: 5 }}>
                        {msg.images.map((url, i) => (
                            <img key={i} src={url} alt="Place"
                                onClick={() => window.open(url, '_blank')}
                                onError={e => e.target.remove()}
                                style={{
                                    height: 85, width: 125, objectFit: 'cover',
                                    borderRadius: 7, border: '1px solid rgba(255,193,7,0.15)',
                                    flexShrink: 0, cursor: 'pointer', transition: 'transform .2s',
                                }}
                                onMouseOver={e => e.target.style.transform = 'scale(1.04)'}
                                onMouseOut={e => e.target.style.transform = 'scale(1)'}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function TypingIndicator() {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 13 }}>
            <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
                background: 'linear-gradient(135deg,#065f46,#059669)',
            }}>🐘</div>
            <div style={{
                padding: '9px 13px', borderRadius: '14px 14px 14px 4px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,193,7,0.15)',
            }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                        <span key={i} style={{
                            width: 6, height: 6, borderRadius: '50%', background: '#ffc107',
                            display: 'inline-block',
                            animation: `bounce 1.2s ${delay}s infinite`,
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function HatiChat() {
    const { messages, busy, sendMessage } = useHati();
    const [input, setInput] = useState('');
    const msgsRef = useRef(null);

    useEffect(() => {
        if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }, [messages, busy]);

    const send = () => {
        const t = input.trim();
        if (!t || busy) return;
        setInput('');
        sendMessage(t);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(5px) } to { opacity:1; transform:translateY(0) } }
        @keyframes bounce { 0%,80%,100% { transform:translateY(0); opacity:.3 } 40% { transform:translateY(-5px); opacity:1 } }
        .hati-scrollbar::-webkit-scrollbar { width: 3px }
        .hati-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,193,7,0.18); border-radius: 4px }
        .chip-btn:hover { background: rgba(255,193,7,0.13) !important; transform: translateY(-1px) }
      `}</style>

            {/* Messages */}
            <div ref={msgsRef} className="hati-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: 14 }}>

                {messages.length === 0 ? (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 11, textAlign: 'center' }}>
                        <div style={{ fontSize: 40 }}>🏔️</div>
                        <h2 style={{ fontFamily: 'serif', fontSize: 22, color: '#ffc107' }}>Namaste!</h2>
                        <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 12, maxWidth: 240, lineHeight: 1.6 }}>
                            Ask me about any place in Nepal — history, culture, phrases, what to see.
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, justifyContent: 'center' }}>
                            {CHIPS.map(c => (
                                <button key={c.label} className="chip-btn" onClick={() => sendMessage(c.text)} style={{
                                    padding: '6px 12px', borderRadius: 18,
                                    border: '1px solid rgba(255,193,7,0.15)',
                                    background: 'rgba(255,193,7,0.05)', color: '#fde68a',
                                    fontSize: 11.5, cursor: 'pointer', transition: 'all .2s',
                                    fontFamily: 'inherit',
                                }}>{c.label}</button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
                        {busy && <TypingIndicator />}
                    </>
                )}
            </div>

            {/* Input */}
            <div style={{ padding: '9px 13px 12px', borderTop: '1px solid rgba(255,193,7,0.15)', background: 'rgba(0,0,0,0.15)', flexShrink: 0 }}>
                <div style={{
                    display: 'flex', gap: 7, alignItems: 'center',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,193,7,0.15)',
                    borderRadius: 11, padding: '6px 6px 6px 12px',
                }}>
                    <input
                        value={input} onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Ask about any place in Nepal..."
                        style={{
                            flex: 1, background: 'transparent', border: 'none',
                            color: '#f0ede8', fontSize: 12.5, fontFamily: 'inherit', outline: 'none',
                        }}
                    />
                    <button onClick={send} disabled={busy} style={{
                        width: 32, height: 32, borderRadius: 7, border: 'none',
                        background: busy ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg,#d97706,#92400e)',
                        color: busy ? 'rgba(255,193,7,0.2)' : '#fff',
                        cursor: busy ? 'default' : 'pointer', fontSize: 13,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all .2s',
                    }}>➤</button>
                </div>
                <div style={{ textAlign: 'center', fontSize: 10, color: 'rgba(255,193,7,0.18)', marginTop: 5 }}>
                    🐘 HATI v2 · Groq + Llama 3 · Open-Meteo Weather · Nepal Travel Intelligence
                </div>
            </div>
        </div>
    );
}