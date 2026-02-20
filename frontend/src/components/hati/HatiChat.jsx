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
            display: 'flex', alignItems: 'flex-end', gap: 10,
            marginBottom: 16, flexDirection: isUser ? 'row-reverse' : 'row',
            animation: 'fadeIn .22s ease',
        }}>
            {/* Avatar */}
            <div style={{
                width: 30, height: 30, borderRadius: 3, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                background: isUser ? 'rgba(139,26,26,0.5)' : 'rgba(74,44,10,0.6)',
                border: isUser
                    ? '1px solid rgba(200,151,43,0.3)'
                    : '1px solid rgba(200,151,43,0.2)',
            }}>
                {isUser ? '✈️' : msg.isArrival ? '🎉' : '🐘'}
            </div>

            <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Role label */}
                <div style={{
                    fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'rgba(245,236,215,0.2)',
                    textAlign: isUser ? 'right' : 'left',
                    paddingLeft: isUser ? 0 : 2,
                    paddingRight: isUser ? 2 : 0,
                }}>
                    {isUser ? 'You' : 'HATI'}
                </div>

                {/* Bubble */}
                <div style={{
                    padding: '10px 14px', fontSize: 12.5, lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    borderRadius: isUser ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                    background: isUser
                        ? 'linear-gradient(135deg, rgba(139,26,26,0.55), rgba(100,20,20,0.4))'
                        : msg.isArrival
                            ? 'rgba(16,185,129,0.07)'
                            : 'rgba(245,236,215,0.03)',
                    border: isUser
                        ? '1px solid rgba(200,151,43,0.2)'
                        : msg.isArrival
                            ? '1px solid rgba(16,185,129,0.25)'
                            : '1px solid rgba(200,151,43,0.12)',
                    boxShadow: isUser
                        ? '0 3px 12px rgba(139,26,26,0.2)'
                        : '0 2px 8px rgba(0,0,0,0.15)',
                    color: '#F5ECD7',
                    fontFamily: "'Crimson Pro', Georgia, serif",
                }}>
                    {msg.text}
                </div>

                {/* Images */}
                {msg.images && msg.images.length > 0 && (
                    <div style={{ display: 'flex', gap: 7, overflowX: 'auto', padding: '4px 0', marginTop: 4 }}>
                        {msg.images.map((url, i) => (
                            <img key={i} src={url} alt="Place"
                                onClick={() => window.open(url, '_blank')}
                                onError={e => e.target.remove()}
                                style={{
                                    height: 88, width: 130, objectFit: 'cover',
                                    borderRadius: 3,
                                    border: '1px solid rgba(200,151,43,0.2)',
                                    flexShrink: 0, cursor: 'pointer', transition: 'all .2s',
                                }}
                                onMouseOver={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.borderColor = 'rgba(200,151,43,0.5)'; }}
                                onMouseOut={e => { e.target.style.transform = 'scale(1)'; e.target.style.borderColor = 'rgba(200,151,43,0.2)'; }}
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
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 16 }}>
            <div style={{
                width: 30, height: 30, borderRadius: 3, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                background: 'rgba(74,44,10,0.6)',
                border: '1px solid rgba(200,151,43,0.2)',
            }}>🐘</div>
            <div style={{
                padding: '10px 14px', borderRadius: '10px 10px 10px 2px',
                background: 'rgba(245,236,215,0.03)',
                border: '1px solid rgba(200,151,43,0.12)',
            }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                        <span key={i} style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: '#C8972B', display: 'inline-block',
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
                @keyframes fadeIn { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
                @keyframes bounce { 0%,80%,100% { transform:translateY(0); opacity:.3 } 40% { transform:translateY(-5px); opacity:1 } }
                .hati-scrollbar::-webkit-scrollbar { width: 3px }
                .hati-scrollbar::-webkit-scrollbar-thumb { background: rgba(200,151,43,0.15); border-radius: 2px }
                .chip-btn:hover { background: rgba(200,151,43,0.1) !important; border-color: rgba(200,151,43,0.4) !important; color: #C8972B !important; transform: translateY(-1px); }
                .send-btn:hover:not(:disabled) { background: #C8972B !important; }
                .chat-input::placeholder { color: rgba(245,236,215,0.2); font-style: italic; }
                .chat-input:focus { outline: none; }
            `}</style>

            {/* Messages */}
            <div ref={msgsRef} className="hati-scrollbar"
                style={{ flex: 1, overflowY: 'auto', padding: '18px 16px' }}>

                {messages.length === 0 ? (
                    <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: 14, textAlign: 'center', padding: '0 20px',
                    }}>
                        <div style={{ fontSize: 36, marginBottom: 4 }}>🏔️</div>

                        <div>
                            <h2 style={{
                                fontFamily: "'Tiro Devanagari Sanskrit', serif",
                                fontSize: 22, color: '#C8972B', letterSpacing: '0.08em',
                                marginBottom: 6,
                            }}>नमस्ते — Namaste</h2>
                            <div style={{
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: 8, marginBottom: 10,
                            }}>
                                <div style={{ height: 1, width: 32, background: 'rgba(200,151,43,0.25)' }}></div>
                                <span style={{ color: 'rgba(200,151,43,0.3)', fontSize: 11 }}>❈</span>
                                <div style={{ height: 1, width: 32, background: 'rgba(200,151,43,0.25)' }}></div>
                            </div>
                            <p style={{
                                color: 'rgba(245,236,215,0.35)', fontSize: 12,
                                maxWidth: 260, lineHeight: 1.7, margin: '0 auto',
                                fontFamily: "'Crimson Pro', serif",
                            }}>
                                Ask me about any destination in Nepal — history, culture,
                                sacred sites, trekking routes, and local phrases.
                            </p>
                        </div>

                        {/* Quick chips */}
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: 7,
                            justifyContent: 'center', maxWidth: 340,
                        }}>
                            {CHIPS.map(c => (
                                <button key={c.label} className="chip-btn"
                                    onClick={() => sendMessage(c.text)}
                                    style={{
                                        padding: '5px 12px', borderRadius: 2,
                                        border: '1px solid rgba(200,151,43,0.18)',
                                        background: 'rgba(200,151,43,0.04)',
                                        color: 'rgba(245,236,215,0.5)',
                                        fontSize: 11, cursor: 'pointer',
                                        transition: 'all .2s', fontFamily: 'inherit',
                                        letterSpacing: '0.04em',
                                    }}>{c.label}
                                </button>
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

            {/* Input bar */}
            <div style={{
                padding: '10px 14px 13px',
                borderTop: '1px solid rgba(200,151,43,0.15)',
                background: 'rgba(26,10,0,0.6)',
                flexShrink: 0,
            }}>
                <div style={{
                    display: 'flex', gap: 8, alignItems: 'center',
                    background: 'rgba(245,236,215,0.03)',
                    border: '1px solid rgba(200,151,43,0.18)',
                    borderRadius: 3, padding: '7px 7px 7px 14px',
                    transition: 'border-color 0.2s',
                }}>
                    <input
                        className="chat-input"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && send()}
                        placeholder="Ask about any destination in Nepal..."
                        style={{
                            flex: 1, background: 'transparent', border: 'none',
                            color: '#F5ECD7', fontSize: 12.5,
                            fontFamily: "'Crimson Pro', Georgia, serif",
                            letterSpacing: '0.02em',
                        }}
                    />
                    <button
                        className="send-btn"
                        onClick={send}
                        disabled={busy}
                        style={{
                            width: 33, height: 33, borderRadius: 2,
                            border: '1px solid rgba(200,151,43,0.2)',
                            background: busy ? 'rgba(200,151,43,0.08)' : '#8B1A1A',
                            color: busy ? 'rgba(200,151,43,0.2)' : '#F5ECD7',
                            cursor: busy ? 'default' : 'pointer',
                            fontSize: 14, display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            transition: 'all .2s',
                        }}>➤</button>
                </div>

                {/* Footer attribution */}
                <div style={{
                    textAlign: 'center', fontSize: 9.5, marginTop: 7,
                    color: 'rgba(200,151,43,0.2)', letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                }}>
                    ❈ HATI · Groq + Llama 3 · Open-Meteo Weather · Nepal Travel Intelligence
                </div>
            </div>
        </div>
    );
}