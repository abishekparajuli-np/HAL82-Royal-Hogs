import { useEffect, useRef, useState, useCallback } from 'react';
import { useHati } from '../../context/HatiContext';
import WeatherBar from './WeatherBar';
import RouteCards from './RouteCards';
import 'leaflet/dist/leaflet.css';

// Nepal landmark dictionary
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
        } catch { /* try next */ }
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

    // Init map
    useEffect(() => {
        if (leafletMap.current) return;
        import('leaflet').then(L => {
            const map = L.default.map(mapRef.current).setView([27.7172, 85.3240], 12);
            L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap', maxZoom: 19
            }).addTo(map);
            leafletMap.current = { map, L: L.default };
        });
        return () => {
            if (simRef.current) clearInterval(simRef.current);
        };
    }, []);

    const makeIcon = useCallback((html) => {
        if (!leafletMap.current) return null;
        const { L } = leafletMap.current;
        return L.divIcon({ html, iconSize: [26, 26], iconAnchor: [13, 13], className: '' });
    }, []);

    const clearMarkers = useCallback(() => {
        const { map } = leafletMap.current || {};
        if (!map) return;
        Object.values(markersRef.current).forEach(m => { if (m) map.removeLayer(m); });
        markersRef.current = { origin: null, dest: null, sim: null, line: null };
    }, []);

    const getRoute = useCallback(async () => {
        if (!originInput.trim() || !destInput.trim()) { setErr('Enter both origin and destination.'); return; }
        setErr(''); setHint('🔍 Searching...');
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
        }).addTo(map).bindPopup(`🟢 From: ${o.name}`);

        markersRef.current.dest = L.marker([d.lat, d.lon], {
            icon: L.divIcon({ html: '<div style="font-size:20px">📍</div>', iconSize: [26, 26], iconAnchor: [13, 13], className: '' })
        }).addTo(map).bindPopup(`📍 To: ${d.name}`).openPopup();

        markersRef.current.line = L.polyline([[o.lat, o.lon], [d.lat, d.lon]], {
            color: '#ffc107', weight: 2.5, dashArray: '8 5', opacity: 0.75
        }).addTo(map);

        map.fitBounds([[o.lat, o.lon], [d.lat, d.lon]], { padding: [55, 55] });

        const dm = distM({ lat: o.lat, lon: o.lon }, { lat: d.lat, lon: d.lon });
        const dk = (dm / 1000).toFixed(1);
        setHint(`📏 ${dk} km · Pick transport below · ▶ to simulate journey`);
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
                html: '<div style="width:14px;height:14px;background:#8b5cf6;border:3px solid white;border-radius:50%;box-shadow:0 0 10px rgba(139,92,246,.9)"></div>',
                iconSize: [14, 14], iconAnchor: [7, 7], className: ''
            });

            if (markersRef.current.sim) markersRef.current.sim.setLatLng([lat, lon]);
            else markersRef.current.sim = L.marker([lat, lon], { icon: simIcon }).addTo(map);

            const remaining = Math.round(distM({ lat, lon }, { lat: dest.lat, lon: dest.lon }));
            setDistLabel(`${remaining}m remaining`);

            if (step >= steps || remaining < 80) {
                clearInterval(simRef.current); simRef.current = null;
                setSimRunning(false); setSimPct(100); setDistLabel('Arrived! 🎉');
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
        stopSimulation();
        clearMarkers();
        setOrigin(null); setDest(null);
        setOriginInput(''); setDestInput('');
        setErr(''); setHint('Enter origin and destination to find routes');
        setDistLabel(''); setSimPct(0); setShowSimBar(false); setArrived(false);
        if (leafletMap.current) leafletMap.current.map.setView([27.7172, 85.3240], 12);
    }, [stopSimulation, clearMarkers, setOrigin, setDest]);

    const inp = {
        flex: 1, padding: '7px 11px',
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,193,7,0.15)',
        borderRadius: 8, color: '#f0ede8', fontSize: 12.5,
        fontFamily: 'inherit', outline: 'none',
    };

    const btn = (extra = {}) => ({
        padding: '7px 12px', borderRadius: 8, border: 'none',
        fontSize: 12, cursor: 'pointer', fontWeight: 500,
        transition: 'all .2s', whiteSpace: 'nowrap', fontFamily: 'inherit',
        ...extra,
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Controls */}
            <div style={{ padding: '9px 13px', background: 'rgba(0,0,0,0.28)', borderBottom: '1px solid rgba(255,193,7,0.15)', flexShrink: 0 }}>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 10.5, color: 'rgba(240,237,232,0.4)', minWidth: 28 }}>📍 From</span>
                    <input style={inp} value={originInput} onChange={e => setOriginInput(e.target.value)}
                        placeholder="e.g. Thamel, Kathmandu" onKeyDown={e => e.key === 'Enter' && getRoute()} />
                </div>
                <div style={{ display: 'flex', gap: 7, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 10.5, color: 'rgba(240,237,232,0.4)', minWidth: 28 }}>🏁 To</span>
                    <input style={inp} value={destInput} onChange={e => setDestInput(e.target.value)}
                        placeholder="e.g. Boudhanath Stupa" onKeyDown={e => e.key === 'Enter' && getRoute()} />
                    <button onClick={getRoute} style={btn({ background: 'linear-gradient(135deg,#d97706,#92400e)', color: '#fff' })}>
                        Find Route
                    </button>
                </div>
                <div style={{ display: 'flex', gap: 7 }}>
                    <button onClick={simRunning ? stopSimulation : startSimulation} style={btn({
                        flex: 1,
                        background: simRunning ? 'rgba(16,185,129,0.14)' : 'rgba(59,130,246,0.14)',
                        border: `1px solid ${simRunning ? 'rgba(16,185,129,0.3)' : 'rgba(59,130,246,0.28)'}`,
                        color: simRunning ? '#6ee7b7' : '#93c5fd',
                    })}>
                        {simRunning ? '⏹ Stop' : '▶ Simulate Journey'}
                    </button>
                    <button onClick={manualArrival} style={btn({
                        flex: 1, background: 'rgba(168,85,247,0.14)',
                        border: '1px solid rgba(168,85,247,0.3)', color: '#c4b5fd',
                    })}>🎯 I Am Here</button>
                    <button onClick={resetAll} style={btn({
                        background: 'rgba(239,68,68,0.12)',
                        border: '1px solid rgba(239,68,68,0.28)', color: '#fca5a5',
                    })}>↺ Reset</button>
                </div>

                {hint && !err && <div style={{ fontSize: 11, color: 'rgba(255,193,7,0.55)', textAlign: 'center', marginTop: 5 }}>{hint}</div>}
                {err && <div style={{ fontSize: 11, color: '#fca5a5', textAlign: 'center', marginTop: 5 }}>⚠️ {err}</div>}
            </div>

            {/* Weather */}
            <WeatherBar />

            {/* Route cards */}
            <RouteCards options={routeOptions} />

            {/* Sim progress */}
            {showSimBar && (
                <div style={{ padding: '6px 14px', background: 'rgba(168,85,247,0.1)', borderBottom: '1px solid rgba(168,85,247,0.2)', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: '#c4b5fd', marginBottom: 4 }}>
                        <span>{origin?.name?.split(',')[0]}</span>
                        <span>{simPct}%</span>
                        <span>{dest?.name?.split(',')[0]}</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${simPct}%`, background: 'linear-gradient(90deg,#8b5cf6,#c4b5fd)', borderRadius: 4, transition: 'width .5s linear' }} />
                    </div>
                </div>
            )}

            {/* Arrived banner */}
            {arrived && (
                <div style={{
                    margin: '7px 13px', padding: '9px 13px', borderRadius: 9,
                    background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.35)',
                    color: '#6ee7b7', fontSize: 12, textAlign: 'center', fontWeight: 500,
                }}>
                    🎉 Arrived at {dest?.name?.split(',')[0]}! Switched to guide chat →
                </div>
            )}

            {/* Map */}
            <div ref={mapRef} style={{ flex: 1, minHeight: 100 }} />

            {/* Footer */}
            <div style={{
                padding: '6px 13px', background: 'rgba(0,0,0,0.2)',
                borderTop: '1px solid rgba(255,193,7,0.15)',
                display: 'flex', gap: 12, fontSize: 10, color: 'rgba(240,237,232,0.4)',
                alignItems: 'center', flexShrink: 0, flexWrap: 'wrap',
            }}>
                <span>🟢 Origin</span><span>📍 Destination</span><span>🔵 Simulated</span>
                {distLabel && <span style={{ marginLeft: 'auto', color: 'rgba(255,193,7,0.55)' }}>{distLabel}</span>}
            </div>
        </div>
    );
}