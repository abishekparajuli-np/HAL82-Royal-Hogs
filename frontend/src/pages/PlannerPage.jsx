import { useState, useEffect, useRef, useCallback } from "react";
import logo from "../assets/logo.png"

// ─── FONTS & GLOBAL STYLES ────────────────────────────────────────────────────
const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Sanskrit&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&display=swap";
document.head.appendChild(_fl);

const _st = document.createElement("style");
_st.textContent = `
  :root {
    --ivory: #F9F3E8;
    --ivory-deep: #F0E6D0;
    --ivory-subtle: #EDE0C8;
    --red: #9B2335;
    --red-soft: #C4445A;
    --red-dark: #7D1C2B;
    --gold: #B8892A;
    --gold-light: #D4A84B;
    --brown: #2A1608;
    --brown-mid: #6B3D1E;
    --brown-soft: #9C6840;
    --ink: #2A1608;
    --muted: rgba(61,32,16,0.45);
    --border: rgba(184,137,42,0.22);
    --border-soft: rgba(184,137,42,0.11);
    --shadow-sm: 0 1px 4px rgba(61,32,16,0.07);
    --shadow-md: 0 4px 20px rgba(61,32,16,0.10);
    --shadow-lg: 0 8px 48px rgba(61,32,16,0.14);
  }

  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
  @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(184,137,42,0.2)}50%{box-shadow:0 0 22px rgba(184,137,42,0.45)}}
  @keyframes dotPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.4);opacity:1}}
  @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
  @keyframes breathe{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(184,137,42,0.4)}50%{transform:scale(1.04);box-shadow:0 0 0 12px rgba(184,137,42,0)}}
  @keyframes revealChar{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}

  *{box-sizing:border-box;margin:0;padding:0}
  html{-webkit-font-smoothing:antialiased;scroll-behavior:smooth;}
  body{background:var(--ivory);color:var(--ink);font-family:'Crimson Pro',Georgia,serif;line-height:1.65;}

  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-track{background:var(--ivory-subtle)}
  ::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}

  input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;background:var(--border-soft);outline:none;width:100%}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--red));cursor:pointer;border:2px solid #fff;box-shadow:var(--shadow-sm)}

  textarea:focus,input[type=text]:focus,input[type=number]:focus{outline:none}
  button{transition:all 0.18s ease;cursor:pointer;border:none}
  button:active{transform:scale(0.97)!important}

  .card{background:#fff;border:1px solid var(--border);border-radius:12px;padding:1.5rem;box-shadow:var(--shadow-md);}
  .card-hover:hover{transform:translateY(-2px);box-shadow:var(--shadow-md);transition:all 0.2s ease;}
  .badge{display:inline-block;padding:0.2em 0.75em;border-radius:999px;font-size:0.75rem;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;background:var(--ivory-deep);color:var(--brown-mid);border:1px solid var(--border);}

  input,textarea,select{width:100%;padding:0.65em 1em;border:1.5px solid var(--border);border-radius:8px;background:#fff;color:var(--ink);font-family:'Crimson Pro',serif;font-size:1rem;transition:border-color 180ms,box-shadow 180ms;outline:none;}
  input:focus,textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,137,42,0.12);}
`;
document.head.appendChild(_st);

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.022'/%3E%3C/svg%3E")`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ACTIVITIES = [
    { id: "k1", name: "Boudhanath Stupa Kora", cost: 500, rating: 93, cat: "Culture", district: "Kathmandu", timeSlot: "evening", tip: "Go at dusk — butter lamps lit, pilgrims spinning prayer wheels.", dur: 2 },
    { id: "k2", name: "Pashupatinath Aarti Ceremony", cost: 1000, rating: 94, cat: "Culture", district: "Kathmandu", timeSlot: "evening", tip: "Arrive by 5 PM for a front-row spot on the eastern bank.", dur: 2 },
    { id: "k3", name: "Swayambhunath Sunset Walk", cost: 300, rating: 89, cat: "Sightseeing", district: "Kathmandu", timeSlot: "afternoon", tip: "365 steps worth every breath. Watch pockets near the monkeys.", dur: 2 },
    { id: "k4", name: "Asan Tole Street Food Crawl", cost: 600, rating: 88, cat: "Food", district: "Kathmandu", timeSlot: "morning", tip: "Try samay baji and jeri-swari. Budget NPR 200–300 per stop.", dur: 2 },
    { id: "k5", name: "Thamel Live Music Night", cost: 1500, rating: 79, cat: "Nightlife", district: "Kathmandu", timeSlot: "evening", tip: "Purple Haze has free live classic rock from 7 PM.", dur: 3 },
    { id: "k6", name: "Garden of Dreams", cost: 400, rating: 82, cat: "Leisure", district: "Kathmandu", timeSlot: "afternoon", tip: "A hidden Edwardian gem two minutes from Thamel.", dur: 2 },
    { id: "k9", name: "Kopan Monastery Meditation", cost: 0, rating: 86, cat: "Wellness", district: "Kathmandu", timeSlot: "morning", tip: "Drop-in morning meditation at 8 AM is free.", dur: 2 },
    { id: "l1", name: "Patan Durbar Square", cost: 1000, rating: 95, cat: "Culture", district: "Lalitpur", timeSlot: "morning", tip: "Best light 7–9 AM. Ticket covers the museum too.", dur: 3 },
    { id: "l2", name: "Patan Museum", cost: 1000, rating: 96, cat: "Culture", district: "Lalitpur", timeSlot: "morning", tip: "Arguably the finest museum in Nepal.", dur: 2 },
    { id: "l4", name: "Newari Feast at Honacha", cost: 800, rating: 90, cat: "Food", district: "Lalitpur", timeSlot: "afternoon", tip: "Just sit — food appears. Twelve small dishes.", dur: 2 },
    { id: "l7", name: "Patan Bronze Craft Workshop", cost: 600, rating: 88, cat: "Activity", district: "Lalitpur", timeSlot: "afternoon", tip: "Watch and try lost-wax bronze casting.", dur: 3 },
    { id: "b1", name: "Bhaktapur Durbar Square", cost: 1800, rating: 96, cat: "Culture", district: "Bhaktapur", timeSlot: "morning", tip: "Keep your receipt — covers all of Bhaktapur for multiple days.", dur: 3 },
    { id: "b2", name: "Pottery Square Class", cost: 1200, rating: 89, cat: "Activity", district: "Bhaktapur", timeSlot: "morning", tip: "30-min hands-on session for NPR 300–500 extra.", dur: 2 },
    { id: "b3", name: "Juju Dhau (King Yoghurt)", cost: 200, rating: 92, cat: "Food", district: "Bhaktapur", timeSlot: "afternoon", tip: "Only made in Bhaktapur. Thicker and creamier than anything else.", dur: 1 },
    { id: "b6", name: "Changu Narayan Day Trip", cost: 300, rating: 90, cat: "Culture", district: "Bhaktapur", timeSlot: "morning", tip: "Nepal's oldest Vishnu temple, 4th century.", dur: 4 },
    { id: "ka1", name: "Sarangkot Sunrise Hike", cost: 1500, rating: 97, cat: "Nature", district: "Kaski", timeSlot: "morning", tip: "Leave lakeside by 4:30 AM. Life-changing on a clear day.", dur: 4 },
    { id: "ka2", name: "Phewa Lake Boat Ride", cost: 1000, rating: 89, cat: "Leisure", district: "Kaski", timeSlot: "afternoon", tip: "Row yourself or hire a boatman. Island temple is a short paddle.", dur: 2 },
    { id: "ka3", name: "Paragliding", cost: 7000, rating: 99, cat: "Adventure", district: "Kaski", timeSlot: "morning", tip: "Sunrise flights have the clearest Himalayan views.", dur: 3 },
    { id: "ka7", name: "Valley Zip-line", cost: 5000, rating: 95, cat: "Adventure", district: "Kaski", timeSlot: "morning", tip: "World's longest zip-line at 1.8 km.", dur: 2 },
    { id: "c1", name: "Jungle Jeep Safari", cost: 4500, rating: 96, cat: "Nature", district: "Chitwan", timeSlot: "morning", tip: "Rhinos and gharials almost guaranteed at dawn.", dur: 4 },
    { id: "c2", name: "Rapti River Canoe Ride", cost: 1500, rating: 87, cat: "Nature", district: "Chitwan", timeSlot: "morning", tip: "Glide silently past gharials and crocodiles.", dur: 2 },
    { id: "c3", name: "Tharu Cultural Show", cost: 500, rating: 82, cat: "Culture", district: "Chitwan", timeSlot: "evening", tip: "The stick dance performed by Tharu men is mesmerizing.", dur: 2 },
    { id: "c5", name: "Tharu Cooking Class", cost: 1200, rating: 86, cat: "Food", district: "Chitwan", timeSlot: "afternoon", tip: "Learn dhikri and wild-leaf curries. You eat everything you cook.", dur: 3 },
    { id: "s1", name: "Namche Bazaar Acclimatisation", cost: 0, rating: 88, cat: "Trekking", district: "Solukhumbu", timeSlot: "morning", tip: "Spend a full extra day here at 3,440 m.", dur: 6 },
    { id: "s2", name: "Tengboche Monastery", cost: 200, rating: 93, cat: "Culture", district: "Solukhumbu", timeSlot: "morning", tip: "The 5 AM puja drum-call is one of the most profound sounds.", dur: 3 },
    { id: "s4", name: "Khumbu Glacier Moraine Walk", cost: 0, rating: 92, cat: "Nature", district: "Solukhumbu", timeSlot: "morning", tip: "Eye-level glacier views from Lobuche to Gorak Shep.", dur: 5 },
    { id: "m1", name: "Lo Manthang Walled City", cost: 0, rating: 97, cat: "Culture", district: "Mustang", timeSlot: "afternoon", tip: "The last forbidden kingdom. Whitewashed walls at dusk.", dur: 3 },
    { id: "m3", name: "Mustang Plateau Trek", cost: 0, rating: 95, cat: "Trekking", district: "Mustang", timeSlot: "morning", tip: "Autumn apple orchards paint the desert in crimson and gold.", dur: 6 },
    { id: "m4", name: "Sky Cave Archaeological Site", cost: 500, rating: 94, cat: "Culture", district: "Mustang", timeSlot: "morning", tip: "Thousands of man-made caves with 2,500-year-old murals.", dur: 3 },
    { id: "bn1", name: "Bardia National Park Safari", cost: 5000, rating: 96, cat: "Nature", district: "Banke", timeSlot: "morning", tip: "Wilder than Chitwan. Highest Bengal tiger sightings.", dur: 5 },
    { id: "bn2", name: "Babai River Rafting", cost: 3000, rating: 90, cat: "Adventure", district: "Banke", timeSlot: "morning", tip: "Class III–IV rapids through pristine jungle.", dur: 4 },
];

const MISC = [
    { id: "mx1", name: "Local Photography Walk", cost: 0, rating: 80, cat: "Leisure", timeSlot: "morning", tip: "Just wander with your camera. Nepal surprises at every corner.", dur: 2 },
    { id: "mx2", name: "Sunrise Yoga Session", cost: 500, rating: 82, cat: "Wellness", timeSlot: "morning", tip: "Most guesthouses offer early morning yoga.", dur: 1 },
    { id: "mx3", name: "Local Market Exploration", cost: 300, rating: 78, cat: "Food", timeSlot: "morning", tip: "Buy snacks, spices, and souvenirs directly from vendors.", dur: 2 },
    { id: "mx7", name: "Nepali Cooking Class", cost: 1500, rating: 85, cat: "Food", timeSlot: "afternoon", tip: "Dal bhat, momos, sel-roti — you'll cook and eat everything.", dur: 3 },
    { id: "mx8", name: "Sunset Viewpoint Hike", cost: 0, rating: 83, cat: "Nature", timeSlot: "afternoon", tip: "Any local can point you to the best spot in under 30 minutes.", dur: 2 },
];

const DISTRICTS_META = {
    Kathmandu: { label: "Kathmandu", emoji: "🕌", color: "#9B2335", tagline: "City of Temples", region: "Valley", season: "Oct–Apr", temp: "15–25°C" },
    Lalitpur: { label: "Patan", emoji: "🎭", color: "#B8892A", tagline: "City of Fine Arts", region: "Valley", season: "Oct–Apr", temp: "15–25°C" },
    Bhaktapur: { label: "Bhaktapur", emoji: "⛩️", color: "#9B2335", tagline: "City of Devotees", region: "Valley", season: "Oct–Apr", temp: "15–25°C" },
    Kaski: { label: "Pokhara", emoji: "⛵", color: "#B8892A", tagline: "Gateway to the Himalayas", region: "Western", season: "Oct–Nov", temp: "18–28°C" },
    Chitwan: { label: "Chitwan", emoji: "🦏", color: "#9B2335", tagline: "Jungle Kingdom", region: "Terai", season: "Nov–Mar", temp: "20–32°C" },
    Solukhumbu: { label: "Everest Region", emoji: "❄️", color: "#B8892A", tagline: "Roof of the World", region: "Eastern", season: "Mar–May", temp: "-5–10°C" },
    Mustang: { label: "Mustang", emoji: "🌄", color: "#9B2335", tagline: "The Forbidden Kingdom", region: "Northern", season: "Mar–Nov", temp: "5–20°C" },
    Banke: { label: "Bardia", emoji: "🐯", color: "#B8892A", tagline: "Wild West Nepal", region: "Terai", season: "Oct–Mar", temp: "18–30°C" },
};

// ─── KNAPSACK ─────────────────────────────────────────────────────────────────
function knapsack(budget, items) {
    if (!items.length || budget <= 0) return [];
    const S = 50, W = Math.floor(budget / S), n = items.length;
    const dp = new Array(W + 1).fill(0);
    const keep = Array.from({ length: n }, () => new Uint8Array(W + 1));
    for (let i = 0; i < n; i++) {
        const wi = Math.max(1, Math.floor(items[i].cost / S)), vi = items[i].rating;
        for (let w = W; w >= wi; w--)
            if (dp[w - wi] + vi > dp[w]) { dp[w] = dp[w - wi] + vi; keep[i][w] = 1; }
    }
    const sel = []; let w = W;
    for (let i = n - 1; i >= 0; i--)
        if (keep[i][w]) { sel.push(items[i]); w -= Math.max(1, Math.floor(items[i].cost / S)); }
    return sel;
}

const fmt = n => `NPR ${Number(n).toLocaleString()}`;
const byTime = acts => [...acts].sort((a, b) => ({ morning: 0, afternoon: 1, evening: 2 }[a.timeSlot] || 1) - ({ morning: 0, afternoon: 1, evening: 2 }[b.timeSlot] || 1));

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Bubble({ text, from = "hati", typing = false }) {
    const isH = from === "hati";
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 10, flexDirection: isH ? "row" : "row-reverse", animation: "slideUp .25s ease both" }}>
            {isH && <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,var(--red),var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>                    <img
                src={logo}
                alt="Hati Logo"
                className="w-full h-full object-contain rounded-lg"
            /></div>}
            <div style={{ maxWidth: "84%", padding: "10px 14px", borderRadius: isH ? "4px 12px 12px 12px" : "12px 4px 12px 12px", background: isH ? "white" : "var(--ivory-deep)", border: "1px solid var(--border)", fontFamily: "'Crimson Pro',serif", fontSize: 13.5, lineHeight: 1.7, color: "var(--brown-mid)", whiteSpace: "pre-wrap", boxShadow: "var(--shadow-sm)" }}>
                {typing ? <span style={{ animation: "pulse 1s infinite", letterSpacing: 4, color: "var(--gold)" }}>● ● ●</span> : text}
            </div>
        </div>
    );
}

function Btn({ onClick, children, disabled, ghost, small, style = {} }) {
    return (
        <button onClick={onClick} disabled={disabled}
            style={{ width: "100%", padding: small ? "11px" : "14px", borderRadius: 10, border: ghost ? "1.5px solid var(--red)" : "none", background: ghost ? "transparent" : disabled ? "rgba(155,35,53,0.15)" : "var(--red)", color: ghost ? "var(--red)" : disabled ? "var(--muted)" : "white", fontFamily: "Cinzel", fontSize: small ? 10 : 12, letterSpacing: "1.5px", cursor: disabled ? "not-allowed" : "pointer", boxShadow: (!disabled && !ghost) ? "0 2px 14px rgba(155,35,53,0.28)" : "none", transition: "all .2s", justifyContent: "center", display: "flex", alignItems: "center", ...style }}
            onMouseEnter={e => { if (!disabled) { e.currentTarget.style.background = ghost ? "rgba(155,35,53,0.06)" : "var(--red-dark)"; e.currentTarget.style.transform = "translateY(-1px)"; } }}
            onMouseLeave={e => { if (!disabled) { e.currentTarget.style.background = ghost ? "transparent" : "var(--red)"; e.currentTarget.style.transform = "translateY(0)"; } }}>
            {children}
        </button>
    );
}

function ActCard({ act, included, onToggle, canAfford }) {
    const dim = !included && !canAfford;
    return (
        <div className="card-hover" style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", borderRadius: 10, marginBottom: 8, background: included ? "white" : "var(--ivory-deep)", border: `1px solid var(--border${included ? "" : "-soft"})`, opacity: dim ? .45 : 1, boxShadow: included ? "var(--shadow-sm)" : "none", animation: "slideUp .25s ease both" }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 15, fontWeight: 600, color: included ? "var(--ink)" : "var(--muted)", marginBottom: 4 }}>{act.name}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 5 }}>
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>{{ morning: "🌅", afternoon: "☀️", evening: "🌙" }[act.timeSlot]} {act.timeSlot}</span>
                    <span className="badge" style={{ fontSize: 9 }}>{act.cat}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: act.cost === 0 ? "#22863a" : "var(--gold)" }}>{act.cost === 0 ? "Free" : fmt(act.cost)}</span>
                    {act.dur && <span style={{ fontSize: 10, color: "var(--muted)" }}>~{act.dur}h</span>}
                    <span style={{ fontSize: 10, color: "var(--brown-soft)" }}>★{act.rating}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--brown-soft)", borderLeft: "2px solid var(--border)", paddingLeft: 8, fontStyle: "italic", fontFamily: "'Crimson Pro',serif" }}>💡 {act.tip}</div>
                {!included && !canAfford && <div style={{ fontSize: 10, color: "var(--red)", marginTop: 4 }}>⚠ Exceeds activity budget</div>}
            </div>
            <button onClick={() => onToggle(act)} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${included ? "var(--gold)" : "var(--border)"}`, background: included ? "var(--ivory-deep)" : "white", color: included ? "var(--gold)" : "var(--muted)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", animation: included ? "glow 2s ease-in-out infinite" : "none" }}>
                {included ? "✓" : "＋"}
            </button>
        </div>
    );
}

// ─── INTRO CHAT SCREEN ────────────────────────────────────────────────────────
function IntroChatScreen({ onStart }) {
    const [phase, setPhase] = useState("greeting"); // greeting | askName | awaitName | done
    const [msgs, setMsgs] = useState([]);
    const [nameInput, setNameInput] = useState("");
    const [showInput, setShowInput] = useState(false);
    const endRef = useRef(null);

    const introSequence = [
        { from: "hati", text: "नमस्ते 🙏", delay: 400 },
        { from: "hati", text: "I'm HATI — your AI companion for navigating Nepal.\n\nFrom Kathmandu's incense-thick temple courtyards to the frozen silence of Everest Base Camp, I'll help you craft a journey that fits both your soul and your budget.", delay: 1200 },
        { from: "hati", text: "I use a knapsack optimisation algorithm to squeeze maximum experience out of every rupee you have. No fluff. No filler. Just the real Nepal. 🏔️", delay: 2800 },
        { from: "hati", text: "Before we begin...\n\nWhat should I call you?", delay: 4800 },
    ];

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, showInput]);

    useEffect(() => {
        let timers = [];
        introSequence.forEach((msg, i) => {
            // show typing indicator before each message
            const typingTimer = setTimeout(() => {
                setMsgs(prev => {
                    // remove any existing typing bubble, add typing
                    const filtered = prev.filter(m => !m.typing);
                    return [...filtered, { typing: true, from: "hati", id: `typing-${i}` }];
                });
            }, msg.delay - 600);
            timers.push(typingTimer);

            const msgTimer = setTimeout(() => {
                setMsgs(prev => {
                    const filtered = prev.filter(m => !m.typing);
                    return [...filtered, { from: msg.from, text: msg.text, id: `msg-${i}` }];
                });
                if (i === introSequence.length - 1) {
                    setTimeout(() => setShowInput(true), 300);
                }
            }, msg.delay);
            timers.push(msgTimer);
        });
        return () => timers.forEach(clearTimeout);
    }, []);

    function handleSubmit() {
        const name = nameInput.trim();
        if (!name) return;
        setShowInput(false);
        setMsgs(prev => [...prev, { from: "user", text: name, id: "user-name" }]);
        setTimeout(() => {
            setMsgs(prev => [...prev, { from: "hati", typing: true, id: "typing-response" }]);
        }, 300);
        setTimeout(() => {
            setMsgs(prev => {
                const filtered = prev.filter(m => !m.typing);
                return [...filtered, { from: "hati", text: `What a wonderful name. Welcome, ${name}. 🙏\n\nLet's shape your Nepal journey — this will only take a moment.`, id: "msg-response" }];
            });
            setTimeout(() => onStart(name), 1800);
        }, 1300);
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--ivory)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", overflow: "hidden" }}>
            {/* Grain overlay */}
            <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, pointerEvents: "none", zIndex: 0 }} />

            {/* Decorative background orbs */}
            <div style={{ position: "fixed", top: "-10%", right: "-5%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,137,42,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", bottom: "-10%", left: "-5%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(155,35,53,0.06) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>

                {/* Header mark */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, animation: "slideUp .6s ease both" }}>
                    {/* Elephant avatar — large, breathing */}
                    <div style={{
                        width: 72, height: 72, borderRadius: 20,
                        background: "linear-gradient(135deg, var(--red) 0%, var(--gold) 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 36, boxShadow: "0 4px 24px rgba(155,35,53,0.25)",
                        animation: "breathe 3s ease-in-out infinite"
                    }}>                    <img
                            src={logo}
                            alt="Hati Logo"
                            className="w-full h-full object-contain rounded-lg"
                        /></div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 28, letterSpacing: 6, background: "linear-gradient(135deg,var(--brown),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HATI</div>
                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--muted)", marginTop: 2 }}>Nepal Travel Companion</div>
                    </div>
                    {/* Ornamental divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,transparent,var(--border))" }} />
                        <span style={{ color: "var(--gold)", fontSize: 12, opacity: 0.7 }}>❈</span>
                        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,var(--border),transparent)" }} />
                    </div>
                </div>

                {/* Chat window */}
                <div style={{
                    background: "white", borderRadius: 20, border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-lg)", overflow: "hidden",
                    animation: "slideUp .6s .1s ease both", opacity: 0, animationFillMode: "both"
                }}>
                    {/* Chat header bar */}
                    <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-soft)", background: "var(--ivory-subtle)", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "dotPulse 2s ease-in-out infinite" }} />
                        <span style={{ fontFamily: "Cinzel", fontSize: 9, letterSpacing: "2px", color: "var(--brown-mid)" }}>HATI IS ONLINE</span>
                        <span style={{ marginLeft: "auto", fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)", fontStyle: "italic" }}>🇳🇵 Nepal</span>
                    </div>

                    {/* Messages */}
                    <div style={{ padding: "20px 16px", minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                        {msgs.map((m) =>
                            m.typing
                                ? <Bubble key={m.id} from="hati" typing />
                                : <Bubble key={m.id} from={m.from} text={m.text} />
                        )}
                        <div ref={endRef} />
                    </div>

                    {/* Name input */}
                    {showInput && (
                        <div style={{ padding: "0 16px 16px", animation: "slideUp .3s ease both" }}>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input
                                    autoFocus
                                    value={nameInput}
                                    onChange={e => setNameInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                    placeholder="Your name…"
                                    style={{ flex: 1, borderRadius: 10, fontSize: "1rem", fontFamily: "'Crimson Pro',serif" }}
                                />
                                <button
                                    onClick={handleSubmit}
                                    disabled={!nameInput.trim()}
                                    style={{
                                        width: 48, height: 48, borderRadius: 10, flexShrink: 0,
                                        background: nameInput.trim() ? "linear-gradient(135deg,var(--red),var(--gold))" : "rgba(155,35,53,0.15)",
                                        color: "white", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
                                        border: "none", cursor: nameInput.trim() ? "pointer" : "not-allowed",
                                        boxShadow: nameInput.trim() ? "0 2px 12px rgba(155,35,53,0.3)" : "none",
                                        transition: "all .2s"
                                    }}>
                                    ➤
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer note */}
                <div style={{ textAlign: "center", fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--muted)", fontStyle: "italic", animation: "fadeIn 1s 2s ease both", opacity: 0, animationFillMode: "both" }}>
                    Powered by knapsack optimisation · 30+ curated activities · 8 regions
                </div>
            </div>
        </div>
    );
}

// ─── SETUP SCREEN ─────────────────────────────────────────────────────────────
function SetupScreen({ name, onDone }) {
    const [days, setDays] = useState(7);
    const [budget, setBudget] = useState(50000);
    const [travelStyle, setTravelStyle] = useState("");
    const [districts, setDistricts] = useState([]);

    return (
        <div style={{ minHeight: "100vh", background: "var(--ivory)" }}>
            <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, pointerEvents: "none", zIndex: 0 }} />

            {/* Sticky header */}
            <nav style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(249,243,232,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", padding: "0 2rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", height: 58, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20, animation: "float 4s ease-in-out infinite", display: "inline-block" }}>🐘</span>
                    <span style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 16, letterSpacing: 4, background: "linear-gradient(135deg,var(--brown),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HATI</span>
                    <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>Planning for {name}</span>
                </div>
            </nav>

            <div style={{ maxWidth: 920, margin: "0 auto", padding: "3rem 2rem", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>

                {/* Left: setup form */}
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <div>
                        <h2 style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "2rem", color: "var(--brown)", marginBottom: 6 }}>Shape your journey</h2>
                        <div style={{ width: 48, height: 3, borderRadius: 2, background: "linear-gradient(90deg,var(--gold),var(--gold-light))" }} />
                        <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 14, color: "var(--muted)", marginTop: 10 }}>I'll use your inputs to optimise the perfect itinerary, {name}.</p>
                    </div>

                    {/* Days */}
                    <div>
                        <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "1.15rem", color: "var(--brown)", marginBottom: 10 }}>How many days?</div>
                        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                            {[3, 5, 7, 10, 14, 21].map(d => (
                                <button key={d} onClick={() => setDays(d)} style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${days === d ? "var(--gold)" : "var(--border)"}`, background: days === d ? "var(--ivory-deep)" : "white", color: days === d ? "var(--gold)" : "var(--brown-mid)", fontFamily: "'Crimson Pro',serif", fontSize: 13, fontWeight: days === d ? 600 : 400, boxShadow: days === d ? "var(--shadow-sm)" : "none" }}>{d}d</button>
                            ))}
                        </div>
                    </div>

                    {/* Budget */}
                    <div>
                        <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "1.15rem", color: "var(--brown)", marginBottom: 4 }}>Total budget <span style={{ fontSize: 12, color: "var(--muted)" }}>(NPR, flights excl.)</span></div>
                        <input type="range" min={10000} max={500000} step={5000} value={budget} onChange={e => setBudget(+e.target.value)} style={{ marginBottom: 8 }} />
                        <div style={{ textAlign: "center", fontFamily: "Cinzel", fontSize: 22, color: "var(--gold)" }}>{fmt(budget)}</div>
                    </div>

                    {/* Style */}
                    <div>
                        <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "1.15rem", color: "var(--brown)", marginBottom: 10 }}>How do you travel?</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {[{ id: "explorer", icon: "🧗", label: "Explorer" }, { id: "cultural", icon: "🛕", label: "Cultural" }, { id: "foodie", icon: "🍜", label: "Foodie" }, { id: "luxury", icon: "✨", label: "Luxe" }, { id: "budget", icon: "🎒", label: "Budget" }, { id: "wellness", icon: "🧘", label: "Wellness" }].map(s => (
                                <button key={s.id} onClick={() => setTravelStyle(s.id)} style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${travelStyle === s.id ? "var(--gold)" : "var(--border)"}`, background: travelStyle === s.id ? "var(--ivory-deep)" : "white", color: travelStyle === s.id ? "var(--gold)" : "var(--ink)", fontFamily: "'Crimson Pro',serif", fontSize: 13, fontWeight: travelStyle === s.id ? 600 : 400, display: "flex", alignItems: "center", gap: 8, boxShadow: travelStyle === s.id ? "var(--shadow-sm)" : "none" }}>
                                    <span>{s.icon}</span>{s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: destinations */}
                <div>
                    <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "1.15rem", color: "var(--brown)", marginBottom: 4 }}>Pick your destinations</div>
                    <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>~{days > 0 && districts.length > 0 ? Math.max(1, Math.floor(days / districts.length)) : "–"} days each</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 20 }}>
                        {Object.entries(DISTRICTS_META).map(([key, meta]) => {
                            const sel = districts.includes(key);
                            return (
                                <div key={key} onClick={() => setDistricts(p => sel ? p.filter(x => x !== key) : [...p, key])} className="card-hover" style={{ borderRadius: 12, padding: "12px 14px", cursor: "pointer", background: sel ? "var(--ivory-deep)" : "white", border: `1.5px solid ${sel ? "var(--gold)" : "var(--border)"}`, position: "relative", transition: "all .2s", boxShadow: sel ? "var(--shadow-md)" : "var(--shadow-sm)" }}>
                                    {sel && <div style={{ position: "absolute", top: 8, right: 10, fontSize: 11, color: "var(--gold)" }}>✓</div>}
                                    <div style={{ fontSize: 20, marginBottom: 4 }}>{meta.emoji}</div>
                                    <div style={{ fontFamily: "Cinzel", fontSize: 10, color: sel ? "var(--gold)" : "var(--ink)", marginBottom: 2 }}>{meta.label}</div>
                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 9, color: "var(--muted)", fontStyle: "italic" }}>{meta.tagline}</div>
                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 8, color: "var(--muted)", marginTop: 4 }}>{meta.season}</div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary + CTA */}
                    {districts.length > 0 && (
                        <div style={{ marginBottom: 16, padding: "14px 16px", borderRadius: 12, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                            <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "2px", color: "var(--muted)", marginBottom: 10 }}>JOURNEY SUMMARY</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center", gap: 8 }}>
                                {[{ v: days, l: "days" }, { v: fmt(Math.floor(budget / Math.max(districts.length, 1))), l: "per stop" }, { v: districts.length, l: "stops" }].map(({ v, l }) => (
                                    <div key={l}><div style={{ fontFamily: "Cinzel", fontSize: 15, color: "var(--gold)" }}>{v}</div><div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 9, color: "var(--muted)" }}>{l}</div></div>
                                ))}
                            </div>
                        </div>
                    )}
                    <Btn disabled={districts.length === 0} onClick={() => onDone({ days, budget, districts, travelStyle })}>
                        {districts.length === 0 ? "SELECT AT LEAST ONE DESTINATION" : "LOCK & START JOURNEY ❈"}
                    </Btn>
                    <p style={{ textAlign: "center", fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)", marginTop: 8 }}>Destinations lock once the journey begins. Budget rolls between stops.</p>
                </div>
            </div>
        </div>
    );
}

// ─── PLANNER SCREEN ───────────────────────────────────────────────────────────
const QA = {
    "Best time to visit?": "October–November and March–April are peak season — crystal skies, perfect temperatures, rhododendrons in bloom. June–August is monsoon: lush and dramatic, but rain every afternoon.",
    "Is it safe solo?": "Nepal is genuinely one of the safest countries for solo travel. Locals are remarkably welcoming. Stay alert for pickpockets in busy Thamel-style areas, but violent crime against tourists is extremely rare.",
    "Local food to try?": "Must-try: dal bhat (always unlimited refills!), momos, sel-roti, juju dhau (Bhaktapur's king yoghurt), thukpa, and chiya (spiced milk tea).",
    "How to get around?": "Within cities: microbuses and taxis are cheap. Kathmandu–Pokhara: 25 min flight or 6-7hr scenic bus. For the mountains: tiny Twin Otter planes fly to Lukla and Jomsom — book early!",
    "What to pack?": "Layers are everything. Comfortable walking shoes (cobblestones everywhere). Light rain jacket, sunscreen, and lip balm. Modest clothes for temples — cover shoulders and knees.",
};

function ChatPane({ name, district }) {
    const meta = DISTRICTS_META[district] || {};
    const [msgs, setMsgs] = useState([{ from: "hati", text: `नमस्ते ${name} 🙏 How's ${meta.label || "Nepal"} treating you? Ask me anything!` }]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const endRef = useRef(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

    function send(text) {
        if (!text.trim()) return;
        setMsgs(p => [...p, { from: "user", text: text.trim() }]);
        setInput("");
        setTyping(true);
        setTimeout(() => {
            const lo = text.toLowerCase();
            let r = QA[text] || (lo.includes("hotel") ? `Head to the Hotels tab — I've curated options from backpacker to platinum for ${meta.label}.` : lo.includes("thank") ? `Always a pleasure, ${name}! 🙏 Nepal stays with you long after you leave.` : `Great question! My best tip: talk to the locals — every chai stall owner has a recommendation you won't find in any guidebook.`);
            setTyping(false);
            setMsgs(p => [...p, { from: "hati", text: r }]);
        }, 700 + Math.random() * 400);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "55vh" }}>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 6 }}>
                {msgs.map((m, i) => <Bubble key={i} from={m.from} text={m.text} />)}
                {typing && <Bubble from="hati" typing />}
                <div ref={endRef} />
            </div>
            <div style={{ margin: "8px 0" }}>
                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)", marginBottom: 6, letterSpacing: "0.1em", textTransform: "uppercase" }}>Quick questions:</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {Object.keys(QA).map(q => <button key={q} onClick={() => send(q)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--ivory-deep)", color: "var(--brown-mid)", fontFamily: "'Crimson Pro',serif", fontSize: 10 }}>{q}</button>)}
                </div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder={`Ask HATI about ${meta.label || "Nepal"}...`} />
                <button onClick={() => send(input)} style={{ width: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,var(--red),var(--gold))", color: "white", fontSize: 15, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "none", boxShadow: "var(--shadow-sm)" }}>➤</button>
            </div>
        </div>
    );
}

function PlannerScreen({ name, days, budget, districts, onReview }) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [completed, setCompleted] = useState([]);
    const [spentHistory, setSpentHistory] = useState([]);
    const [included, setIncluded] = useState({});
    const [customExpenses, setCustomExpenses] = useState({});
    const [customLabel, setCustomLabel] = useState("");
    const [customAmount, setCustomAmount] = useState("");
    const [tab, setTab] = useState("activities");

    const cur = districts[currentIdx];
    const curMeta = DISTRICTS_META[cur] || {};
    const dpd = Math.max(1, Math.floor(days / districts.length));
    const alreadySpent = spentHistory.reduce((s, h) => s + h.total, 0);
    const remainingBudget = Math.max(0, budget - alreadySpent);
    const bdPerD = Math.floor(remainingBudget / Math.max(1, districts.length - spentHistory.length));

    useEffect(() => {
        if (!cur) return;
        const pool = ACTIVITIES.filter(a => a.district === cur);
        const ks = knapsack(bdPerD, pool);
        setIncluded(p => p[cur] !== undefined ? p : { ...p, [cur]: new Set(ks.map(a => a.id)) });
    }, [cur, bdPerD]);

    const curIncluded = included[cur] || new Set();
    const allPool = cur ? [...ACTIVITIES.filter(a => a.district === cur), ...MISC] : [];
    const includedList = allPool.filter(a => curIncluded.has(a.id));
    const actTotal = includedList.reduce((s, a) => s + a.cost, 0);
    const customTotal = (customExpenses[cur] || []).reduce((s, e) => s + e.amount, 0);
    const distTotal = actTotal + customTotal;
    const overBudget = distTotal > bdPerD;
    const budgetPct = Math.min(100, distTotal / bdPerD * 100);

    function toggle(act) {
        setIncluded(p => { const s = new Set(p[cur] || []); s.has(act.id) ? s.delete(act.id) : s.add(act.id); return { ...p, [cur]: s }; });
    }

    function completeDistrict() {
        const hist = { district: cur, total: distTotal, allowance: bdPerD, actTotal, custom: customExpenses[cur] || [] };
        setCompleted(p => [...p, cur]);
        setSpentHistory(p => [...p, hist]);
        if (currentIdx < districts.length - 1) { setCurrentIdx(i => i + 1); setTab("activities"); }
        else onReview([...spentHistory, hist], completed.concat(cur));
    }

    return (
        <div style={{ minHeight: "100vh", background: "var(--ivory)" }}>
            <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, pointerEvents: "none", zIndex: 0 }} />

            <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(249,243,232,0.96)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)", padding: "10px 2rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 18, animation: "float 4s ease-in-out infinite", display: "inline-block" }}>🐘</span>
                        <span style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 14, letterSpacing: 3, background: "linear-gradient(135deg,var(--brown),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HATI</span>
                        <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--muted)", marginLeft: 4 }}>Journey of {name}</span>
                        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                            {districts.map((d, i) => <div key={d} title={DISTRICTS_META[d]?.label} style={{ width: i === currentIdx ? 18 : 7, height: 7, borderRadius: 4, background: i < currentIdx ? "#22863a" : i === currentIdx ? "var(--gold)" : "var(--border)", transition: "all .3s" }} />)}
                        </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)" }}>{curMeta.emoji} {curMeta.label} · {dpd}d · 🎭 {fmt(actTotal)}{customTotal > 0 ? ` · 🧾 ${fmt(customTotal)}` : ""}</span>
                        <span style={{ fontFamily: "Cinzel", fontSize: 10, color: overBudget ? "var(--red)" : "var(--gold)" }}>{fmt(distTotal)} / {fmt(bdPerD)}</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: "var(--ivory-subtle)" }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${budgetPct}%`, background: overBudget ? "linear-gradient(90deg,var(--red-soft),var(--red))" : "linear-gradient(90deg,var(--gold),var(--gold-light))", transition: "width .35s ease" }} />
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 2rem 4rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "2rem", position: "relative", zIndex: 1 }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: "16px 20px", borderRadius: 14, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                        <span style={{ fontSize: 32 }}>{curMeta.emoji}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 22, color: "var(--brown)" }}>{curMeta.label}</div>
                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>{curMeta.tagline} · {curMeta.region} · {curMeta.season}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "Cinzel", fontSize: 13, color: "var(--brown-mid)" }}>{dpd} days</div>
                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)" }}>{curMeta.temp}</div>
                        </div>
                    </div>

                    <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
                        {[{ key: "activities", label: "🎭 Planned" }, { key: "misc", label: "✦ Add-Ons" }, { key: "chat", label: "🐘 Chat" }].map(t => (
                            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "10px 18px", border: "none", borderBottom: `2px solid ${tab === t.key ? "var(--gold)" : "transparent"}`, background: "transparent", color: tab === t.key ? "var(--gold)" : "var(--muted)", fontFamily: "Cinzel", fontSize: 9, letterSpacing: "0.8px", textTransform: "uppercase", transition: "all .2s" }}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {tab === "activities" && (
                        <div>
                            {overBudget && <div style={{ padding: "10px 13px", borderRadius: 10, background: "rgba(155,35,53,0.05)", border: "1px solid rgba(155,35,53,0.2)", marginBottom: 12, fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--red)" }}>⚠ Over by {fmt(distTotal - bdPerD)}. Remove activities or add fewer extras.</div>}
                            {["morning", "afternoon", "evening"].map(slot => {
                                const sl = byTime(includedList).filter(a => a.timeSlot === slot && a.district === cur);
                                if (!sl.length) return null;
                                return (
                                    <div key={slot} style={{ marginBottom: 16 }}>
                                        <div style={{ fontFamily: "Cinzel", fontSize: 9, letterSpacing: "2px", color: "var(--muted)", marginBottom: 8 }}>{{ morning: "🌅 Morning", afternoon: "☀️ Afternoon", evening: "🌙 Evening" }[slot]}</div>
                                        {sl.map(a => <ActCard key={a.id} act={a} included={true} onToggle={toggle} canAfford={true} />)}
                                    </div>
                                );
                            })}
                            {(() => {
                                const ni = ACTIVITIES.filter(a => a.district === cur && !curIncluded.has(a.id));
                                return ni.length ? <div><div style={{ fontFamily: "Cinzel", fontSize: 9, letterSpacing: "2px", color: "var(--muted)", marginBottom: 8 }}>NOT INCLUDED</div>{ni.map(a => <ActCard key={a.id} act={a} included={false} onToggle={toggle} canAfford={actTotal + a.cost <= bdPerD} />)}</div> : null;
                            })()}

                            <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                                <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 15, color: "var(--brown)", marginBottom: 4 }}>Extra Purchases</div>
                                <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--muted)", marginBottom: 12, fontStyle: "italic" }}>Souvenirs, meals, rickshaws, tips…</p>
                                {(customExpenses[cur] || []).map((e, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderRadius: 8, background: "var(--ivory-subtle)", marginBottom: 5 }}>
                                        <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "var(--brown-mid)" }}>{e.label}</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            <span style={{ fontFamily: "Cinzel", fontSize: 11, color: "var(--gold)" }}>{fmt(e.amount)}</span>
                                            <button onClick={() => setCustomExpenses(p => ({ ...p, [cur]: (p[cur] || []).filter((_, j) => j !== i) }))} style={{ width: 22, height: 22, borderRadius: 6, border: "1px solid var(--border)", background: "white", color: "var(--muted)", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                                        </div>
                                    </div>
                                ))}
                                <div style={{ display: "flex", gap: 7, marginTop: 8 }}>
                                    <input value={customLabel} onChange={e => setCustomLabel(e.target.value)} onKeyDown={e => e.key === "Enter" && customLabel.trim() && +customAmount > 0 && (setCustomExpenses(p => ({ ...p, [cur]: [...(p[cur] || []), { label: customLabel.trim(), amount: +customAmount }] })), setCustomLabel(""), setCustomAmount(""))} placeholder="e.g. Souvenir, Tea…" style={{ flex: 1 }} />
                                    <input value={customAmount} onChange={e => setCustomAmount(e.target.value.replace(/[^0-9]/g, ""))} placeholder="NPR" style={{ width: 80, textAlign: "center" }} />
                                    <button onClick={() => { if (customLabel.trim() && +customAmount > 0) { setCustomExpenses(p => ({ ...p, [cur]: [...(p[cur] || []), { label: customLabel.trim(), amount: +customAmount }] })); setCustomLabel(""); setCustomAmount(""); } }} style={{ width: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,var(--red),var(--gold))", color: "white", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "none", boxShadow: "var(--shadow-sm)" }}>＋</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === "misc" && (
                        <div>
                            <div style={{ marginBottom: 12 }}><Bubble from="hati" text={`Flexible add-ons that slot into any free moment in ${curMeta.label}. Tap ＋ to include.`} /></div>
                            {MISC.map(a => <ActCard key={a.id} act={a} included={curIncluded.has(a.id)} onToggle={toggle} canAfford={true} />)}
                        </div>
                    )}

                    {tab === "chat" && <ChatPane name={name} district={cur} />}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ padding: "16px 18px", borderRadius: 14, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "2px", color: "var(--muted)", marginBottom: 12 }}>STOP BUDGET</div>
                        <div style={{ textAlign: "center", marginBottom: 12 }}>
                            <div style={{ fontFamily: "Cinzel", fontSize: 22, color: overBudget ? "var(--red)" : "var(--gold)" }}>{fmt(distTotal)}</div>
                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)" }}>of {fmt(bdPerD)} allocated</div>
                        </div>
                        <div style={{ height: 6, borderRadius: 3, background: "var(--ivory-subtle)", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 3, width: `${budgetPct}%`, background: overBudget ? "var(--red)" : "linear-gradient(90deg,var(--gold),var(--gold-light))", transition: "width .35s" }} />
                        </div>
                        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)" }}>
                            <span>🎭 {fmt(actTotal)}</span>
                            {customTotal > 0 && <span>🧾 {fmt(customTotal)}</span>}
                            <span style={{ color: overBudget ? "var(--red)" : "#22863a" }}>{overBudget ? `+${fmt(distTotal - bdPerD)}` : `-${fmt(bdPerD - distTotal)}`}</span>
                        </div>
                    </div>

                    <div style={{ padding: "16px 18px", borderRadius: 14, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "2px", color: "var(--muted)", marginBottom: 10 }}>YOUR JOURNEY</div>
                        {districts.map((d, i) => {
                            const m = DISTRICTS_META[d];
                            const done = i < currentIdx;
                            const active = i === currentIdx;
                            return (
                                <div key={d} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < districts.length - 1 ? "1px solid var(--border-soft)" : "none" }}>
                                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: done ? "#22863a" : active ? "var(--gold)" : "var(--ivory-subtle)", border: `1.5px solid ${done ? "#22863a" : active ? "var(--gold)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: done || active ? "white" : "var(--muted)", flexShrink: 0 }}>{done ? "✓" : i + 1}</div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--ink)" : done ? "var(--brown-soft)" : "var(--muted)" }}>{m.label}</div>
                                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 9, color: "var(--muted)" }}>{Math.max(1, Math.floor(days / districts.length))} days</div>
                                    </div>
                                    <span style={{ fontSize: 14 }}>{m.emoji}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ padding: "16px 18px", borderRadius: 14, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                        <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 15, color: "var(--brown)", marginBottom: 5 }}>Ready to move on?</div>
                        {currentIdx < districts.length - 1 && (
                            <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--ivory-subtle)", marginBottom: 12, fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--brown-mid)" }}>
                                {distTotal <= bdPerD
                                    ? <span style={{ color: "#22863a" }}>✓ {fmt(bdPerD - distTotal)} saved</span>
                                    : <span style={{ color: "var(--red)" }}>⚠ {fmt(distTotal - bdPerD)} over</span>}
                                <span style={{ color: "var(--muted)" }}> — rolls to next stop</span>
                            </div>
                        )}
                        <button onClick={completeDistrict} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "linear-gradient(135deg,#1a6b3a,#22c55e)", color: "white", fontFamily: "Cinzel", fontSize: 10, letterSpacing: "1.5px", border: "none", boxShadow: "0 2px 12px rgba(34,197,94,0.2)", cursor: "pointer" }}>
                            ✓ {currentIdx < districts.length - 1 ? "COMPLETE & NEXT STOP" : "COMPLETE MY JOURNEY"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── REVIEW SCREEN ────────────────────────────────────────────────────────────
function ReviewScreen({ name, budget, spentHistory, completed, onRestart }) {
    const grandTotal = spentHistory.reduce((s, h) => s + h.total, 0);
    const savings = budget - grandTotal;

    return (
        <div style={{ minHeight: "100vh", background: "var(--ivory)" }}>
            <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, pointerEvents: "none", zIndex: 0 }} />
            <div style={{ maxWidth: 860, margin: "0 auto", padding: "5rem 2rem", position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div style={{ fontSize: 64, marginBottom: 12 }}>🙏</div>
                    <h1 style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "2.5rem", letterSpacing: 4, background: "linear-gradient(135deg,var(--brown),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 8 }}>Journey Complete</h1>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 14 }}>
                        <div style={{ height: 1, width: 48, background: "linear-gradient(90deg,transparent,var(--gold))" }} />
                        <span style={{ color: "var(--gold)", fontSize: 12 }}>❈</span>
                        <div style={{ height: 1, width: 48, background: "linear-gradient(90deg,var(--gold),transparent)" }} />
                    </div>
                    <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 16, color: "var(--muted)", fontStyle: "italic" }}>Nepal will stay with you forever, {name}.</p>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                    <div style={{ padding: "22px 24px", borderRadius: 16, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "2px", color: "var(--muted)", marginBottom: 14 }}>TRIP SUMMARY</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center", gap: 12, marginBottom: 16 }}>
                            {[{ v: fmt(grandTotal), l: "spent" }, { v: fmt(Math.abs(savings)), l: savings >= 0 ? "saved" : "over" }, { v: completed.length, l: "stops" }].map(({ v, l }, i) => (
                                <div key={l}><div style={{ fontFamily: "Cinzel", fontSize: 17, color: i === 1 && savings < 0 ? "var(--red)" : "var(--gold)" }}>{v}</div><div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 9, color: "var(--muted)" }}>{l}</div></div>
                            ))}
                        </div>
                        <div style={{ height: 1, background: "var(--border-soft)", marginBottom: 12 }} />
                        {[{ l: "🎭 Activities", v: spentHistory.reduce((s, h) => s + h.actTotal, 0) }, { l: "🧾 Extras", v: spentHistory.reduce((s, h) => s + h.custom.reduce((ss, e) => ss + e.amount, 0), 0) }].map(({ l, v }) => (
                            <div key={l} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--brown-soft)", marginBottom: 5 }}>
                                <span>{l}</span><span style={{ fontFamily: "Cinzel", fontSize: 11, color: "var(--brown-mid)" }}>{fmt(v)}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: "22px 24px", borderRadius: 16, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)", display: "flex", flexDirection: "column", gap: 12 }}>
                        <Bubble from="hati" text={`What a journey, ${name}! 🏔️\n\nYou explored ${completed.length} destination${completed.length > 1 ? "s" : ""} across Nepal.\n\nTravel is the only thing you buy that makes you richer. Come back soon. 🙏`} />
                    </div>
                </div>

                <div style={{ padding: "22px 24px", borderRadius: 16, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)", marginBottom: "1.5rem" }}>
                    <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "2px", color: "var(--muted)", marginBottom: 14 }}>YOUR NEPAL STORY</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                        {completed.map((d, i) => {
                            const meta = DISTRICTS_META[d];
                            const h = spentHistory[i];
                            const diff = h ? h.total - h.allowance : 0;
                            return (
                                <div key={d} style={{ padding: "12px 14px", borderRadius: 10, background: "var(--ivory-deep)", border: "1px solid var(--border-soft)" }}>
                                    <div style={{ fontSize: 22, marginBottom: 5 }}>{meta.emoji}</div>
                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>{meta.label}</div>
                                    {h && (
                                        <>
                                            <div style={{ fontFamily: "Cinzel", fontSize: 11, color: "var(--gold)", marginBottom: 4 }}>{fmt(h.total)}</div>
                                            <div style={{ height: 3, borderRadius: 2, background: "var(--ivory-subtle)", overflow: "hidden", marginBottom: 4 }}>
                                                <div style={{ height: "100%", borderRadius: 2, width: `${Math.min(100, h.total / h.allowance * 100)}%`, background: diff > 0 ? "var(--red)" : "var(--gold)" }} />
                                            </div>
                                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 9, color: diff > 0 ? "var(--red)" : "#22863a" }}>{diff > 0 ? `+${fmt(diff)} over` : `${fmt(-diff)} saved`}</div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Btn ghost onClick={onRestart}>PLAN ANOTHER JOURNEY</Btn>
            </div>
        </div>
    );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
    const [screen, setScreen] = useState("intro");
    const [name, setName] = useState("");
    const [journeyConfig, setJourneyConfig] = useState(null);
    const [reviewData, setReviewData] = useState(null);

    const handleIntroStart = (n) => { setName(n); setScreen("setup"); };
    const handleSetupDone = (config) => { setJourneyConfig(config); setScreen("planner"); };
    const handleReview = (history, completed) => { setReviewData({ history, completed }); setScreen("review"); };
    const handleRestart = () => { setScreen("intro"); setName(""); setJourneyConfig(null); setReviewData(null); };

    if (screen === "intro") return <IntroChatScreen onStart={handleIntroStart} />;
    if (screen === "setup") return <SetupScreen name={name} onDone={handleSetupDone} />;
    if (screen === "planner" && journeyConfig) return (
        <PlannerScreen
            name={name}
            days={journeyConfig.days}
            budget={journeyConfig.budget}
            districts={journeyConfig.districts}
            onReview={handleReview}
        />
    );
    if (screen === "review" && reviewData) return (
        <ReviewScreen
            name={name}
            budget={journeyConfig?.budget || 0}
            spentHistory={reviewData.history}
            completed={reviewData.completed}
            onRestart={handleRestart}
        />
    );
    return null;
}