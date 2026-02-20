import { useEffect, useRef, useState, useCallback } from 'react';
import { useHati } from '../../context/HatiContext';
import WeatherBar from './WeatherBar';
import RouteCards from './RouteCards';
import 'leaflet/dist/leaflet.css';

const NEPAL_PLACES = {
    'boudhanath': [27.7215, 85.3620], 'boudha': [27.7215, 85.3620],
    'pashupatinath': [27.7109, 85.3487], 'pashupati': [27.7109, 85.3487],
    'swayambhunath': [27.7149, 85.2904], 'monkey temple': [27.7149, 85.2904],
    'thamel': [27.7157, 85.3123], 'durbar square': [27.7048, 85.3072],
    'patan': [27.6726, 85.3246], 'lalitpur': [27.6726, 85.3246],
    'bhaktapur': [27.6710, 85.4298], 'pokhara': [28.2096, 83.9856],
    'fewa lake': [28.2062, 83.9561], 'chitwan': [27.5291, 84.3542],
    'lumbini': [27.4833, 83.2757], 'nagarkot': [27.7199, 85.5197],
    'tribhuvan airport': [27.6966, 85.3591], 'baneshwor': [27.6942, 85.3411],
    'ratna park': [27.7043, 85.3143], 'new road': [27.7048, 85.3110],
    'asan': [27.7082, 85.3133], 'kalanki': [27.6955, 85.2820],
    'chabahil': [27.7247, 85.3487], 'maharajgunj': [27.7383, 85.3297],
    'lazimpat': [27.7240, 85.3237], 'jawalakhel': [27.6754, 85.3211],
    'patan durbar': [27.6726, 85.3246], 'kathmandu durbar': [27.7048, 85.3072],
};

async function geocode(q) {
    const ql = q.toLowerCase().trim();
    for (const [key, coords] of Object.entries(NEPAL_PLACES)) {
        if (ql.includes(key) || key.includes(ql))
            return { lat: coords[0], lon: coords[1], name: q };
    }
    for (const attempt of [`${q}, Nepal`, `${q}, Kathmandu Valley, Nepal`]) {
        try {
            const r = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(attempt)}&format=json&limit=3&countrycodes=np`,
                { headers: { 'Accept-Language': 'en', 'User-Agent': 'HATI-Nepal-App/2.0' } }
            );
            const d = await r.json();
            if (d.length) return {
                lat: parseFloat(d[0].lat), lon: parseFloat(d[0].lon),
                name: d[0].display_name.split(',').slice(0, 2).join(', ')
            };
        } catch { }
    }
    return null;
}

function distM(a, b) {
    const R = 6371000, dL = (b.lat - a.lat) * Math.PI / 180,
        dO = (b.lon - a.lon) * Math.PI / 180,
        x = Math.sin(dL / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) *
            Math.cos(b.lat * Math.PI / 180) * Math.sin(dO / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export default function HatiMap() {
    const mapRef = useRef(null);
    const leafletMap = useRef(null);
    const markersRef = useRef({ origin: null, dest: null, sim: null, line: null });
    const simRef = useRef(null);

    const { origin, setOrigin, dest, setDest, fetchRoute, routeOptions, triggerArrival } = useHati();

    const [originInput, setOriginInput] = useState('');
    const [destInput, setDestInput] = useState('');
    const [hint, setHint] = useState('Enter origin and destination to find routes');
    const [err, setErr] = useState('');
    const [distLabel, setDistLabel] = useState('');
    const [simPct, setSimPct] = useState(0);
    const [simRunning, setSimRunning] = useState(false);
    const [arrived, setArrived] = useState(false);
    const [showSimBar, setShowSimBar] = useState(false);

    useEffect(() => {
        if (leafletMap.current) return;
        import('leaflet').then(L => {
            const map = L.default.map(mapRef.current).setView([27.7172, 85.3240], 12);
            L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap', maxZoom: 19
            }).addTo(map);
            leafletMap.current = { map, L: L.default };
        });
        return () => { if (simRef.current) clearInterval(simRef.current); };
    }, []);

    const clearMarkers = useCallback(() => {
        const { map } = leafletMap.current || {};
        if (!map) return;
        Object.values(markersRef.current).forEach(m => { if (m) map.removeLayer(m); });
        markersRef.current = { origin: null, dest: null, sim: null, line: null };
    }, []);

    const getRoute = useCallback(async () => {
        if (!originInput.trim() || !destInput.trim()) { setErr('Enter both origin and destination.'); return; }
        setErr(''); setHint('Searching…');
        if (simRef.current) { clearInterval(simRef.current); simRef.current = null; }
        setSimRunning(false); setArrived(false); setShowSimBar(false); setSimPct(0);

        const [o, d] = await Promise.all([geocode(originInput), geocode(destInput)]);
        if (!o) { setErr(`"${originInput}" not found. Try a fuller name.`); return; }
        if (!d) { setErr(`"${destInput}" not found. Try a fuller name.`); return; }
        setOrigin(o); setDest(d);

        const { map, L } = leafletMap.current;
        clearMarkers();

        markersRef.current.origin = L.marker([o.lat, o.lon], {
            icon: L.divIcon({ html: '<div style="font-size:20px">🟢</div>', iconSize: [26, 26], iconAnchor: [13, 13], className: '' })
        }).addTo(map).bindPopup(`From: ${o.name}`);

        markersRef.current.dest = L.marker([d.lat, d.lon], {
            icon: L.divIcon({ html: '<div style="font-size:20px">📍</div>', iconSize: [26, 26], iconAnchor: [13, 13], className: '' })
        }).addTo(map).bindPopup(`To: ${d.name}`).openPopup();

        markersRef.current.line = L.polyline([[o.lat, o.lon], [d.lat, d.lon]], {
            color: '#9B2335', weight: 2.5, dashArray: '8 5', opacity: 0.7
        }).addTo(map);

        map.fitBounds([[o.lat, o.lon], [d.lat, d.lon]], { padding: [55, 55] });

        const dm = distM({ lat: o.lat, lon: o.lon }, { lat: d.lat, lon: d.lon });
        const dk = (dm / 1000).toFixed(1);
        setHint(`${dk} km · Select transport below · Simulate to begin journey`);
        setDistLabel('');
        await fetchRoute(parseFloat(dk), d.lat, d.lon);
    }, [originInput, destInput, fetchRoute, setOrigin, setDest, clearMarkers]);

    const startSimulation = useCallback(() => {
        if (!origin || !dest) { setErr('Find a route first.'); return; }
        if (simRef.current) { clearInterval(simRef.current); simRef.current = null; }
        setArrived(false); setSimPct(0); setShowSimBar(true); setSimRunning(true);

        const { map, L } = leafletMap.current;
        const steps = 60;
        let step = 0;

        simRef.current = setInterval(() => {
            step++;
            const t = step / steps;
            const lat = origin.lat + (dest.lat - origin.lat) * t;
            const lon = origin.lon + (dest.lon - origin.lon) * t;
            const pct = Math.round(t * 100);
            setSimPct(pct);

            const simIcon = L.divIcon({
                html: '<div style="width:13px;height:13px;background:#9B2335;border:2.5px solid #fff;border-radius:50%;box-shadow:0 0 10px rgba(155,35,53,0.7)"></div>',
                iconSize: [13, 13], iconAnchor: [6, 6], className: ''
            });

            if (markersRef.current.sim) markersRef.current.sim.setLatLng([lat, lon]);
            else markersRef.current.sim = L.marker([lat, lon], { icon: simIcon }).addTo(map);

            const remaining = Math.round(distM({ lat, lon }, { lat: dest.lat, lon: dest.lon }));
            setDistLabel(`${remaining}m remaining`);

            if (step >= steps || remaining < 80) {
                clearInterval(simRef.current); simRef.current = null;
                setSimRunning(false); setSimPct(100); setDistLabel('Arrived!');
                setArrived(true);
                triggerArrival(dest.name, dest.lat, dest.lon);
            }
        }, 300);
    }, [origin, dest, triggerArrival]);

    const stopSimulation = useCallback(() => {
        if (simRef.current) { clearInterval(simRef.current); simRef.current = null; }
        setSimRunning(false);
    }, []);

    const manualArrival = useCallback(() => {
        if (!dest) { setErr('Find a route first.'); return; }
        if (!arrived) { setArrived(true); triggerArrival(dest.name, dest.lat, dest.lon); }
    }, [dest, arrived, triggerArrival]);

    const resetAll = useCallback(() => {
        stopSimulation(); clearMarkers();
        setOrigin(null); setDest(null);
        setOriginInput(''); setDestInput('');
        setErr(''); setHint('Enter origin and destination to find routes');
        setDistLabel(''); setSimPct(0); setShowSimBar(false); setArrived(false);
        if (leafletMap.current) leafletMap.current.map.setView([27.7172, 85.3240], 12);
    }, [stopSimulation, clearMarkers, setOrigin, setDest]);

    /* ── shared input style ── */
    const inp = {
        flex: 1, padding: '10px 14px',
        background: 'transparent',
        border: 'none',
        borderRadius: 0, color: '#2A1608', fontSize: 13,
        fontFamily: "'Crimson Pro', Georgia, serif",
        outline: 'none', letterSpacing: '0.02em',
    };

    /* ── action button factory ── */
    const actionBtn = (variant) => {
        const map = {
            simulate: {
                bg: 'transparent', border: 'rgba(155,35,53,0.3)', color: '#9B2335',
            },
            stop: {
                bg: 'rgba(155,35,53,0.08)', border: 'rgba(155,35,53,0.4)', color: '#7D1C2B',
            },
            here: {
                bg: 'transparent', border: 'rgba(184,137,42,0.3)', color: '#6B3D1E',
            },
            reset: {
                bg: 'transparent', border: 'rgba(155,35,53,0.25)', color: '#9B2335',
            },
        };
        const v = map[variant] || map.simulate;
        return {
            flex: 1, padding: '9px 12px', borderRadius: 8,
            border: `1.5px solid ${v.border}`, background: v.bg, color: v.color,
            fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
            letterSpacing: '0.08em', textTransform: 'uppercase',
            fontWeight: 600, transition: 'all .2s', whiteSpace: 'nowrap',
        };
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#F9F3E8' }}>
            <style>{`
                .hati-inp:focus { border-color: rgba(184,137,42,0.5) !important; }
                .hati-inp::placeholder { color: rgba(61,32,16,0.3); font-style: italic; }
                .find-btn:hover  { background: #7D1C2B !important; box-shadow: 0 4px 14px rgba(155,35,53,0.35) !important; }
                .action-btn:hover { opacity: 0.8; transform: translateY(-1px); }
            `}</style>

            {/* ── Controls Panel ── */}
            <div style={{
                padding: '16px 18px',
                flexShrink: 0,
                background: '#FFFFFF',
                borderBottom: '1px solid rgba(184,137,42,0.18)',
                boxShadow: '0 1px 8px rgba(61,32,16,0.06)',
            }}>

                {/* Section label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ height: 1, flex: 1, background: 'rgba(184,137,42,0.18)' }} />
                    <span style={{
                        fontSize: 9, color: '#9C6840',
                        textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 600,
                    }}>Route Planner</span>
                    <div style={{ height: 1, flex: 1, background: 'rgba(184,137,42,0.18)' }} />
                </div>

                {/* Input grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>

                    {/* Origin */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            minWidth: 52, textAlign: 'right',
                            fontSize: 9, color: '#9C6840',
                            textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600,
                        }}>Origin</div>
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            border: '1.5px solid rgba(184,137,42,0.22)',
                            borderRadius: 8, background: '#F9F3E8', overflow: 'hidden',
                            transition: 'border-color 0.2s',
                        }}>
                            <span style={{ padding: '0 10px', fontSize: 13 }}>🟢</span>
                            <input
                                className="hati-inp"
                                style={inp}
                                value={originInput}
                                onChange={e => setOriginInput(e.target.value)}
                                placeholder="e.g. Thamel, Kathmandu"
                                onKeyDown={e => e.key === 'Enter' && getRoute()}
                            />
                        </div>
                    </div>

                    {/* Connector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ minWidth: 52 }} />
                        <div style={{ paddingLeft: 14, display: 'flex', alignItems: 'center' }}>
                            <div style={{ width: 1, height: 12, background: 'rgba(184,137,42,0.3)' }} />
                        </div>
                    </div>

                    {/* Destination */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            minWidth: 52, textAlign: 'right',
                            fontSize: 9, color: '#9C6840',
                            textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600,
                        }}>Dest</div>
                        <div style={{
                            flex: 1, display: 'flex', alignItems: 'center',
                            border: '1.5px solid rgba(184,137,42,0.22)',
                            borderRadius: 8, background: '#F9F3E8', overflow: 'hidden',
                        }}>
                            <span style={{ padding: '0 10px', fontSize: 13 }}>📍</span>
                            <input
                                className="hati-inp"
                                style={inp}
                                value={destInput}
                                onChange={e => setDestInput(e.target.value)}
                                placeholder="e.g. Boudhanath Stupa"
                                onKeyDown={e => e.key === 'Enter' && getRoute()}
                            />
                        </div>

                        <button
                            className="find-btn"
                            onClick={getRoute}
                            style={{
                                padding: '10px 20px', borderRadius: 8,
                                border: 'none',
                                background: '#9B2335', color: '#FFFFFF',
                                fontSize: 11, cursor: 'pointer', fontFamily: 'inherit',
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                fontWeight: 700, transition: 'all .2s', whiteSpace: 'nowrap',
                                boxShadow: '0 2px 10px rgba(155,35,53,0.25)',
                            }}
                        >Find Route</button>
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(184,137,42,0.12)', margin: '12px 0' }} />

                {/* Action buttons */}
                <div style={{ display: 'flex', gap: 8 }}>
                    <button
                        className="action-btn"
                        onClick={simRunning ? stopSimulation : startSimulation}
                        style={actionBtn(simRunning ? 'stop' : 'simulate')}
                    >
                        {simRunning ? '⏹ Stop' : '▶ Simulate Journey'}
                    </button>
                    <button className="action-btn" onClick={manualArrival} style={actionBtn('here')}>
                        🎯 I Am Here
                    </button>
                    <button className="action-btn" onClick={resetAll} style={actionBtn('reset')}>
                        ↺ Reset
                    </button>
                </div>

                {/* Hint */}
                {!err && hint && (
                    <div style={{
                        marginTop: 10, fontSize: 10,
                        color: 'rgba(61,32,16,0.38)',
                        textAlign: 'center', letterSpacing: '0.08em', fontStyle: 'italic',
                    }}>❈ {hint}</div>
                )}

                {/* Error */}
                {err && (
                    <div style={{
                        marginTop: 10, fontSize: 11, color: '#9B2335',
                        textAlign: 'center', letterSpacing: '0.05em', fontWeight: 600,
                    }}>⚠ {err}</div>
                )}
            </div>

            {/* ── Weather ── */}
            <WeatherBar />

            {/* ── Route cards ── */}
            <RouteCards options={routeOptions} />

            {/* ── Simulation progress bar ── */}
            {showSimBar && (
                <div style={{
                    padding: '10px 18px', flexShrink: 0,
                    background: '#FFFFFF',
                    borderBottom: '1px solid rgba(184,137,42,0.15)',
                }}>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        fontSize: 10, color: '#9C6840',
                        letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6,
                        fontWeight: 600,
                    }}>
                        <span>{origin?.name?.split(',')[0]}</span>
                        <span style={{ color: '#9B2335' }}>{simPct}%</span>
                        <span>{dest?.name?.split(',')[0]}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(184,137,42,0.12)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%', width: `${simPct}%`,
                            background: 'linear-gradient(90deg, #9B2335, #B8892A)',
                            borderRadius: 2, transition: 'width .5s linear',
                        }} />
                    </div>
                </div>
            )}

            {/* ── Arrived banner ── */}
            {arrived && (
                <div style={{
                    margin: '10px 18px', padding: '11px 16px', borderRadius: 10,
                    background: '#F0FAF3',
                    border: '1px solid rgba(45,122,79,0.25)',
                    color: '#1C5934', fontSize: 12.5, textAlign: 'center',
                    letterSpacing: '0.04em', fontFamily: "'Crimson Pro', serif",
                }}>
                    ❈ Arrived at <strong>{dest?.name?.split(',')[0]}</strong> — Switched to destination guide →
                </div>
            )}

            {/* ── Map ── */}
            <div ref={mapRef} style={{ flex: 1, minHeight: 100 }} />

            {/* ── Legend footer ── */}
            <div style={{
                padding: '8px 18px', flexShrink: 0,
                background: '#FFFFFF',
                borderTop: '1px solid rgba(184,137,42,0.15)',
                display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            }}>
                {[['🟢', 'Origin'], ['📍', 'Destination'], ['—', 'Route']].map(([icon, label]) => (
                    <span key={label} style={{
                        fontSize: 9.5, color: 'rgba(61,32,16,0.38)',
                        display: 'flex', alignItems: 'center', gap: 5,
                        textTransform: 'uppercase', letterSpacing: '0.1em',
                    }}>{icon} {label}</span>
                ))}
                {distLabel && (
                    <span style={{
                        marginLeft: 'auto', fontSize: 10,
                        color: '#9B2335', fontWeight: 600,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                    }}>❈ {distLabel}</span>
                )}
            </div>
        </div>
    );
}