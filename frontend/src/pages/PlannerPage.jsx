import { useState, useEffect, useRef } from "react";

const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Sanskrit&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&display=swap";
document.head.appendChild(_fl);

const _st = document.createElement("style");
_st.textContent = `
  :root {
    --ivory:#F9F3E8;--ivory-deep:#F0E6D0;--ivory-subtle:#EDE0C8;
    --red:#9B2335;--red-soft:#C4445A;
    --gold:#B8892A;--gold-light:#D4A84B;
    --brown:#2A1608;--brown-mid:#6B3D1E;--brown-soft:#9C6840;
    --ink:#2A1608;--muted:rgba(61,32,16,0.45);
    --border:rgba(184,137,42,0.22);--border-soft:rgba(184,137,42,0.11);
    --shadow-sm:0 1px 4px rgba(61,32,16,0.07);
    --shadow-md:0 4px 20px rgba(61,32,16,0.10);
    --shadow-lg:0 8px 48px rgba(61,32,16,0.14);
    --green:#22863a;
    --blue:#1a6b9a;
    --purple:#6b3d9a;
  }
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
  @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(184,137,42,0.2)}50%{box-shadow:0 0 22px rgba(184,137,42,0.45)}}
  @keyframes dotPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.4);opacity:1}}
  @keyframes breathe{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(184,137,42,0.4)}50%{transform:scale(1.04);box-shadow:0 0 0 12px rgba(184,137,42,0)}}
  *{box-sizing:border-box;margin:0;padding:0}
  html{-webkit-font-smoothing:antialiased;scroll-behavior:smooth;}
  body{background:var(--ivory);color:var(--ink);font-family:'Crimson Pro',Georgia,serif;line-height:1.65;}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--ivory-subtle)}
  ::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
  input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;background:var(--border-soft);outline:none;width:100%}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,var(--gold),var(--red));cursor:pointer;border:2px solid #fff;box-shadow:var(--shadow-sm)}
  button{transition:all 0.18s ease;cursor:pointer;border:none}
  button:active{transform:scale(0.97)!important}
  .badge{display:inline-block;padding:0.2em 0.75em;border-radius:999px;font-size:0.75rem;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;background:var(--ivory-deep);color:var(--brown-mid);border:1px solid var(--border);}
  .card-hover:hover{transform:translateY(-2px);transition:all 0.2s ease;}
  input,textarea,select{width:100%;padding:0.65em 1em;border:1.5px solid var(--border);border-radius:8px;background:#fff;color:var(--ink);font-family:'Crimson Pro',serif;font-size:1rem;transition:border-color 180ms,box-shadow 180ms;outline:none;}
  input:focus,textarea:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(184,137,42,0.12);}
`;
document.head.appendChild(_st);

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.022'/%3E%3C/svg%3E")`;

const KEY = "hati-v3";
function persist(state) {
    try {
        const s = { ...state };
        if (s.included) s.included = Object.fromEntries(Object.entries(s.included).map(([k, v]) => [k, [...(v || [])]]));
        localStorage.setItem(KEY, JSON.stringify(s));
    } catch (_) { }
}
function hydrate() {
    try {
        const raw = localStorage.getItem(KEY); if (!raw) return null;
        const s = JSON.parse(raw);
        if (s.included) s.included = Object.fromEntries(Object.entries(s.included).map(([k, v]) => [k, new Set(v)]));
        return s;
    } catch (_) { return null; }
}
function wipe() { try { localStorage.removeItem(KEY); } catch (_) { } }

const fmt = n => `NPR ${Number(n).toLocaleString()}`;
const byTime = a => [...a].sort((x, y) => ({ morning: 0, afternoon: 1, evening: 2 }[x.timeSlot] || 1) - ({ morning: 0, afternoon: 1, evening: 2 }[y.timeSlot] || 1));

// ─── CONTACTS + RATE DATA ─────────────────────────────────────────────────────
const CONTACTS = {
    Kathmandu: {
        hotels: [
            { name: "Hotel Yak & Yeti", stars: 5, area: "Durbarmarg", phone: "+977-1-4248999", whatsapp: "+9779851049999", note: "Landmark luxury, garden pool", ratePerNight: 18000 },
            { name: "Hyatt Regency Kathmandu", stars: 5, area: "Boudha", phone: "+977-1-4491234", whatsapp: "+9779841234567", note: "Near Boudhanath Stupa", ratePerNight: 22000 },
            { name: "Hotel Shanker", stars: 4, area: "Lazimpat", phone: "+977-1-4410151", whatsapp: "+9779851087654", note: "Restored Rana palace, gorgeous garden", ratePerNight: 9500 },
            { name: "Kathmandu Guest House", stars: 3, area: "Thamel", phone: "+977-1-4700632", whatsapp: "+9779851023456", note: "Historic backpacker HQ, great location", ratePerNight: 3500 },
        ],
        guides: [
            { name: "Ramesh Shrestha", lang: "EN/DE/FR", phone: "+977-9841-123456", whatsapp: "+9779841123456", specialty: "UNESCO Heritage, Temple trails", rating: "★4.9", exp: "18 yrs", ratePerDay: 3500 },
            { name: "Sita Tamang", lang: "EN/CN/JA", phone: "+977-9851-234567", whatsapp: "+9779851234567", specialty: "Cultural immersion, Newari cuisine", rating: "★4.8", exp: "12 yrs", ratePerDay: 3000 },
            { name: "Bikash Gurung", lang: "EN/ES", phone: "+977-9841-345678", whatsapp: "+9779841345678", specialty: "Photography walks, Hidden courtyards", rating: "★4.7", exp: "9 yrs", ratePerDay: 2500 },
        ]
    },
    Lalitpur: {
        hotels: [
            { name: "Inn Patan", stars: 4, area: "Patan Durbar", phone: "+977-1-5522000", whatsapp: "+9779851056789", note: "Boutique, rooftop Durbar views", ratePerNight: 8000 },
            { name: "Summit Hotel", stars: 4, area: "Kopundol", phone: "+977-1-5521810", whatsapp: "+9779841567890", note: "Himalayan panoramas, gardens", ratePerNight: 7500 },
            { name: "Café de Patan Guesthouse", stars: 2, area: "Old Town", phone: "+977-1-5527994", whatsapp: "+9779841890123", note: "Budget gem inside heritage zone", ratePerNight: 2200 },
        ],
        guides: [
            { name: "Anita Maharjan", lang: "EN/IT", phone: "+977-9851-456789", whatsapp: "+9779851456789", specialty: "Newari art, Bronze casting, Durbar walks", rating: "★4.9", exp: "14 yrs", ratePerDay: 3200 },
            { name: "Roshan Sthapit", lang: "EN/FR", phone: "+977-9841-567890", whatsapp: "+9779841567890", specialty: "Artisan workshops, Museum deep dives", rating: "★4.8", exp: "11 yrs", ratePerDay: 2800 },
        ]
    },
    Bhaktapur: {
        hotels: [
            { name: "Shiva Guesthouse", stars: 3, area: "Durbar Square", phone: "+977-1-6612547", whatsapp: "+9779851012345", note: "Best square view in Bhaktapur", ratePerNight: 3800 },
            { name: "Pagoda Guest House", stars: 3, area: "Taumadhi Tole", phone: "+977-1-6613248", whatsapp: "+9779841098765", note: "Walking distance to Nyatapola", ratePerNight: 3200 },
            { name: "Bhadgaon Guest House", stars: 2, area: "Old Town", phone: "+977-1-6610488", whatsapp: "+9779851543210", note: "Authentic family-run, courtyard", ratePerNight: 2000 },
        ],
        guides: [
            { name: "Prakash Rajbhandari", lang: "EN/DE", phone: "+977-9841-678901", whatsapp: "+9779841678901", specialty: "Pottery, woodcarving, Jatras festivals", rating: "★4.9", exp: "20 yrs", ratePerDay: 3500 },
            { name: "Deepa Shrestha", lang: "EN/JA", phone: "+977-9851-789012", whatsapp: "+9779851789012", specialty: "Newari cuisine, temple iconography", rating: "★4.7", exp: "8 yrs", ratePerDay: 2500 },
        ]
    },
    Kaski: {
        hotels: [
            { name: "Temple Tree Resort", stars: 5, area: "Lakeside", phone: "+977-61-462970", whatsapp: "+9779851901234", note: "Award-winning, lake & mountain views", ratePerNight: 16000 },
            { name: "Fish Tail Lodge", stars: 5, area: "Phewa Lake", phone: "+977-61-465071", whatsapp: "+9779841234890", note: "Reached by rowboat — utterly romantic", ratePerNight: 20000 },
            { name: "Hotel Middle Path", stars: 3, area: "Lakeside-6", phone: "+977-61-461000", whatsapp: "+9779851345901", note: "Great value, 2 min from the lake", ratePerNight: 4000 },
            { name: "Butterfly Lodge", stars: 2, area: "Damside", phone: "+977-61-520144", whatsapp: "+9779841456012", note: "Budget favourite, garden seating", ratePerNight: 1800 },
        ],
        guides: [
            { name: "Karma Gurung", lang: "EN/ES/PT", phone: "+977-9856-111222", whatsapp: "+9779856111222", specialty: "Paragliding liaison, Sarangkot trekking", rating: "★5.0", exp: "15 yrs", ratePerDay: 4000 },
            { name: "Laxmi Thapa", lang: "EN/FR", phone: "+977-9846-333444", whatsapp: "+9779846333444", specialty: "Lake excursions, Begnas Valley day trips", rating: "★4.8", exp: "10 yrs", ratePerDay: 3200 },
            { name: "Dipak Pun", lang: "EN/ZH", phone: "+977-9856-555666", whatsapp: "+9779856555666", specialty: "Annapurna circuit logistics, gear advice", rating: "★4.9", exp: "17 yrs", ratePerDay: 3800 },
        ]
    },
    Chitwan: {
        hotels: [
            { name: "Meghauli Serai (Taj)", stars: 5, area: "Buffer Zone", phone: "+977-56-580030", whatsapp: "+9779851234001", note: "Luxury tented camp, rhinos at dusk", ratePerNight: 25000 },
            { name: "Barahi Jungle Lodge", stars: 4, area: "Sauraha", phone: "+977-56-580014", whatsapp: "+9779841234002", note: "Riverbank location, excellent safari", ratePerNight: 9000 },
            { name: "Parkside Tharu Lodge", stars: 2, area: "Sauraha Center", phone: "+977-56-580128", whatsapp: "+9779841234004", note: "Local family-run, Tharu meals", ratePerNight: 2500 },
        ],
        guides: [
            { name: "Bijay Tharu", lang: "EN/HI", phone: "+977-9845-112233", whatsapp: "+9779845112233", specialty: "Jungle jeep & walking safaris, birding", rating: "★4.9", exp: "16 yrs", ratePerDay: 3500 },
            { name: "Sunita Chaudhary", lang: "EN/ES", phone: "+977-9855-223344", whatsapp: "+9779855223344", specialty: "Tharu culture, canoe safaris, cooking", rating: "★4.7", exp: "9 yrs", ratePerDay: 2800 },
        ]
    },
    Solukhumbu: {
        hotels: [
            { name: "Everest Summit Lodge", stars: 4, area: "Namche Bazaar", phone: "+977-38-540087", whatsapp: "+9779851877001", note: "Best Ama Dablam views in Namche", ratePerNight: 5500 },
            { name: "Hotel Namche", stars: 3, area: "Namche Bazaar", phone: "+977-38-540045", whatsapp: "+9779841877002", note: "Central, good acclimatisation base", ratePerNight: 3200 },
            { name: "Tengboche Teahouse", stars: 1, area: "Tengboche 3867m", phone: "+977-9843-567890", whatsapp: "+9779843567890", note: "Simple, monastery next door", ratePerNight: 1200 },
        ],
        guides: [
            { name: "Dawa Sherpa", lang: "EN/ZH/JA", phone: "+977-9843-112233", whatsapp: "+9779843112233", specialty: "EBC & Gokyo treks, high-altitude safety", rating: "★5.0", exp: "22 yrs", ratePerDay: 5000 },
            { name: "Nima Sherpa", lang: "EN/DE", phone: "+977-9848-334455", whatsapp: "+9779848334455", specialty: "Island Peak, Lobuche climbing permits", rating: "★4.9", exp: "18 yrs", ratePerDay: 4500 },
            { name: "Pasang Kami", lang: "EN/FR/IT", phone: "+977-9843-556677", whatsapp: "+9779843556677", specialty: "Photography expeditions, monastery treks", rating: "★4.8", exp: "14 yrs", ratePerDay: 4000 },
        ]
    },
    Mustang: {
        hotels: [
            { name: "Mustang Holiday Inn", stars: 3, area: "Lo Manthang", phone: "+977-69-440000", whatsapp: "+9779851990011", note: "Best option inside the walled city", ratePerNight: 4500 },
            { name: "Hotel Bob Marley", stars: 2, area: "Jomsom", phone: "+977-69-440013", whatsapp: "+9779841990022", note: "Famous among trekkers, quirky & warm", ratePerNight: 2000 },
            { name: "Snow Land Hotel", stars: 2, area: "Kagbeni", phone: "+977-69-440025", whatsapp: "+9779851990033", note: "Gateway to Upper Mustang, cozy", ratePerNight: 1800 },
        ],
        guides: [
            { name: "Tenzin Bista", lang: "EN/TI", phone: "+977-9847-778899", whatsapp: "+9779847778899", specialty: "Upper Mustang permits, Lo-pa culture", rating: "★5.0", exp: "19 yrs", ratePerDay: 5500 },
            { name: "Sonam Gurung", lang: "EN/ZH", phone: "+977-9847-889900", whatsapp: "+9779847889900", specialty: "Cave archaeology, Mustang plateau trekking", rating: "★4.9", exp: "13 yrs", ratePerDay: 4800 },
        ]
    },
    Banke: {
        hotels: [
            { name: "Tiger Tops Bardia", stars: 4, area: "Buffer Zone", phone: "+977-1-4361500", whatsapp: "+9779851606060", note: "Eco-lodge, tiger sighting record", ratePerNight: 12000 },
            { name: "Jungle Base Camp Lodge", stars: 3, area: "Thakurdwara", phone: "+977-81-410500", whatsapp: "+9779851505050", note: "Main lodge for Bardia park access", ratePerNight: 5000 },
            { name: "Bardia Riverside Resort", stars: 3, area: "Thakurdwara", phone: "+977-81-411020", whatsapp: "+9779841707070", note: "Riverside tents, great food", ratePerNight: 4200 },
        ],
        guides: [
            { name: "Ram Bahadur Rana", lang: "EN/HI/NE", phone: "+977-9858-334455", whatsapp: "+9779858334455", specialty: "Tiger tracking, rhino & elephant safaris", rating: "★5.0", exp: "21 yrs", ratePerDay: 4000 },
            { name: "Ganga Chaudhary", lang: "EN/HI", phone: "+977-9858-445566", whatsapp: "+9779858445566", specialty: "Babai River rafting, Tharu village walks", rating: "★4.8", exp: "12 yrs", ratePerDay: 3200 },
        ]
    },
};

const EMERGENCY = [
    { label: "Nepal Police", num: "100" },
    { label: "Tourist Police", num: "1144" },
    { label: "Ambulance", num: "102" },
    { label: "CIWEC Clinic", num: "+977-1-4435232" },
];

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

const DM = {
    Kathmandu: { label: "Kathmandu", emoji: "🕌", tagline: "City of Temples", region: "Valley", season: "Oct–Apr", temp: "15–25°C" },
    Lalitpur: { label: "Patan", emoji: "🎭", tagline: "City of Fine Arts", region: "Valley", season: "Oct–Apr", temp: "15–25°C" },
    Bhaktapur: { label: "Bhaktapur", emoji: "⛩️", tagline: "City of Devotees", region: "Valley", season: "Oct–Apr", temp: "15–25°C" },
    Kaski: { label: "Pokhara", emoji: "⛵", tagline: "Gateway to the Himalayas", region: "Western", season: "Oct–Nov", temp: "18–28°C" },
    Chitwan: { label: "Chitwan", emoji: "🦏", tagline: "Jungle Kingdom", region: "Terai", season: "Nov–Mar", temp: "20–32°C" },
    Solukhumbu: { label: "Everest Region", emoji: "❄️", tagline: "Roof of the World", region: "Eastern", season: "Mar–May", temp: "-5–10°C" },
    Mustang: { label: "Mustang", emoji: "🌄", tagline: "The Forbidden Kingdom", region: "Northern", season: "Mar–Nov", temp: "5–20°C" },
    Banke: { label: "Bardia", emoji: "🐯", tagline: "Wild West Nepal", region: "Terai", season: "Oct–Mar", temp: "18–30°C" },
};

function knapsack(budget, items) {
    if (!items.length || budget <= 0) return [];
    const S = 50, W = Math.floor(budget / S), n = items.length;
    const dp = new Array(W + 1).fill(0);
    const keep = Array.from({ length: n }, () => new Uint8Array(W + 1));
    for (let i = 0; i < n; i++) {
        const wi = Math.max(1, Math.floor(items[i].cost / S)), vi = items[i].rating;
        for (let w = W; w >= wi; w--) if (dp[w - wi] + vi > dp[w]) { dp[w] = dp[w - wi] + vi; keep[i][w] = 1; }
    }
    const sel = []; let w = W;
    for (let i = n - 1; i >= 0; i--) if (keep[i][w]) { sel.push(items[i]); w -= Math.max(1, Math.floor(items[i].cost / S)); }
    return sel;
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Bubble({ text, from = "hati", typing = false }) {
    const isH = from === "hati";
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, marginBottom: 10, flexDirection: isH ? "row" : "row-reverse", animation: "slideUp .25s ease both" }}>
            {isH && <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg,var(--red),var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>🐘</div>}
            <div style={{ maxWidth: "84%", padding: "10px 14px", borderRadius: isH ? "4px 12px 12px 12px" : "12px 4px 12px 12px", background: isH ? "white" : "var(--ivory-deep)", border: "1px solid var(--border)", fontFamily: "'Crimson Pro',serif", fontSize: 13.5, lineHeight: 1.7, color: "var(--brown-mid)", whiteSpace: "pre-wrap", boxShadow: "var(--shadow-sm)" }}>
                {typing ? <span style={{ animation: "pulse 1s infinite", letterSpacing: 4, color: "var(--gold)" }}>● ● ●</span> : text}
            </div>
        </div>
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
                    <span style={{ fontSize: 10, fontWeight: 600, color: act.cost === 0 ? "var(--green)" : "var(--gold)" }}>{act.cost === 0 ? "Free" : fmt(act.cost)}</span>
                    {act.dur && <span style={{ fontSize: 10, color: "var(--muted)" }}>~{act.dur}h</span>}
                    <span style={{ fontSize: 10, color: "var(--brown-soft)" }}>★{act.rating}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--brown-soft)", borderLeft: "2px solid var(--border)", paddingLeft: 8, fontStyle: "italic" }}>💡 {act.tip}</div>
                {!included && !canAfford && <div style={{ fontSize: 10, color: "var(--red)", marginTop: 4 }}>⚠ Exceeds budget</div>}
            </div>
            <button onClick={() => onToggle(act)} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, border: `1.5px solid ${included ? "var(--gold)" : "var(--border)"}`, background: included ? "var(--ivory-deep)" : "white", color: included ? "var(--gold)" : "var(--muted)", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", animation: included ? "glow 2s ease-in-out infinite" : "none" }}>
                {included ? "✓" : "＋"}
            </button>
        </div>
    );
}

// ─── CONTACTS + FINANCE PANEL ─────────────────────────────────────────────────
function ContactsFinancePanel({ district, dpd, stayExpenses, setStayExpenses, guideExpenses, setGuideExpenses }) {
    const C = CONTACTS[district];
    const [view, setView] = useState("hotel");
    if (!C) return null;

    const curStay = stayExpenses[district] || { hotelName: "", nights: dpd, ratePerNight: 0, totalCost: 0, locked: false };
    const curGuide = guideExpenses[district] || { guideName: "", days: dpd, ratePerDay: 0, totalCost: 0, locked: false };

    const saveStay = patch => {
        const n = { ...curStay, ...patch };
        n.totalCost = n.nights * n.ratePerNight;
        setStayExpenses(p => ({ ...p, [district]: n }));
    };
    const saveGuide = patch => {
        const n = { ...curGuide, ...patch };
        n.totalCost = n.days * n.ratePerDay;
        setGuideExpenses(p => ({ ...p, [district]: n }));
    };

    const CTABS = [{ k: "hotel", l: "🏨 Hotels" }, { k: "guide", l: "🧭 Guides" }, { k: "sos", l: "🆘 SOS" }];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "slideUp .25s ease both" }}>

            {/* ── Live cost summary cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[
                    { label: "🏨 ACCOMMODATION", val: curStay.totalCost, sub: curStay.hotelName ? `${curStay.nights} nights × ${fmt(curStay.ratePerNight)}` : "Not selected", color: "var(--blue)", bg: "rgba(26,107,154,0.07)", border: "rgba(26,107,154,0.25)", locked: curStay.locked },
                    { label: "🧭 GUIDE FEE", val: curGuide.totalCost, sub: curGuide.guideName ? `${curGuide.days} days × ${fmt(curGuide.ratePerDay)}` : "Not selected", color: "var(--purple)", bg: "rgba(107,61,154,0.07)", border: "rgba(107,61,154,0.25)", locked: curGuide.locked },
                ].map(row => (
                    <div key={row.label} style={{ padding: "12px 13px", borderRadius: 10, background: row.val > 0 ? row.bg : "var(--ivory-subtle)", border: `1px solid ${row.val > 0 ? row.border : "var(--border-soft)"}`, position: "relative" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "1.5px", color: row.color, marginBottom: 5 }}>{row.label}</div>
                        <div style={{ fontFamily: "Cinzel", fontSize: row.val > 0 ? 18 : 13, color: row.val > 0 ? row.color : "var(--muted)" }}>{row.val > 0 ? fmt(row.val) : "—"}</div>
                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)", marginTop: 2, fontStyle: "italic" }}>{row.sub}</div>
                        {row.locked && <div style={{ position: "absolute", top: 8, right: 8, fontSize: 11 }}>🔒</div>}
                    </div>
                ))}
            </div>

            {/* ── Tab nav ── */}
            <div style={{ display: "flex", gap: 6 }}>
                {CTABS.map(t => (
                    <button key={t.k} onClick={() => setView(t.k)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${view === t.k ? "var(--gold)" : "var(--border)"}`, background: view === t.k ? "var(--ivory-deep)" : "white", color: view === t.k ? "var(--gold)" : "var(--brown-mid)", fontFamily: "Cinzel", fontSize: 9, letterSpacing: "0.5px" }}>
                        {t.l}
                    </button>
                ))}
            </div>

            {/* ── HOTEL TAB ── */}
            {view === "hotel" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {C.hotels.map((h, i) => {
                        const sel = curStay.hotelName === h.name;
                        return (
                            <div key={i} style={{ borderRadius: 10, padding: "12px 13px", background: sel ? "rgba(26,107,154,0.06)" : "white", border: `1.5px solid ${sel ? "rgba(26,107,154,0.4)" : "var(--border)"}`, boxShadow: "var(--shadow-sm)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                                    <div>
                                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{h.name}</div>
                                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)" }}>{"★".repeat(h.stars)}{"☆".repeat(5 - h.stars)} · {h.area}</div>
                                    </div>
                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                        <div style={{ fontFamily: "Cinzel", fontSize: 13, color: "var(--blue)" }}>{fmt(h.ratePerNight)}</div>
                                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 9, color: "var(--muted)" }}>/ night</div>
                                    </div>
                                </div>
                                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--brown-soft)", fontStyle: "italic", borderLeft: "2px solid var(--border)", paddingLeft: 8, marginBottom: 10 }}>{h.note}</div>
                                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--brown-mid)", marginBottom: 8 }}>📞 <a href={`tel:${h.phone}`} style={{ color: "var(--brown-mid)", textDecoration: "none", fontWeight: 600 }}>{h.phone}</a></div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <button onClick={() => { if (!curStay.locked) saveStay({ hotelName: h.name, ratePerNight: h.ratePerNight, nights: dpd, totalCost: dpd * h.ratePerNight, locked: false }); }}
                                        style={{ flex: 2, padding: "7px", borderRadius: 7, border: `1.5px solid ${sel ? "rgba(26,107,154,0.6)" : "var(--border)"}`, background: sel ? "rgba(26,107,154,0.1)" : "var(--ivory-deep)", color: sel ? "var(--blue)" : "var(--brown-mid)", fontFamily: "Cinzel", fontSize: 9 }}>
                                        {sel ? "✓ TRACKING COST" : "SELECT & TRACK"}
                                    </button>
                                    <a href={`tel:${h.phone}`} style={{ textDecoration: "none", flex: 1 }}><button style={{ width: "100%", padding: "7px", borderRadius: 7, border: "1.5px solid var(--green)", background: "white", color: "var(--green)", fontFamily: "Cinzel", fontSize: 9 }}>📞 Call</button></a>
                                    <a href={`https://wa.me/${h.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flex: 1 }}><button style={{ width: "100%", padding: "7px", borderRadius: 7, border: "1.5px solid #25D366", background: "white", color: "#128C7E", fontFamily: "Cinzel", fontSize: 9 }}>💬 WA</button></a>
                                </div>
                            </div>
                        );
                    })}

                    {curStay.hotelName && (
                        <div style={{ padding: "14px", borderRadius: 10, background: "rgba(26,107,154,0.05)", border: "1px solid rgba(26,107,154,0.2)" }}>
                            <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "1.5px", color: "var(--blue)", marginBottom: 12 }}>✏️ ADJUST ACCOMMODATION COST</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                                <div>
                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Nights</div>
                                    <input type="number" min={1} value={curStay.nights} disabled={curStay.locked} onChange={e => saveStay({ nights: Math.max(1, +e.target.value) })} style={{ textAlign: "center", fontFamily: "Cinzel", fontSize: 14, color: "var(--blue)" }} />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Rate / night (NPR)</div>
                                    <input type="number" min={0} value={curStay.ratePerNight} disabled={curStay.locked} onChange={e => saveStay({ ratePerNight: Math.max(0, +e.target.value) })} style={{ textAlign: "center", fontFamily: "Cinzel", fontSize: 14, color: "var(--blue)" }} />
                                </div>
                            </div>
                            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(26,107,154,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "var(--brown-mid)" }}>Total accommodation</span>
                                <span style={{ fontFamily: "Cinzel", fontSize: 17, color: "var(--blue)" }}>{fmt(curStay.totalCost)}</span>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {!curStay.locked
                                    ? <button onClick={() => saveStay({ locked: true })} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: "var(--blue)", color: "white", fontFamily: "Cinzel", fontSize: 9, letterSpacing: "1px" }}>🔒 LOCK COST</button>
                                    : <button onClick={() => saveStay({ locked: false })} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid var(--blue)", background: "white", color: "var(--blue)", fontFamily: "Cinzel", fontSize: 9, letterSpacing: "1px" }}>✏️ EDIT</button>
                                }
                                <button onClick={() => setStayExpenses(p => ({ ...p, [district]: null }))} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid var(--border)", background: "white", color: "var(--muted)", fontFamily: "Cinzel", fontSize: 9 }}>Clear</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── GUIDE TAB ── */}
            {view === "guide" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {C.guides.map((g, i) => {
                        const sel = curGuide.guideName === g.name;
                        return (
                            <div key={i} style={{ borderRadius: 10, padding: "12px 13px", background: sel ? "rgba(107,61,154,0.06)" : "white", border: `1.5px solid ${sel ? "rgba(107,61,154,0.4)" : "var(--border)"}`, boxShadow: "var(--shadow-sm)" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                                    <div>
                                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{g.name}</div>
                                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)" }}>{g.rating} · {g.exp} · {g.lang}</div>
                                    </div>
                                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                                        <div style={{ fontFamily: "Cinzel", fontSize: 13, color: "var(--purple)" }}>{fmt(g.ratePerDay)}</div>
                                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 9, color: "var(--muted)" }}>/ day</div>
                                    </div>
                                </div>
                                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--brown-soft)", fontStyle: "italic", borderLeft: "2px solid var(--border)", paddingLeft: 8, marginBottom: 10 }}>🧭 {g.specialty}</div>
                                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--brown-mid)", marginBottom: 8 }}>📞 <a href={`tel:${g.phone}`} style={{ color: "var(--brown-mid)", textDecoration: "none", fontWeight: 600 }}>{g.phone}</a></div>
                                <div style={{ display: "flex", gap: 6 }}>
                                    <button onClick={() => { if (!curGuide.locked) saveGuide({ guideName: g.name, ratePerDay: g.ratePerDay, days: dpd, totalCost: dpd * g.ratePerDay, locked: false }); }}
                                        style={{ flex: 2, padding: "7px", borderRadius: 7, border: `1.5px solid ${sel ? "rgba(107,61,154,0.6)" : "var(--border)"}`, background: sel ? "rgba(107,61,154,0.1)" : "var(--ivory-deep)", color: sel ? "var(--purple)" : "var(--brown-mid)", fontFamily: "Cinzel", fontSize: 9 }}>
                                        {sel ? "✓ TRACKING COST" : "SELECT & TRACK"}
                                    </button>
                                    <a href={`tel:${g.phone}`} style={{ textDecoration: "none", flex: 1 }}><button style={{ width: "100%", padding: "7px", borderRadius: 7, border: "1.5px solid var(--green)", background: "white", color: "var(--green)", fontFamily: "Cinzel", fontSize: 9 }}>📞 Call</button></a>
                                    <a href={`https://wa.me/${g.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", flex: 1 }}><button style={{ width: "100%", padding: "7px", borderRadius: 7, border: "1.5px solid #25D366", background: "white", color: "#128C7E", fontFamily: "Cinzel", fontSize: 9 }}>💬 WA</button></a>
                                </div>
                            </div>
                        );
                    })}

                    {curGuide.guideName && (
                        <div style={{ padding: "14px", borderRadius: 10, background: "rgba(107,61,154,0.05)", border: "1px solid rgba(107,61,154,0.2)" }}>
                            <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "1.5px", color: "var(--purple)", marginBottom: 12 }}>✏️ ADJUST GUIDE COST</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                                <div>
                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Days hired</div>
                                    <input type="number" min={1} value={curGuide.days} disabled={curGuide.locked} onChange={e => saveGuide({ days: Math.max(1, +e.target.value) })} style={{ textAlign: "center", fontFamily: "Cinzel", fontSize: 14, color: "var(--purple)" }} />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Rate / day (NPR)</div>
                                    <input type="number" min={0} value={curGuide.ratePerDay} disabled={curGuide.locked} onChange={e => saveGuide({ ratePerDay: Math.max(0, +e.target.value) })} style={{ textAlign: "center", fontFamily: "Cinzel", fontSize: 14, color: "var(--purple)" }} />
                                </div>
                            </div>
                            <div style={{ padding: "10px 14px", borderRadius: 8, background: "rgba(107,61,154,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                                <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "var(--brown-mid)" }}>Total guide fee</span>
                                <span style={{ fontFamily: "Cinzel", fontSize: 17, color: "var(--purple)" }}>{fmt(curGuide.totalCost)}</span>
                            </div>
                            <div style={{ display: "flex", gap: 8 }}>
                                {!curGuide.locked
                                    ? <button onClick={() => saveGuide({ locked: true })} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: "var(--purple)", color: "white", fontFamily: "Cinzel", fontSize: 9, letterSpacing: "1px" }}>🔒 LOCK COST</button>
                                    : <button onClick={() => saveGuide({ locked: false })} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1.5px solid var(--purple)", background: "white", color: "var(--purple)", fontFamily: "Cinzel", fontSize: 9, letterSpacing: "1px" }}>✏️ EDIT</button>
                                }
                                <button onClick={() => setGuideExpenses(p => ({ ...p, [district]: null }))} style={{ padding: "8px 14px", borderRadius: 8, border: "1.5px solid var(--border)", background: "white", color: "var(--muted)", fontFamily: "Cinzel", fontSize: 9 }}>Clear</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── SOS TAB ── */}
            {view === "sos" && (
                <div style={{ padding: "14px 16px", borderRadius: 10, background: "rgba(155,35,53,0.04)", border: "1px solid rgba(155,35,53,0.18)" }}>
                    <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "1.5px", color: "var(--red)", marginBottom: 12 }}>EMERGENCY CONTACTS · NEPAL</div>
                    {EMERGENCY.map(e => (
                        <a key={e.label} href={`tel:${e.num}`} style={{ textDecoration: "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-soft)" }}>
                                <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 13, color: "var(--brown-mid)" }}>{e.label}</span>
                                <span style={{ fontFamily: "Cinzel", fontSize: 13, color: "var(--red)", fontWeight: 600 }}>{e.num} 📞</span>
                            </div>
                        </a>
                    ))}
                    <div style={{ marginTop: 10, fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--muted)", fontStyle: "italic" }}>Tap any number to call. Tourist Police (1144) speaks English.</div>
                </div>
            )}
        </div>
    );
}

// ─── INTRO ────────────────────────────────────────────────────────────────────
function IntroChatScreen({ onStart }) {
    const [msgs, setMsgs] = useState([]);
    const [nameInput, setNameInput] = useState("");
    const [showInput, setShowInput] = useState(false);
    const endRef = useRef(null);
    const seq = [
        { text: "नमस्ते 🙏", delay: 400 },
        { text: "I'm HATI — your AI companion for navigating Nepal.\n\nFrom Kathmandu's incense-thick temple courtyards to the frozen silence of Everest Base Camp, I'll craft a journey that fits your soul and your budget.", delay: 1200 },
        { text: "I use a knapsack optimisation algorithm to squeeze maximum experience out of every rupee. No fluff. Just the real Nepal. 🏔️", delay: 2800 },
        { text: "Before we begin...\n\nWhat should I call you?", delay: 4600 },
    ];
    useEffect(() => {
        const timers = [];
        seq.forEach((msg, i) => {
            timers.push(setTimeout(() => setMsgs(p => [...p.filter(m => !m.typing), { typing: true, from: "hati", id: `t${i}` }]), msg.delay - 600));
            timers.push(setTimeout(() => {
                setMsgs(p => [...p.filter(m => !m.typing), { from: "hati", text: msg.text, id: `m${i}` }]);
                if (i === seq.length - 1) setTimeout(() => setShowInput(true), 300);
            }, msg.delay));
        });
        return () => timers.forEach(clearTimeout);
    }, []);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, showInput]);
    function submit() {
        const n = nameInput.trim(); if (!n) return;
        setShowInput(false);
        setMsgs(p => [...p, { from: "user", text: n, id: "un" }]);
        setTimeout(() => setMsgs(p => [...p, { from: "hati", typing: true, id: "tr" }]), 300);
        setTimeout(() => {
            setMsgs(p => [...p.filter(m => !m.typing), { from: "hati", text: `What a wonderful name. Welcome, ${n}. 🙏\n\nLet's shape your Nepal journey.`, id: "mr" }]);
            setTimeout(() => onStart(n), 1600);
        }, 1200);
    }
    return (
        <div style={{ minHeight: "100vh", background: "var(--ivory)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, pointerEvents: "none" }} />
            <div style={{ position: "fixed", top: "-10%", right: "-5%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle,rgba(184,137,42,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "fixed", bottom: "-10%", left: "-5%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle,rgba(155,35,53,0.06) 0%,transparent 70%)", pointerEvents: "none" }} />
            <div style={{ width: "100%", maxWidth: 520, position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, animation: "slideUp .6s ease both" }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: "linear-gradient(135deg,var(--red),var(--gold))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, boxShadow: "0 4px 24px rgba(155,35,53,0.25)", animation: "breathe 3s ease-in-out infinite" }}>🐘</div>
                    <div style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 28, letterSpacing: 6, background: "linear-gradient(135deg,var(--brown),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HATI</div>
                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--muted)", marginTop: 2 }}>Nepal Travel Companion</div>
                    </div>
                </div>
                <div style={{ background: "white", borderRadius: 20, border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)", overflow: "hidden", animation: "slideUp .6s .1s ease both", opacity: 0, animationFillMode: "both" }}>
                    <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border-soft)", background: "var(--ivory-subtle)", display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", animation: "dotPulse 2s ease-in-out infinite" }} />
                        <span style={{ fontFamily: "Cinzel", fontSize: 9, letterSpacing: "2px", color: "var(--brown-mid)" }}>HATI IS ONLINE</span>
                        <span style={{ marginLeft: "auto", fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)", fontStyle: "italic" }}>🇳🇵 Nepal</span>
                    </div>
                    <div style={{ padding: "20px 16px", minHeight: 260, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                        {msgs.map(m => m.typing ? <Bubble key={m.id} from="hati" typing /> : <Bubble key={m.id} from={m.from} text={m.text} />)}
                        <div ref={endRef} />
                    </div>
                    {showInput && (
                        <div style={{ padding: "0 16px 16px", animation: "slideUp .3s ease both" }}>
                            <div style={{ display: "flex", gap: 8 }}>
                                <input autoFocus value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Your name…" style={{ flex: 1, borderRadius: 10 }} />
                                <button onClick={submit} disabled={!nameInput.trim()} style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0, background: nameInput.trim() ? "linear-gradient(135deg,var(--red),var(--gold))" : "rgba(155,35,53,0.15)", color: "white", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: nameInput.trim() ? "pointer" : "not-allowed" }}>➤</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── SETUP ────────────────────────────────────────────────────────────────────
function SetupScreen({ name, onDone }) {
    const [days, setDays] = useState(7);
    const [budget, setBudget] = useState(50000);
    const [travelStyle, setTravelStyle] = useState("");
    const [districts, setDistricts] = useState([]);
    return (
        <div style={{ minHeight: "100vh", background: "var(--ivory)" }}>
            <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, pointerEvents: "none", zIndex: 0 }} />
            <nav style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(249,243,232,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid var(--border)", padding: "0 2rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", height: 58, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 20, animation: "float 4s ease-in-out infinite", display: "inline-block" }}>🐘</span>
                    <span style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 16, letterSpacing: 4, background: "linear-gradient(135deg,var(--brown),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HATI</span>
                    <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>Planning for {name}</span>
                </div>
            </nav>
            <div style={{ maxWidth: 920, margin: "0 auto", padding: "3rem 2rem", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                    <div>
                        <h2 style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "2rem", color: "var(--brown)", marginBottom: 6 }}>Shape your journey</h2>
                        <div style={{ width: 48, height: 3, borderRadius: 2, background: "linear-gradient(90deg,var(--gold),var(--gold-light))" }} />
                        <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 14, color: "var(--muted)", marginTop: 10 }}>I'll optimise the perfect itinerary for you, {name}.</p>
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "1.15rem", color: "var(--brown)", marginBottom: 10 }}>How many days?</div>
                        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                            {[3, 5, 7, 10, 14, 21].map(d => (
                                <button key={d} onClick={() => setDays(d)} style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${days === d ? "var(--gold)" : "var(--border)"}`, background: days === d ? "var(--ivory-deep)" : "white", color: days === d ? "var(--gold)" : "var(--brown-mid)", fontFamily: "'Crimson Pro',serif", fontSize: 13, fontWeight: days === d ? 600 : 400 }}>{d}d</button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "1.15rem", color: "var(--brown)", marginBottom: 4 }}>Total budget <span style={{ fontSize: 12, color: "var(--muted)" }}>(NPR, flights excl.)</span></div>
                        <input type="range" min={10000} max={500000} step={5000} value={budget} onChange={e => setBudget(+e.target.value)} style={{ marginBottom: 8 }} />
                        <div style={{ textAlign: "center", fontFamily: "Cinzel", fontSize: 22, color: "var(--gold)" }}>{fmt(budget)}</div>
                    </div>
                    <div>
                        <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "1.15rem", color: "var(--brown)", marginBottom: 10 }}>How do you travel?</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                            {[{ id: "explorer", icon: "🧗", label: "Explorer" }, { id: "cultural", icon: "🛕", label: "Cultural" }, { id: "foodie", icon: "🍜", label: "Foodie" }, { id: "luxury", icon: "✨", label: "Luxe" }, { id: "budget", icon: "🎒", label: "Budget" }, { id: "wellness", icon: "🧘", label: "Wellness" }].map(s => (
                                <button key={s.id} onClick={() => setTravelStyle(s.id)} style={{ padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${travelStyle === s.id ? "var(--gold)" : "var(--border)"}`, background: travelStyle === s.id ? "var(--ivory-deep)" : "white", color: travelStyle === s.id ? "var(--gold)" : "var(--ink)", fontFamily: "'Crimson Pro',serif", fontSize: 13, fontWeight: travelStyle === s.id ? 600 : 400, display: "flex", alignItems: "center", gap: 8 }}>
                                    <span>{s.icon}</span>{s.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "1.15rem", color: "var(--brown)", marginBottom: 4 }}>Pick your destinations</div>
                    <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>~{days > 0 && districts.length > 0 ? Math.max(1, Math.floor(days / districts.length)) : "–"} days each</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 20 }}>
                        {Object.entries(DM).map(([key, meta]) => {
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
                    <button disabled={districts.length === 0} onClick={() => onDone({ days, budget, districts, travelStyle })}
                        style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: districts.length === 0 ? "rgba(155,35,53,0.15)" : "var(--red)", color: districts.length === 0 ? "var(--muted)" : "white", fontFamily: "Cinzel", fontSize: 12, letterSpacing: "1.5px", cursor: districts.length === 0 ? "not-allowed" : "pointer", boxShadow: districts.length > 0 ? "0 2px 14px rgba(155,35,53,0.28)" : "none" }}>
                        {districts.length === 0 ? "SELECT AT LEAST ONE DESTINATION" : "LOCK & START JOURNEY ❈"}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── CHAT ─────────────────────────────────────────────────────────────────────
const QA = { "Best time to visit?": "October–November and March–April are peak season — crystal skies, perfect temperatures, rhododendrons in bloom. June–August is monsoon: lush but rainy every afternoon.", "Is it safe solo?": "Nepal is genuinely one of the safest countries for solo travel. Locals are remarkably welcoming. Violent crime against tourists is extremely rare.", "Local food to try?": "Must-try: dal bhat (always unlimited refills!), momos, sel-roti, juju dhau (Bhaktapur's king yoghurt), thukpa, and chiya (spiced milk tea).", "How to get around?": "Within cities: microbuses and taxis are cheap. Kathmandu–Pokhara: 25 min flight or 6-7hr scenic bus. For the mountains: tiny Twin Otter planes fly to Lukla — book early!", "What to pack?": "Layers are everything. Comfortable walking shoes (cobblestones everywhere). Light rain jacket, sunscreen, lip balm. Modest clothes for temples." };
function ChatPane({ name, district }) {
    const meta = DM[district] || {};
    const [msgs, setMsgs] = useState([{ from: "hati", text: `नमस्ते ${name} 🙏 How's ${meta.label || "Nepal"} treating you? Ask me anything!` }]);
    const [input, setInput] = useState(""); const [typing, setTyping] = useState(false); const endRef = useRef(null);
    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);
    function send(text) { if (!text.trim()) return; setMsgs(p => [...p, { from: "user", text: text.trim() }]); setInput(""); setTyping(true); setTimeout(() => { const r = QA[text] || (text.toLowerCase().includes("thank") ? `Always a pleasure, ${name}! 🙏` : `Talk to the locals — every chai stall owner has a recommendation you won't find in any guidebook.`); setTyping(false); setMsgs(p => [...p, { from: "hati", text: r }]); }, 700 + Math.random() * 400); }
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "55vh" }}>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: 6 }}>{msgs.map((m, i) => <Bubble key={i} from={m.from} text={m.text} />)}{typing && <Bubble from="hati" typing />}<div ref={endRef} /></div>
            <div style={{ margin: "8px 0" }}><div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Quick questions:</div><div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{Object.keys(QA).map(q => <button key={q} onClick={() => send(q)} style={{ padding: "5px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--ivory-deep)", color: "var(--brown-mid)", fontFamily: "'Crimson Pro',serif", fontSize: 10 }}>{q}</button>)}</div></div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} placeholder={`Ask HATI about ${meta.label || "Nepal"}...`} /><button onClick={() => send(input)} style={{ width: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,var(--red),var(--gold))", color: "white", fontSize: 15, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "none" }}>➤</button></div>
        </div>
    );
}

// ─── PLANNER ─────────────────────────────────────────────────────────────────
function PlannerScreen({ name, days, budget, districts, currentIdx, setCurrentIdx, completed, setCompleted, spentHistory, setSpentHistory, included, setIncluded, customExpenses, setCustomExpenses, stayExpenses, setStayExpenses, guideExpenses, setGuideExpenses, onReview, justResumed }) {
    const [customLabel, setCustomLabel] = useState("");
    const [customAmount, setCustomAmount] = useState("");
    const [tab, setTab] = useState("activities");
    const [showToast, setShowToast] = useState(justResumed);
    useEffect(() => { if (showToast) { const t = setTimeout(() => setShowToast(false), 3200); return () => clearTimeout(t); } }, []);

    const cur = districts[currentIdx];
    const curMeta = DM[cur] || {};
    const dpd = Math.max(1, Math.floor(days / districts.length));
    const alreadySpent = spentHistory.reduce((s, h) => s + h.total, 0);
    const bdPerD = Math.floor(Math.max(0, budget - alreadySpent) / Math.max(1, districts.length - spentHistory.length));

    useEffect(() => { if (!cur) return; const pool = ACTIVITIES.filter(a => a.district === cur); const ks = knapsack(bdPerD, pool); setIncluded(p => p[cur] !== undefined ? p : { ...p, [cur]: new Set(ks.map(a => a.id)) }); }, [cur, bdPerD]);

    const curIncluded = included[cur] || new Set();
    const allPool = cur ? [...ACTIVITIES.filter(a => a.district === cur), ...MISC] : [];
    const includedList = allPool.filter(a => curIncluded.has(a.id));
    const actTotal = includedList.reduce((s, a) => s + a.cost, 0);
    const customTotal = (customExpenses[cur] || []).reduce((s, e) => s + e.amount, 0);
    const stayTotal = stayExpenses[cur]?.totalCost || 0;
    const guideCostTotal = guideExpenses[cur]?.totalCost || 0;
    const distTotal = actTotal + customTotal + stayTotal + guideCostTotal;
    const overBudget = distTotal > bdPerD;

    // Stacked bar segments
    const segs = [
        { val: actTotal, color: "var(--gold)", label: "Activities" },
        { val: stayTotal, color: "var(--blue)", label: "Hotel" },
        { val: guideCostTotal, color: "var(--purple)", label: "Guide" },
        { val: customTotal, color: "var(--brown-soft)", label: "Other" },
    ];
    const pct = v => Math.min(100, bdPerD > 0 ? (v / bdPerD) * 100 : 0);

    function toggle(act) { setIncluded(p => { const s = new Set(p[cur] || []); s.has(act.id) ? s.delete(act.id) : s.add(act.id); return { ...p, [cur]: s }; }); }

    function completeDistrict() {
        const hist = { district: cur, total: distTotal, allowance: bdPerD, actTotal, stayTotal, guideCostTotal, customTotal, hotelName: stayExpenses[cur]?.hotelName || "", guideName: guideExpenses[cur]?.guideName || "" };
        const nc = [...completed, cur], nh = [...spentHistory, hist];
        setCompleted(nc); setSpentHistory(nh);
        if (currentIdx < districts.length - 1) { setCurrentIdx(i => i + 1); setTab("activities"); }
        else onReview(nh, nc);
    }

    const TABS = [{ key: "activities", label: "🎭 Planned" }, { key: "misc", label: "✦ Add-Ons" }, { key: "contacts", label: "🏨 Stay & Guide" }, { key: "chat", label: "🐘 Chat" }];

    return (
        <div style={{ minHeight: "100vh", background: "var(--ivory)" }}>
            <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, pointerEvents: "none", zIndex: 0 }} />
            {showToast && <div style={{ position: "fixed", top: 70, left: "50%", transform: "translateX(-50%)", zIndex: 50, padding: "10px 22px", borderRadius: 10, background: "linear-gradient(135deg,var(--red),var(--gold))", color: "white", fontFamily: "Cinzel", fontSize: 10, letterSpacing: "1.5px", boxShadow: "var(--shadow-md)", whiteSpace: "nowrap" }}>↩ Resumed — {curMeta.label}</div>}

            {/* NAV */}
            <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(249,243,232,0.96)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border)", padding: "10px 2rem", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 18, animation: "float 4s ease-in-out infinite", display: "inline-block" }}>🐘</span>
                        <span style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 14, letterSpacing: 3, background: "linear-gradient(135deg,var(--brown),var(--gold))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HATI</span>
                        <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--muted)", marginLeft: 4 }}>Journey of {name}</span>
                        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>{districts.map((d, i) => <div key={d} title={DM[d]?.label} style={{ width: i === currentIdx ? 18 : 7, height: 7, borderRadius: 4, background: i < currentIdx ? "#22863a" : i === currentIdx ? "var(--gold)" : "var(--border)", transition: "all .3s" }} />)}</div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                            {segs.map(s => s.val > 0 && <span key={s.label} style={{ fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: s.color, display: "inline-block" }} />{s.label} {fmt(s.val)}</span>)}
                        </div>
                        <span style={{ fontFamily: "Cinzel", fontSize: 10, color: overBudget ? "var(--red)" : "var(--gold)", flexShrink: 0, marginLeft: 12 }}>{fmt(distTotal)} / {fmt(bdPerD)}</span>
                    </div>
                    {/* Stacked progress bar */}
                    <div style={{ height: 5, borderRadius: 3, background: "var(--ivory-subtle)", overflow: "hidden", display: "flex" }}>
                        {segs.map((s, i) => s.val > 0 && <div key={i} style={{ height: "100%", width: `${pct(s.val)}%`, background: s.color, transition: "width .35s" }} />)}
                        {overBudget && <div style={{ height: "100%", width: "5%", background: "var(--red)", opacity: 0.5 }} />}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "1.5rem 2rem 4rem", display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", position: "relative", zIndex: 1 }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20, padding: "16px 20px", borderRadius: 14, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                        <span style={{ fontSize: 32 }}>{curMeta.emoji}</span>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 22, color: "var(--brown)" }}>{curMeta.label}</div>
                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>{curMeta.tagline} · {curMeta.region} · {curMeta.season}</div>
                        </div>
                        <div style={{ textAlign: "right" }}><div style={{ fontFamily: "Cinzel", fontSize: 13, color: "var(--brown-mid)" }}>{dpd} days</div><div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)" }}>{curMeta.temp}</div></div>
                    </div>
                    <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
                        {TABS.map(t => <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "10px 16px", border: "none", borderBottom: `2px solid ${tab === t.key ? "var(--gold)" : "transparent"}`, background: "transparent", color: tab === t.key ? "var(--gold)" : "var(--muted)", fontFamily: "Cinzel", fontSize: 9, letterSpacing: "0.8px", textTransform: "uppercase" }}>{t.label}</button>)}
                    </div>

                    {tab === "activities" && (
                        <div>
                            {overBudget && <div style={{ padding: "10px 13px", borderRadius: 10, background: "rgba(155,35,53,0.05)", border: "1px solid rgba(155,35,53,0.2)", marginBottom: 12, fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--red)" }}>⚠ Over budget by {fmt(distTotal - bdPerD)}.</div>}
                            {["morning", "afternoon", "evening"].map(slot => { const sl = byTime(includedList).filter(a => a.timeSlot === slot && a.district === cur); if (!sl.length) return null; return (<div key={slot} style={{ marginBottom: 16 }}><div style={{ fontFamily: "Cinzel", fontSize: 9, letterSpacing: "2px", color: "var(--muted)", marginBottom: 8 }}>{{ morning: "🌅 Morning", afternoon: "☀️ Afternoon", evening: "🌙 Evening" }[slot]}</div>{sl.map(a => <ActCard key={a.id} act={a} included={true} onToggle={toggle} canAfford={true} />)}</div>); })}
                            {(() => { const ni = ACTIVITIES.filter(a => a.district === cur && !curIncluded.has(a.id)); return ni.length ? <div><div style={{ fontFamily: "Cinzel", fontSize: 9, letterSpacing: "2px", color: "var(--muted)", marginBottom: 8 }}>NOT INCLUDED</div>{ni.map(a => <ActCard key={a.id} act={a} included={false} onToggle={toggle} canAfford={actTotal + a.cost <= bdPerD} />)}</div> : null; })()}
                            <div style={{ marginTop: 20, padding: 16, borderRadius: 12, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                                <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 15, color: "var(--brown)", marginBottom: 4 }}>Other Expenses</div>
                                <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: "var(--muted)", marginBottom: 12, fontStyle: "italic" }}>Souvenirs, meals, rickshaws, tips…</p>
                                {(customExpenses[cur] || []).map((e, i) => (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderRadius: 8, background: "var(--ivory-subtle)", marginBottom: 5 }}>
                                        <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, color: "var(--brown-mid)" }}>{e.label}</span>
                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><span style={{ fontFamily: "Cinzel", fontSize: 11, color: "var(--gold)" }}>{fmt(e.amount)}</span><button onClick={() => setCustomExpenses(p => ({ ...p, [cur]: (p[cur] || []).filter((_, j) => j !== i) }))} style={{ width: 22, height: 22, borderRadius: 6, border: "1px solid var(--border)", background: "white", color: "var(--muted)", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button></div>
                                    </div>
                                ))}
                                <div style={{ display: "flex", gap: 7, marginTop: 8 }}>
                                    <input value={customLabel} onChange={e => setCustomLabel(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && customLabel.trim() && +customAmount > 0) { setCustomExpenses(p => ({ ...p, [cur]: [...(p[cur] || []), { label: customLabel.trim(), amount: +customAmount }] })); setCustomLabel(""); setCustomAmount(""); } }} placeholder="e.g. Souvenir…" style={{ flex: 1 }} />
                                    <input value={customAmount} onChange={e => setCustomAmount(e.target.value.replace(/[^0-9]/g, ""))} placeholder="NPR" style={{ width: 80, textAlign: "center" }} />
                                    <button onClick={() => { if (customLabel.trim() && +customAmount > 0) { setCustomExpenses(p => ({ ...p, [cur]: [...(p[cur] || []), { label: customLabel.trim(), amount: +customAmount }] })); setCustomLabel(""); setCustomAmount(""); } }} style={{ width: 40, height: 40, borderRadius: 8, background: "linear-gradient(135deg,var(--red),var(--gold))", color: "white", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", border: "none" }}>＋</button>
                                </div>
                            </div>
                        </div>
                    )}
                    {tab === "misc" && (<div><div style={{ marginBottom: 12 }}><Bubble from="hati" text={`Flexible add-ons for ${curMeta.label}. Tap ＋ to include.`} /></div>{MISC.map(a => <ActCard key={a.id} act={a} included={curIncluded.has(a.id)} onToggle={toggle} canAfford={true} />)}</div>)}
                    {tab === "contacts" && <ContactsFinancePanel district={cur} dpd={dpd} stayExpenses={stayExpenses} setStayExpenses={setStayExpenses} guideExpenses={guideExpenses} setGuideExpenses={setGuideExpenses} />}
                    {tab === "chat" && <ChatPane name={name} district={cur} />}
                </div>

                {/* SIDEBAR */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Budget breakdown */}
                    <div style={{ padding: "16px 18px", borderRadius: 14, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "2px", color: "var(--muted)", marginBottom: 12 }}>BUDGET BREAKDOWN</div>
                        <div style={{ textAlign: "center", marginBottom: 10 }}>
                            <div style={{ fontFamily: "Cinzel", fontSize: 22, color: overBudget ? "var(--red)" : "var(--gold)" }}>{fmt(distTotal)}</div>
                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--muted)" }}>of {fmt(bdPerD)} allocated</div>
                        </div>
                        <div style={{ height: 7, borderRadius: 3, background: "var(--ivory-subtle)", overflow: "hidden", display: "flex", marginBottom: 12 }}>
                            {segs.map((s, i) => s.val > 0 && <div key={i} style={{ height: "100%", width: `${pct(s.val)}%`, background: s.color, transition: "width .35s" }} />)}
                        </div>
                        {[
                            { icon: "🎭", label: "Activities", val: actTotal, color: "var(--gold)" },
                            { icon: "🏨", label: "Hotel", val: stayTotal, color: "var(--blue)", sub: stayExpenses[cur]?.hotelName },
                            { icon: "🧭", label: "Guide", val: guideCostTotal, color: "var(--purple)", sub: guideExpenses[cur]?.guideName },
                            { icon: "🧾", label: "Other", val: customTotal, color: "var(--brown-soft)" },
                        ].map(row => (
                            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px", borderRadius: 7, background: row.val > 0 ? "var(--ivory-subtle)" : "transparent", marginBottom: 4 }}>
                                <div><span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, color: row.val > 0 ? row.color : "var(--muted)" }}>{row.icon} {row.label}</span>{row.sub && <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 9, color: "var(--muted)", marginTop: 1 }}>{row.sub}</div>}</div>
                                <span style={{ fontFamily: "Cinzel", fontSize: 11, color: row.val > 0 ? row.color : "var(--muted)" }}>{row.val > 0 ? fmt(row.val) : "—"}</span>
                            </div>
                        ))}
                        <div style={{ borderTop: "1px solid var(--border)", marginTop: 6, paddingTop: 6, display: "flex", justifyContent: "space-between" }}>
                            <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: 11, fontWeight: 600, color: "var(--ink)" }}>Remaining</span>
                            <span style={{ fontFamily: "Cinzel", fontSize: 12, color: overBudget ? "var(--red)" : "var(--green)" }}>{overBudget ? `-${fmt(distTotal - bdPerD)}` : `+${fmt(bdPerD - distTotal)}`}</span>
                        </div>
                    </div>

                    {/* Journey stops */}
                    <div style={{ padding: "16px 18px", borderRadius: 14, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "2px", color: "var(--muted)", marginBottom: 10 }}>YOUR JOURNEY</div>
                        {districts.map((d, i) => {
                            const m = DM[d]; const done = i < currentIdx; const active = i === currentIdx; return (<div key={d} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderBottom: i < districts.length - 1 ? "1px solid var(--border-soft)" : "none" }}>
                                <div style={{ width: 24, height: 24, borderRadius: "50%", background: done ? "#22863a" : active ? "var(--gold)" : "var(--ivory-subtle)", border: `1.5px solid ${done ? "#22863a" : active ? "var(--gold)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: done || active ? "white" : "var(--muted)", flexShrink: 0 }}>{done ? "✓" : i + 1}</div>
                                <div style={{ flex: 1 }}><div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "var(--ink)" : done ? "var(--brown-soft)" : "var(--muted)" }}>{m.label}</div><div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 9, color: "var(--muted)" }}>{dpd} days</div></div>
                                <span style={{ fontSize: 14 }}>{m.emoji}</span>
                            </div>);
                        })}
                    </div>

                    {/* Complete */}
                    <div style={{ padding: "16px 18px", borderRadius: 14, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                        <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: 15, color: "var(--brown)", marginBottom: 8 }}>Ready to move on?</div>
                        {currentIdx < districts.length - 1 && <div style={{ padding: "8px 10px", borderRadius: 8, background: "var(--ivory-subtle)", marginBottom: 12, fontFamily: "'Crimson Pro',serif", fontSize: 10, color: "var(--brown-mid)" }}>{distTotal <= bdPerD ? <span style={{ color: "var(--green)" }}>✓ {fmt(bdPerD - distTotal)} saved</span> : <span style={{ color: "var(--red)" }}>⚠ {fmt(distTotal - bdPerD)} over</span>}<span style={{ color: "var(--muted)" }}> — rolls to next stop</span></div>}
                        <button onClick={completeDistrict} style={{ width: "100%", padding: "12px", borderRadius: 10, background: "linear-gradient(135deg,#1a6b3a,#22c55e)", color: "white", fontFamily: "Cinzel", fontSize: 10, letterSpacing: "1.5px", border: "none", boxShadow: "0 2px 12px rgba(34,197,94,0.2)", cursor: "pointer" }}>
                            ✓ {currentIdx < districts.length - 1 ? "COMPLETE & NEXT STOP" : "COMPLETE MY JOURNEY"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── REVIEW ───────────────────────────────────────────────────────────────────
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
                    <p style={{ fontFamily: "'Crimson Pro',serif", fontSize: 16, color: "var(--muted)", fontStyle: "italic" }}>Nepal will stay with you forever, {name}.</p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                    <div style={{ padding: "22px 24px", borderRadius: 16, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-lg)" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "2px", color: "var(--muted)", marginBottom: 14 }}>TRIP SUMMARY</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center", gap: 12 }}>
                            {[{ v: fmt(grandTotal), l: "total spent" }, { v: fmt(Math.abs(savings)), l: savings >= 0 ? "saved" : "over" }, { v: completed.length, l: "stops" }].map(({ v, l }, i) => (
                                <div key={l}><div style={{ fontFamily: "Cinzel", fontSize: 15, color: i === 1 && savings < 0 ? "var(--red)" : "var(--gold)" }}>{v}</div><div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 9, color: "var(--muted)" }}>{l}</div></div>
                            ))}
                        </div>
                    </div>
                    <div style={{ padding: "22px 24px", borderRadius: 16, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)" }}>
                        <Bubble from="hati" text={`What a journey, ${name}! 🏔️\n\nYou explored ${completed.length} destination${completed.length > 1 ? "s" : ""} across Nepal.\n\nCome back soon. 🙏`} />
                    </div>
                </div>
                <div style={{ padding: "22px 24px", borderRadius: 16, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-md)", marginBottom: "1.5rem" }}>
                    <div style={{ fontFamily: "Cinzel", fontSize: 8, letterSpacing: "2px", color: "var(--muted)", marginBottom: 14 }}>YOUR NEPAL STORY</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
                        {completed.map((d, i) => {
                            const meta = DM[d]; const h = spentHistory[i]; const diff = h ? h.total - h.allowance : 0;
                            const hsegs = [{ v: h?.actTotal || 0, c: "var(--gold)" }, { v: h?.stayTotal || 0, c: "var(--blue)" }, { v: h?.guideCostTotal || 0, c: "var(--purple)" }, { v: h?.customTotal || 0, c: "var(--brown-soft)" }];
                            return (<div key={d} style={{ padding: "14px", borderRadius: 10, background: "var(--ivory-deep)", border: "1px solid var(--border-soft)" }}>
                                <div style={{ fontSize: 22, marginBottom: 5 }}>{meta.emoji}</div>
                                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: 13, fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>{meta.label}</div>
                                {h && (<>
                                    <div style={{ height: 5, borderRadius: 3, background: "var(--ivory-subtle)", overflow: "hidden", display: "flex", marginBottom: 6 }}>
                                        {hsegs.map((s, si) => s.v > 0 && <div key={si} style={{ height: "100%", width: `${Math.min(100, (s.v / h.allowance) * 100)}%`, background: s.c }} />)}
                                    </div>
                                    {[{ icon: "🎭", label: "Activities", val: h.actTotal || 0, color: "var(--gold)" }, { icon: "🏨", label: h.hotelName || "Hotel", val: h.stayTotal || 0, color: "var(--blue)" }, { icon: "🧭", label: h.guideName || "Guide", val: h.guideCostTotal || 0, color: "var(--purple)" }, { icon: "🧾", label: "Other", val: h.customTotal || 0, color: "var(--brown-soft)" }].filter(r => r.val > 0).map(r => (
                                        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Crimson Pro',serif", fontSize: 10, marginBottom: 3 }}>
                                            <span style={{ color: "var(--muted)" }}>{r.icon} {r.label}</span><span style={{ color: r.color, fontWeight: 600 }}>{fmt(r.val)}</span>
                                        </div>
                                    ))}
                                    <div style={{ borderTop: "1px solid var(--border-soft)", marginTop: 5, paddingTop: 5, display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ fontFamily: "Cinzel", fontSize: 10, color: "var(--ink)" }}>TOTAL</span>
                                        <span style={{ fontFamily: "Cinzel", fontSize: 11, color: diff > 0 ? "var(--red)" : "var(--green)" }}>{fmt(h.total)} {diff > 0 ? "↑" : "✓"}</span>
                                    </div>
                                </>)}
                            </div>);
                        })}
                    </div>
                </div>
                <button onClick={onRestart} style={{ width: "100%", padding: "14px", borderRadius: 10, border: "1.5px solid var(--red)", background: "transparent", color: "var(--red)", fontFamily: "Cinzel", fontSize: 12, letterSpacing: "1.5px", cursor: "pointer" }}>PLAN ANOTHER JOURNEY</button>
            </div>
        </div>
    );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
    const saved = hydrate();
    const [screen, setScreen] = useState(saved?.screen || "intro");
    const [name, setName] = useState(saved?.name || "");
    const [journeyConfig, setJourneyConfig] = useState(saved?.journeyConfig || null);
    const [reviewData, setReviewData] = useState(saved?.reviewData || null);
    const [justResumed, setJustResumed] = useState(!!saved && saved.screen !== "intro");
    const [currentIdx, setCurrentIdx] = useState(saved?.currentIdx ?? 0);
    const [completed, setCompleted] = useState(saved?.completed ?? []);
    const [spentHistory, setSpentHistory] = useState(saved?.spentHistory ?? []);
    const [included, setIncluded] = useState(saved?.included ?? {});
    const [customExpenses, setCustomExpenses] = useState(saved?.customExpenses ?? {});
    const [stayExpenses, setStayExpenses] = useState(saved?.stayExpenses ?? {});
    const [guideExpenses, setGuideExpenses] = useState(saved?.guideExpenses ?? {});

    useEffect(() => {
        if (screen === "intro") { wipe(); return; }
        persist({ screen, name, journeyConfig, reviewData, currentIdx, completed, spentHistory, included, customExpenses, stayExpenses, guideExpenses });
    }, [screen, name, journeyConfig, reviewData, currentIdx, completed, spentHistory, included, customExpenses, stayExpenses, guideExpenses]);
    useEffect(() => { if (justResumed) setTimeout(() => setJustResumed(false), 4000); }, []);

    function startJourney(n) { setName(n); setScreen("setup"); }
    function lockJourney(config) { setJourneyConfig(config); setCurrentIdx(0); setCompleted([]); setSpentHistory([]); setIncluded({}); setCustomExpenses({}); setStayExpenses({}); setGuideExpenses({}); setScreen("planner"); }
    function finishJourney(hist, comp) { setReviewData({ history: hist, completed: comp }); setScreen("review"); }
    function restart() { wipe(); setScreen("intro"); setName(""); setJourneyConfig(null); setReviewData(null); setCurrentIdx(0); setCompleted([]); setSpentHistory([]); setIncluded({}); setCustomExpenses({}); setStayExpenses({}); setGuideExpenses({}); }

    if (screen === "intro") return <IntroChatScreen onStart={startJourney} />;
    if (screen === "setup") return <SetupScreen name={name} onDone={lockJourney} />;
    if (screen === "planner" && journeyConfig) return (
        <PlannerScreen
            name={name} days={journeyConfig.days} budget={journeyConfig.budget} districts={journeyConfig.districts}
            currentIdx={currentIdx} setCurrentIdx={setCurrentIdx}
            completed={completed} setCompleted={setCompleted}
            spentHistory={spentHistory} setSpentHistory={setSpentHistory}
            included={included} setIncluded={setIncluded}
            customExpenses={customExpenses} setCustomExpenses={setCustomExpenses}
            stayExpenses={stayExpenses} setStayExpenses={setStayExpenses}
            guideExpenses={guideExpenses} setGuideExpenses={setGuideExpenses}
            onReview={finishJourney} justResumed={justResumed}
        />
    );
    if (screen === "review" && reviewData) return (
        <ReviewScreen name={name} budget={journeyConfig?.budget || 0} spentHistory={reviewData.history} completed={reviewData.completed} onRestart={restart} />
    );
    return null;
}