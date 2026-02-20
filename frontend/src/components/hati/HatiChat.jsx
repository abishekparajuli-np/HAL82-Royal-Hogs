import { useRef, useEffect, useState } from 'react';
import { useHati } from '../../context/HatiContext';

const CHIPS = [
    { label: '🛕 Pashupatinath', text: 'Tell me about Pashupatinath Temple' },
    { label: '☸️ Boudhanath', text: 'Tell me about Boudhanath Stupa' },
    { label: '🏔️ Pokhara', text: 'Tell me about Pokhara' },
    { label: '🛍️ Thamel', text: 'Tell me about Thamel' },
    { label: '🗺️ Itinerary', text: 'Give me a 1-day itinerary in Kathmandu' },
    { label: '🚌 Budget Routes', text: 'Best budget routes from Thamel to Patan?' },
    { label: '🐘 Chitwan', text: 'Tell me about Chitwan National Park' },
];

// ─────────────────────────────────────────────
// Image strip — shared by arrival & itinerary
// ─────────────────────────────────────────────
function ImageStrip({ images, label }) {
    const [loaded, setLoaded] = useState([]);

    if (!images || images.length === 0) return null;

    return (
        <div style={{ marginTop: 6 }}>
            {label && (
                <div style={{
                    fontSize: 9.5, letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(61,32,16,0.35)',
                    marginBottom: 5, paddingLeft: 1,
                }}>
                    {label}
                </div>
            )}
            <div style={{
                display: 'flex', gap: 7,
                overflowX: 'auto', padding: '2px 0',
                /* hide scrollbar on Firefox */
                scrollbarWidth: 'none',
            }}>
                {images.map((url, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'relative', flexShrink: 0,
                            height: 88, width: 130,
                            borderRadius: 8, overflow: 'hidden',
                            border: '1px solid rgba(184,137,42,0.2)',
                            background: '#F0E6D0',  // placeholder bg while loading
                            cursor: 'pointer',
                            transition: 'transform .2s, border-color .2s',
                        }}
                        onClick={() => window.open(url, '_blank')}
                        onMouseOver={e => {
                            e.currentTarget.style.transform = 'scale(1.04)';
                            e.currentTarget.style.borderColor = 'rgba(184,137,42,0.55)';
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = 'rgba(184,137,42,0.2)';
                        }}
                    >
                        {/* skeleton shimmer until loaded */}
                        {!loaded[i] && (
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(90deg,#F0E6D0 25%,#E8D9BB 50%,#F0E6D0 75%)',
                                backgroundSize: '200% 100%',
                                animation: 'shimmer 1.4s infinite',
                            }} />
                        )}
                        <img
                            src={url}
                            alt={`Place ${i + 1}`}
                            onLoad={() => setLoaded(prev => { const n = [...prev]; n[i] = true; return n; })}
                            onError={e => e.currentTarget.closest('div').remove()}
                            style={{
                                width: '100%', height: '100%',
                                objectFit: 'cover', display: 'block',
                                opacity: loaded[i] ? 1 : 0,
                                transition: 'opacity .3s',
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Single message bubble
// ─────────────────────────────────────────────
function MessageBubble({ msg }) {
    const isUser = msg.role === 'user';

    return (
        <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 10,
            marginBottom: 16,
            flexDirection: isUser ? 'row-reverse' : 'row',
            animation: 'fadeIn .22s ease',
        }}>
            {/* Avatar */}
            <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
                background: isUser
                    ? 'linear-gradient(135deg, #9B2335, #C4445A)'
                    : '#F0E6D0',
                border: isUser ? 'none' : '1px solid rgba(184,137,42,0.25)',
                boxShadow: isUser ? '0 2px 8px rgba(155,35,53,0.25)' : 'none',
            }}>
                {isUser ? '✈️' : msg.isArrival ? '🎉' : '🐘'}
            </div>

            <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {/* Role label */}
                <div style={{
                    fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'rgba(61,32,16,0.35)',
                    textAlign: isUser ? 'right' : 'left',
                    paddingLeft: isUser ? 0 : 2,
                    paddingRight: isUser ? 2 : 0,
                }}>
                    {isUser ? 'You' : 'HATI'}
                </div>

                {/* Bubble */}
                <div style={{
                    padding: '10px 14px', fontSize: 13, lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    borderRadius: isUser ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: isUser
                        ? 'linear-gradient(135deg, #9B2335, #7D1C2B)'
                        : msg.isArrival
                            ? '#F0FAF3'
                            : '#FFFFFF',
                    border: isUser
                        ? 'none'
                        : msg.isArrival
                            ? '1px solid rgba(45,122,79,0.25)'
                            : '1px solid rgba(184,137,42,0.18)',
                    boxShadow: isUser
                        ? '0 3px 12px rgba(155,35,53,0.22)'
                        : '0 2px 8px rgba(61,32,16,0.07)',
                    color: isUser ? '#FFFFFF' : '#2A1608',
                    fontFamily: "'Crimson Pro', Georgia, serif",
                }}>
                    {msg.text}
                </div>

                {/* ── Images ──
                    arrival  → flat array from /arrival endpoint
                    itinerary → flat array flattened in context from {place: [urls]} dict
                */}
                {msg.images && msg.images.length > 0 && (
                    <ImageStrip
                        images={msg.images}
                        label={msg.isArrival ? null : '📸 Places in your itinerary'}
                    />
                )}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────
function TypingIndicator() {
    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 16 }}>
            <div style={{
                width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, background: '#F0E6D0',
                border: '1px solid rgba(184,137,42,0.25)',
            }}>🐘</div>
            <div style={{
                padding: '10px 14px', borderRadius: '12px 12px 12px 2px',
                background: '#FFFFFF',
                border: '1px solid rgba(184,137,42,0.18)',
                boxShadow: '0 2px 8px rgba(61,32,16,0.07)',
            }}>
                <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                        <span key={i} style={{
                            width: 5, height: 5, borderRadius: '50%',
                            background: '#9B2335', display: 'inline-block',
                            animation: `bounce 1.2s ${delay}s infinite`,
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Main chat panel
// ─────────────────────────────────────────────
export default function HatiChat() {
    const { messages, busy, sendMessage } = useHati();
    const [input, setInput] = useState('');
    const msgsRef = useRef(null);

    // Auto-scroll on new messages / typing indicator
    useEffect(() => {
        if (msgsRef.current) {
            msgsRef.current.scrollTo({
                top: msgsRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, busy]);

    const send = () => {
        const t = input.trim();
        if (!t || busy) return;
        setInput('');
        sendMessage(t);
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column',
            height: '100%', overflow: 'hidden',
            background: '#F9F3E8',
        }}>
            <style>{`
                @keyframes fadeIn   { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:translateY(0) } }
                @keyframes bounce   { 0%,80%,100% { transform:translateY(0); opacity:.3 } 40% { transform:translateY(-5px); opacity:1 } }
                @keyframes shimmer  { 0% { background-position:200% 0 } 100% { background-position:-200% 0 } }

                .hati-scrollbar::-webkit-scrollbar       { width: 4px }
                .hati-scrollbar::-webkit-scrollbar-thumb { background: rgba(184,137,42,0.2); border-radius: 4px }

                .chip-btn:hover {
                    background: rgba(155,35,53,0.07) !important;
                    border-color: rgba(155,35,53,0.35) !important;
                    color: #9B2335 !important;
                    transform: translateY(-1px);
                }
                .send-btn:hover:not(:disabled) {
                    background: #7D1C2B !important;
                    box-shadow: 0 4px 16px rgba(155,35,53,0.35) !important;
                }
                .chat-input::placeholder { color: rgba(61,32,16,0.3); font-style: italic; }
                .chat-input:focus { outline: none; }

                /* hide scrollbar on image strips in WebKit */
                div::-webkit-scrollbar { height: 0 }
            `}</style>

            {/* ── Messages area ── */}
            <div
                ref={msgsRef}
                className="hati-scrollbar"
                style={{ flex: 1, overflowY: 'auto', padding: '18px 16px' }}
            >
                {messages.length === 0 ? (
                    /* ── Empty / welcome state ── */
                    <div style={{
                        height: '100%', display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: 14, textAlign: 'center', padding: '0 20px',
                    }}>
                        <div style={{ fontSize: 40, marginBottom: 4 }}>🏔️</div>

                        <div>
                            <h2 style={{
                                fontFamily: "'Tiro Devanagari Sanskrit', serif",
                                fontSize: 22, color: '#2A1608',
                                letterSpacing: '0.06em', marginBottom: 6,
                            }}>
                                नमस्ते —{' '}
                                <span style={{ color: '#9B2335' }}>Namaste</span>
                            </h2>

                            <div style={{
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'center', gap: 8, marginBottom: 10,
                            }}>
                                <div style={{ height: 1, width: 32, background: 'rgba(184,137,42,0.3)' }} />
                                <span style={{ color: '#B8892A', fontSize: 11 }}>❈</span>
                                <div style={{ height: 1, width: 32, background: 'rgba(184,137,42,0.3)' }} />
                            </div>

                            <p style={{
                                color: '#6B3D1E', fontSize: 13,
                                maxWidth: 280, lineHeight: 1.75, margin: '0 auto',
                                fontFamily: "'Crimson Pro', serif",
                            }}>
                                Ask me about any destination in Nepal — history, culture,
                                sacred sites, trekking routes, and local phrases.
                            </p>
                        </div>

                        {/* Quick-start chips */}
                        <div style={{
                            display: 'flex', flexWrap: 'wrap', gap: 7,
                            justifyContent: 'center', maxWidth: 380, marginTop: 4,
                        }}>
                            {CHIPS.map(c => (
                                <button
                                    key={c.label}
                                    className="chip-btn"
                                    onClick={() => sendMessage(c.text)}
                                    style={{
                                        padding: '6px 13px', borderRadius: 999,
                                        border: '1px solid rgba(184,137,42,0.25)',
                                        background: '#FFFFFF',
                                        color: '#6B3D1E',
                                        fontSize: 11.5, cursor: 'pointer',
                                        transition: 'all .2s', fontFamily: 'inherit',
                                        letterSpacing: '0.03em', fontWeight: 500,
                                        boxShadow: '0 1px 4px rgba(61,32,16,0.06)',
                                    }}
                                >
                                    {c.label}
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

            {/* ── Input bar ── */}
            <div style={{
                padding: '10px 14px 13px',
                borderTop: '1px solid rgba(184,137,42,0.18)',
                background: '#FFFFFF',
                flexShrink: 0,
                boxShadow: '0 -2px 12px rgba(61,32,16,0.06)',
            }}>
                <div style={{
                    display: 'flex', gap: 8, alignItems: 'center',
                    background: '#F9F3E8',
                    border: '1.5px solid rgba(184,137,42,0.22)',
                    borderRadius: 10, padding: '7px 7px 7px 14px',
                    transition: 'border-color 0.2s',
                }}>
                    <input
                        className="chat-input"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                        placeholder="Ask about any destination in Nepal..."
                        style={{
                            flex: 1, background: 'transparent', border: 'none',
                            color: '#2A1608', fontSize: 13,
                            fontFamily: "'Crimson Pro', Georgia, serif",
                            letterSpacing: '0.02em',
                        }}
                    />
                    <button
                        className="send-btn"
                        onClick={send}
                        disabled={busy}
                        title="Send"
                        style={{
                            width: 34, height: 34, borderRadius: 8,
                            border: 'none',
                            background: busy ? 'rgba(155,35,53,0.15)' : '#9B2335',
                            color: busy ? 'rgba(155,35,53,0.4)' : '#FFFFFF',
                            cursor: busy ? 'default' : 'pointer',
                            fontSize: 14,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all .2s',
                            boxShadow: busy ? 'none' : '0 2px 8px rgba(155,35,53,0.28)',
                        }}
                    >
                        ➤
                    </button>
                </div>

                {/* Footer */}
                <div style={{
                    textAlign: 'center', fontSize: 9.5, marginTop: 7,
                    color: 'rgba(61,32,16,0.28)', letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                }}>
                    ❈ HATI · Groq + Llama 3 · Open-Meteo Weather · Nepal Travel Intelligence
                </div>
            </div>
        </div>
    );
}