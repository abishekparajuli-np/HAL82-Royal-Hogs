import { useState, useEffect, useRef, useCallback } from "react";

// ─── FONTS & STYLES ───────────────────────────────────────────────────────────
const _fl = document.createElement("link");
_fl.rel = "stylesheet";
_fl.href = "https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Sanskrit&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;600&display=swap";
document.head.appendChild(_fl);

const _st = document.createElement("style");
_st.textContent = `
  @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes slideIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:translateX(0)}}
  @keyframes pulse{0%,100%{opacity:.35}50%{opacity:.9}}
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes ripple{0%{transform:scale(0);opacity:0.6}100%{transform:scale(2.5);opacity:0}}
  @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(200,151,43,0.2)}50%{box-shadow:0 0 22px rgba(200,151,43,0.5)}}
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-track{background:transparent}
  ::-webkit-scrollbar-thumb{background:rgba(200,151,43,0.3);border-radius:3px}
  input[type=range]{-webkit-appearance:none;appearance:none;height:4px;border-radius:2px;background:rgba(245,236,215,0.1);outline:none;width:100%}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,#C8972B,#8B1A1A);cursor:pointer;border:2px solid #1A0A00;box-shadow:0 0 10px rgba(200,151,43,0.4)}
  textarea:focus,input:focus{outline:none}
  button{transition:all 0.18s ease;cursor:pointer;border:none}
  button:active{transform:scale(0.95)!important}
  .card-hover:hover{transform:translateY(-2px);transition:transform 0.2s ease}
`;
document.head.appendChild(_st);

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E")`;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ACTIVITIES = [
    { id: "k1", name: "Boudhanath Stupa Kora", cost: 500, rating: 93, cat: "Culture", district: "Kathmandu", timeSlot: "evening", tip: "Go at dusk — butter lamps lit, pilgrims spinning prayer wheels.", dur: 2 },
    { id: "k2", name: "Pashupatinath Aarti Ceremony", cost: 1000, rating: 94, cat: "Culture", district: "Kathmandu", timeSlot: "evening", tip: "Arrive by 5 PM for a front-row spot on the eastern bank.", dur: 2 },
    { id: "k3", name: "Swayambhunath Sunset Walk", cost: 300, rating: 89, cat: "Sightseeing", district: "Kathmandu", timeSlot: "afternoon", tip: "365 steps worth every breath. Watch pockets near the monkeys.", dur: 2 },
    { id: "k4", name: "Asan Tole Street Food Crawl", cost: 600, rating: 88, cat: "Food", district: "Kathmandu", timeSlot: "morning", tip: "Try samay baji and jeri-swari. Budget NPR 200–300 per stop.", dur: 2 },
    { id: "k5", name: "Thamel Live Music Night", cost: 1500, rating: 79, cat: "Nightlife", district: "Kathmandu", timeSlot: "evening", tip: "Purple Haze has free live classic rock from 7 PM.", dur: 3 },
    { id: "k6", name: "Garden of Dreams", cost: 400, rating: 82, cat: "Leisure", district: "Kathmandu", timeSlot: "afternoon", tip: "A hidden Edwardian gem two minutes from Thamel.", dur: 2 },
    { id: "k7", name: "National Museum", cost: 150, rating: 77, cat: "Culture", district: "Kathmandu", timeSlot: "morning", tip: "The Natural History wing has exhibits from the Rana era.", dur: 2 },
    { id: "k8", name: "Kirtipur Old Town Walk", cost: 200, rating: 84, cat: "Sightseeing", district: "Kathmandu", timeSlot: "morning", tip: "Virtually tourist-free. Locals sell fresh sesame snacks.", dur: 2 },
    { id: "k9", name: "Kopan Monastery Meditation", cost: 0, rating: 86, cat: "Wellness", district: "Kathmandu", timeSlot: "morning", tip: "Drop-in morning meditation at 8 AM is free.", dur: 2 },
    { id: "k10", name: "Dharahara Tower", cost: 200, rating: 78, cat: "Sightseeing", district: "Kathmandu", timeSlot: "afternoon", tip: "Best 360° city panorama. Rebuilt after 2015.", dur: 1 },
    { id: "l1", name: "Patan Durbar Square", cost: 1000, rating: 95, cat: "Culture", district: "Lalitpur", timeSlot: "morning", tip: "Best light 7–9 AM. Ticket covers the museum too.", dur: 3 },
    { id: "l2", name: "Patan Museum", cost: 1000, rating: 96, cat: "Culture", district: "Lalitpur", timeSlot: "morning", tip: "Arguably the finest museum in Nepal.", dur: 2 },
    { id: "l3", name: "Golden Temple (Hiranya Varna)", cost: 200, rating: 87, cat: "Culture", district: "Lalitpur", timeSlot: "morning", tip: "Worshipped since the 12th century. Arrive before 8 AM.", dur: 1 },
    { id: "l4", name: "Newari Feast at Honacha", cost: 800, rating: 90, cat: "Food", district: "Lalitpur", timeSlot: "afternoon", tip: "Just sit — food appears. Twelve small dishes.", dur: 2 },
    { id: "l5", name: "Mahabouddha Temple", cost: 0, rating: 83, cat: "Culture", district: "Lalitpur", timeSlot: "morning", tip: "Every inch carved with Buddha images.", dur: 1 },
    { id: "l6", name: "Godawari Botanical Garden", cost: 500, rating: 79, cat: "Nature", district: "Lalitpur", timeSlot: "afternoon", tip: "Spring orchid season (Feb–Apr) is spectacular.", dur: 3 },
    { id: "l7", name: "Patan Bronze Craft Workshop", cost: 600, rating: 88, cat: "Activity", district: "Lalitpur", timeSlot: "afternoon", tip: "Watch and try lost-wax bronze casting.", dur: 3 },
    { id: "b1", name: "Bhaktapur Durbar Square", cost: 1800, rating: 96, cat: "Culture", district: "Bhaktapur", timeSlot: "morning", tip: "Keep your receipt — covers all of Bhaktapur for multiple days.", dur: 3 },
    { id: "b2", name: "Pottery Square Class", cost: 1200, rating: 89, cat: "Activity", district: "Bhaktapur", timeSlot: "morning", tip: "30-min hands-on session for NPR 300–500 extra.", dur: 2 },
    { id: "b3", name: "Juju Dhau (King Yoghurt)", cost: 200, rating: 92, cat: "Food", district: "Bhaktapur", timeSlot: "afternoon", tip: "Only made in Bhaktapur. Thicker and creamier than anything else.", dur: 1 },
    { id: "b4", name: "Nyatapola Pagoda", cost: 0, rating: 86, cat: "Culture", district: "Bhaktapur", timeSlot: "morning", tip: "Five storeys, five elements.", dur: 1 },
    { id: "b5", name: "Dattatreya Square", cost: 0, rating: 83, cat: "Sightseeing", district: "Bhaktapur", timeSlot: "afternoon", tip: "The Peacock Window is among the finest wood carvings in Asia.", dur: 2 },
    { id: "b6", name: "Changu Narayan Day Trip", cost: 300, rating: 90, cat: "Culture", district: "Bhaktapur", timeSlot: "morning", tip: "Nepal's oldest Vishnu temple, 4th century.", dur: 4 },
    { id: "b7", name: "Thangka Painting Class", cost: 1500, rating: 85, cat: "Activity", district: "Bhaktapur", timeSlot: "afternoon", tip: "Studios near Taumadhi offer half-day intro sessions.", dur: 4 },
    { id: "ka1", name: "Sarangkot Sunrise Hike", cost: 1500, rating: 97, cat: "Nature", district: "Kaski", timeSlot: "morning", tip: "Leave lakeside by 4:30 AM. Life-changing on a clear day.", dur: 4 },
    { id: "ka2", name: "Phewa Lake Boat Ride", cost: 1000, rating: 89, cat: "Leisure", district: "Kaski", timeSlot: "afternoon", tip: "Row yourself or hire a boatman. Island temple is a short paddle.", dur: 2 },
    { id: "ka3", name: "Paragliding", cost: 7000, rating: 99, cat: "Adventure", district: "Kaski", timeSlot: "morning", tip: "Sunrise flights have the clearest Himalayan views.", dur: 3 },
    { id: "ka4", name: "International Mountain Museum", cost: 400, rating: 88, cat: "Culture", district: "Kaski", timeSlot: "afternoon", tip: "The scale model of Annapurna massif alone is worth it.", dur: 2 },
    { id: "ka5", name: "World Peace Pagoda Walk", cost: 500, rating: 86, cat: "Nature", district: "Kaski", timeSlot: "afternoon", tip: "Take the boat across, hike 45 mins up for stunning views.", dur: 3 },
    { id: "ka6", name: "Lakeside Sunset Stroll", cost: 0, rating: 84, cat: "Leisure", district: "Kaski", timeSlot: "evening", tip: "Walk north from Camping Chowk at golden hour.", dur: 2 },
    { id: "ka7", name: "Valley Zip-line", cost: 5000, rating: 95, cat: "Adventure", district: "Kaski", timeSlot: "morning", tip: "World's longest zip-line at 1.8 km.", dur: 2 },
    { id: "ka8", name: "Begnas Lake Kayaking", cost: 1200, rating: 87, cat: "Adventure", district: "Kaski", timeSlot: "morning", tip: "Much quieter than Phewa. Unspoilt paddy-field scenery.", dur: 3 },
    { id: "c1", name: "Jungle Jeep Safari", cost: 4500, rating: 96, cat: "Nature", district: "Chitwan", timeSlot: "morning", tip: "Rhinos and gharials almost guaranteed at dawn.", dur: 4 },
    { id: "c2", name: "Rapti River Canoe Ride", cost: 1500, rating: 87, cat: "Nature", district: "Chitwan", timeSlot: "morning", tip: "Glide silently past gharials and crocodiles.", dur: 2 },
    { id: "c3", name: "Tharu Cultural Show", cost: 500, rating: 82, cat: "Culture", district: "Chitwan", timeSlot: "evening", tip: "The stick dance performed by Tharu men is mesmerizing.", dur: 2 },
    { id: "c4", name: "Elephant Breeding Center", cost: 600, rating: 84, cat: "Nature", district: "Chitwan", timeSlot: "morning", tip: "Baby elephants most active in the morning.", dur: 2 },
    { id: "c5", name: "Tharu Cooking Class", cost: 1200, rating: 86, cat: "Food", district: "Chitwan", timeSlot: "afternoon", tip: "Learn dhikri and wild-leaf curries. You eat everything you cook.", dur: 3 },
    { id: "c6", name: "Rapti Riverside Sunset", cost: 0, rating: 85, cat: "Nature", district: "Chitwan", timeSlot: "evening", tip: "Rhinos often wade across the river at dusk.", dur: 1 },
    { id: "s1", name: "Namche Bazaar Acclimatisation", cost: 0, rating: 88, cat: "Trekking", district: "Solukhumbu", timeSlot: "morning", tip: "Spend a full extra day here at 3,440 m.", dur: 6 },
    { id: "s2", name: "Tengboche Monastery", cost: 200, rating: 93, cat: "Culture", district: "Solukhumbu", timeSlot: "morning", tip: "The 5 AM puja drum-call is one of the most profound sounds.", dur: 3 },
    { id: "s3", name: "Sagarmatha National Park", cost: 3000, rating: 90, cat: "Nature", district: "Solukhumbu", timeSlot: "morning", tip: "Keep your receipt — rangers check it repeatedly.", dur: 6 },
    { id: "s4", name: "Khumbu Glacier Moraine Walk", cost: 0, rating: 92, cat: "Nature", district: "Solukhumbu", timeSlot: "morning", tip: "Eye-level glacier views from Lobuche to Gorak Shep.", dur: 5 },
    { id: "m1", name: "Lo Manthang Walled City", cost: 0, rating: 97, cat: "Culture", district: "Mustang", timeSlot: "afternoon", tip: "The last forbidden kingdom. Whitewashed walls at dusk.", dur: 3 },
    { id: "m2", name: "Muktinath Temple Pilgrimage", cost: 100, rating: 91, cat: "Culture", district: "Mustang", timeSlot: "morning", tip: "Sacred to Hindus and Buddhists. 108 water spouts.", dur: 2 },
    { id: "m3", name: "Mustang Plateau Trek", cost: 0, rating: 95, cat: "Trekking", district: "Mustang", timeSlot: "morning", tip: "Autumn apple orchards paint the desert in crimson and gold.", dur: 6 },
    { id: "m4", name: "Sky Cave Archaeological Site", cost: 500, rating: 94, cat: "Culture", district: "Mustang", timeSlot: "morning", tip: "Thousands of man-made caves with 2,500-year-old murals.", dur: 3 },
    { id: "i1", name: "Tea Garden Sunrise Walk", cost: 0, rating: 91, cat: "Nature", district: "Ilam", timeSlot: "morning", tip: "Mist rising through tea bushes with Kanchenjunga as backdrop.", dur: 2 },
    { id: "i2", name: "Tea Factory Tour", cost: 300, rating: 87, cat: "Activity", district: "Ilam", timeSlot: "morning", tip: "Buy first-flush tea direct — far cheaper than Kathmandu.", dur: 2 },
    { id: "i3", name: "Mai Pokhari Sacred Lake", cost: 100, rating: 85, cat: "Nature", district: "Ilam", timeSlot: "afternoon", tip: "The rhododendron forest blooms in March–April.", dur: 2 },
    { id: "i4", name: "Sandakphu Border Trek", cost: 1000, rating: 93, cat: "Trekking", district: "Ilam", timeSlot: "morning", tip: "The only place to see four 8,000 m peaks simultaneously.", dur: 6 },
    { id: "bn1", name: "Bardia National Park Safari", cost: 5000, rating: 96, cat: "Nature", district: "Banke", timeSlot: "morning", tip: "Wilder than Chitwan. Highest Bengal tiger sightings.", dur: 5 },
    { id: "bn2", name: "Babai River Rafting", cost: 3000, rating: 90, cat: "Adventure", district: "Banke", timeSlot: "morning", tip: "Class III–IV rapids through pristine jungle.", dur: 4 },
    { id: "bn3", name: "Banke Wetland Bird Walk", cost: 0, rating: 83, cat: "Nature", district: "Banke", timeSlot: "morning", tip: "Bengal floricans and sarus cranes spotted here.", dur: 2 },
    { id: "bn4", name: "Tharu Village Cultural Tour", cost: 800, rating: 85, cat: "Culture", district: "Banke", timeSlot: "afternoon", tip: "Distinct oval mud homes with wall paintings.", dur: 3 },
];

const MISC = [
    { id: "mx1", name: "Local Photography Walk", cost: 0, rating: 80, cat: "Leisure", timeSlot: "morning", tip: "Just wander with your camera. Nepal surprises at every corner.", dur: 2 },
    { id: "mx2", name: "Sunrise Yoga Session", cost: 500, rating: 82, cat: "Wellness", timeSlot: "morning", tip: "Most guesthouses offer early morning yoga. Great for slow days.", dur: 1 },
    { id: "mx3", name: "Local Market Exploration", cost: 300, rating: 78, cat: "Food", timeSlot: "morning", tip: "Buy snacks, spices, and souvenirs directly from vendors.", dur: 2 },
    { id: "mx4", name: "Rooftop Café Afternoon", cost: 600, rating: 76, cat: "Leisure", timeSlot: "afternoon", tip: "Most Nepali towns have a rooftop café with a stunning view.", dur: 2 },
    { id: "mx5", name: "Evening Monastery Walk", cost: 0, rating: 79, cat: "Wellness", timeSlot: "evening", tip: "Most monasteries are peaceful at dusk — often free to enter.", dur: 1 },
    { id: "mx6", name: "Handicraft Shopping", cost: 2000, rating: 74, cat: "Activity", timeSlot: "afternoon", tip: "Fixed-price government emporiums avoid bargaining stress.", dur: 2 },
    { id: "mx7", name: "Nepali Cooking Class", cost: 1500, rating: 85, cat: "Food", timeSlot: "afternoon", tip: "Dal bhat, momos, sel-roti — you'll cook and eat everything.", dur: 3 },
    { id: "mx8", name: "Sunset Viewpoint Hike", cost: 0, rating: 83, cat: "Nature", timeSlot: "afternoon", tip: "Any local can point you to the best spot in under 30 minutes.", dur: 2 },
];

const DISTRICTS_META = {
    Kathmandu: { label: "Kathmandu", emoji: "🕌", color: "#C8972B", tagline: "City of Temples", region: "Valley", season: "Oct–Apr", temp: "15–25°C" },
    Lalitpur: { label: "Patan", emoji: "🎭", color: "#8B1A1A", tagline: "City of Fine Arts", region: "Valley", season: "Oct–Apr", temp: "15–25°C" },
    Bhaktapur: { label: "Bhaktapur", emoji: "⛩️", color: "#C8972B", tagline: "City of Devotees", region: "Valley", season: "Oct–Apr", temp: "15–25°C" },
    Kaski: { label: "Pokhara", emoji: "⛵", color: "#8B1A1A", tagline: "Gateway to the Himalayas", region: "Western", season: "Oct–Nov", temp: "18–28°C" },
    Chitwan: { label: "Chitwan", emoji: "🦏", color: "#C8972B", tagline: "Jungle Kingdom", region: "Terai", season: "Nov–Mar", temp: "20–32°C" },
    Solukhumbu: { label: "Everest Region", emoji: "❄️", color: "#8B1A1A", tagline: "Roof of the World", region: "Eastern", season: "Mar–May", temp: "-5–10°C" },
    Mustang: { label: "Mustang", emoji: "🌄", color: "#C8972B", tagline: "The Forbidden Kingdom", region: "Northern", season: "Mar–Nov", temp: "5–20°C" },
    Ilam: { label: "Ilam", emoji: "🍵", color: "#8B1A1A", tagline: "Tea Country", region: "Eastern", season: "Mar–Apr", temp: "12–22°C" },
    Banke: { label: "Bardia", emoji: "🐯", color: "#C8972B", tagline: "Wild West Nepal", region: "Terai", season: "Oct–Mar", temp: "18–30°C" },
};

const HOTELS = {
    Kathmandu: [
        {
            name: "Hyatt Regency Kathmandu", tier: "platinum", stars: 5, emoji: "🏰",
            amenities: ["Infinity Pool", "Spa", "4 Restaurants", "Himalayan Views", "Gym", "Valet", "Butler", "Airport Transfer"],
            note: "Sprawling 37-acre garden sanctuary. Wake up to Shivapuri peaks.",
            recommended: true,
            packages: [
                { id: "p1", name: "Room Only", icon: "🛏️", price: 18000, includes: ["Deluxe room", "WiFi", "24h concierge"] },
                { id: "p2", name: "Bed & Breakfast", icon: "☕", price: 21000, includes: ["Room", "Breakfast for 2", "Newspaper", "Late checkout"] },
                { id: "p3", name: "Half Board", icon: "🍽️", price: 24000, includes: ["Room", "Breakfast", "Dinner", "Welcome drink", "Turn-down service"] },
                { id: "p4", name: "Full Experience", icon: "💎", price: 29000, includes: ["Suite", "All meals", "Spa credit ₹5000", "Airport transfer", "City tour", "Butler"] },
            ]
        },
        {
            name: "Hotel Yak & Yeti", tier: "luxury", stars: 5, emoji: "🏯",
            amenities: ["Pool", "Spa", "Heritage Garden", "Casino", "Bar", "Restaurant", "WiFi", "24h Room Service"],
            note: "A 1960s palace reimagined. The heritage garden alone is worth it.",
            recommended: false,
            packages: [
                { id: "p1", name: "Room Only", icon: "🛏️", price: 12000, includes: ["Room", "WiFi"] },
                { id: "p2", name: "Breakfast Pkg", icon: "☕", price: 14000, includes: ["Room", "Breakfast", "WiFi", "Late checkout"] },
                { id: "p3", name: "Romance Escape", icon: "💕", price: 18000, includes: ["Deluxe room", "Breakfast in bed", "Spa for 2", "Candlelit dinner"] },
            ]
        },
        {
            name: "Hotel Shanker", tier: "premium", stars: 4, emoji: "🏛️",
            amenities: ["Restaurant", "Rooftop Bar", "WiFi", "Heritage Architecture", "Garden", "Meeting Rooms"],
            note: "A converted Rana palace. Neoclassical grandeur at a fair price.",
            recommended: false,
            packages: [
                { id: "p1", name: "Standard", icon: "🛏️", price: 6500, includes: ["Room", "WiFi"] },
                { id: "p2", name: "Heritage B&B", icon: "☕", price: 7800, includes: ["Room", "Breakfast", "Heritage walking tour"] },
            ]
        },
        {
            name: "Kathmandu Guest House", tier: "mid", stars: 3, emoji: "🏡",
            amenities: ["WiFi", "Garden Café", "Restaurant", "Book Exchange", "Travel Desk"],
            note: "The legendary travellers' institution since 1968. Jimmy Page stayed here.",
            recommended: false,
            packages: [
                { id: "p1", name: "Room Only", icon: "🛏️", price: 3500, includes: ["Room", "WiFi"] },
                { id: "p2", name: "Garden B&B", icon: "🌿", price: 4200, includes: ["Room", "Breakfast", "Garden access"] },
            ]
        },
        {
            name: "Tibet Peace Guesthouse", tier: "budget", stars: 2, emoji: "🏠",
            amenities: ["WiFi", "Breakfast", "Rooftop", "Common Room", "Luggage Storage"],
            note: "Super central Thamel location. Clean dorms and privates.",
            recommended: false,
            packages: [
                { id: "p1", name: "Dorm Bed", icon: "🛏️", price: 600, includes: ["Dorm", "WiFi", "Locker"] },
                { id: "p2", name: "Private Room", icon: "🔑", price: 1200, includes: ["Private room", "WiFi", "Breakfast"] },
            ]
        },
        {
            name: "Zostel Kathmandu", tier: "backpacker", stars: 1, emoji: "🎒",
            amenities: ["WiFi", "Common Kitchen", "Events", "Rooftop", "Locker"],
            note: "The social hub of Thamel. Best place to find trekking partners.",
            recommended: false,
            packages: [
                { id: "p1", name: "Dorm (6-bed)", icon: "🛏️", price: 500, includes: ["Dorm", "WiFi", "Events"] },
                { id: "p2", name: "Dorm (4-bed)", icon: "🔑", price: 700, includes: ["Dorm", "WiFi", "Events", "Locker"] },
            ]
        },
    ],
    Lalitpur: [
        {
            name: "Inn Patan", tier: "luxury", stars: 4, emoji: "🏛️",
            amenities: ["Rooftop Pool", "Spa", "Farm-to-table Restaurant", "WiFi", "Courtyard Garden"],
            note: "A beautifully restored Patan courtyard. Arguably the most atmospheric stay in the Valley.",
            recommended: true,
            packages: [
                { id: "p1", name: "Room Only", icon: "🛏️", price: 9000, includes: ["Room", "WiFi"] },
                { id: "p2", name: "Art & Culture", icon: "🎨", price: 11500, includes: ["Room", "Breakfast", "Patan Museum entry", "Bronze workshop"] },
                { id: "p3", name: "Full Immersion", icon: "💎", price: 14000, includes: ["Room", "All meals", "Museum", "Workshop", "Newari cooking class"] },
            ]
        },
        {
            name: "Summit Hotel", tier: "premium", stars: 3, emoji: "⛰️",
            amenities: ["Pool", "WiFi", "Restaurant", "Hillside Garden", "Valley Views"],
            note: "Perched on a peaceful hill above Patan. The pool view over the Valley is magical.",
            recommended: false,
            packages: [
                { id: "p1", name: "Standard", icon: "🛏️", price: 4500, includes: ["Room", "WiFi"] },
                { id: "p2", name: "Pool & B&B", icon: "🏊", price: 5500, includes: ["Room", "Breakfast", "Pool access", "Valley view room"] },
            ]
        },
        {
            name: "Newa Chen Heritage Lodge", tier: "budget", stars: 2, emoji: "🏠",
            amenities: ["WiFi", "Breakfast", "Traditional Architecture", "Family-run", "Rooftop"],
            note: "Family-run Newari home. The grandmother makes fresh sel-roti every morning.",
            recommended: false,
            packages: [
                { id: "p1", name: "Room Only", icon: "🛏️", price: 2000, includes: ["Room", "WiFi"] },
                { id: "p2", name: "Homestay", icon: "🫶", price: 2600, includes: ["Room", "Breakfast", "Dinner", "Cultural stories"] },
            ]
        },
    ],
    Bhaktapur: [
        {
            name: "Bhaktapur Heritage Hotel", tier: "luxury", stars: 4, emoji: "⛩️",
            amenities: ["Rooftop Restaurant", "WiFi", "Durbar View", "Heritage Architecture", "Bar", "Spa Treatments"],
            note: "Wake up to temple bells from your window. The rooftop breakfast is extraordinary.",
            recommended: true,
            packages: [
                { id: "p1", name: "Standard", icon: "🛏️", price: 7500, includes: ["Room", "WiFi"] },
                { id: "p2", name: "Durbar View", icon: "⛩️", price: 9000, includes: ["Durbar view room", "Breakfast", "Complimentary entry ticket"] },
                { id: "p3", name: "Full Heritage", icon: "💎", price: 12000, includes: ["Suite", "All meals", "Pottery class", "Thangka session", "City guide"] },
            ]
        },
        {
            name: "Nyatapola Inn", tier: "mid", stars: 3, emoji: "🗼",
            amenities: ["WiFi", "Restaurant", "Taumadhi View", "24h Hot Water"],
            note: "Steps from the 5-storey Nyatapola Pagoda. Temple light pours in at sunrise.",
            recommended: false,
            packages: [
                { id: "p1", name: "Room Only", icon: "🛏️", price: 3500, includes: ["Room", "WiFi"] },
                { id: "p2", name: "B&B", icon: "☕", price: 4200, includes: ["Room", "Breakfast", "WiFi"] },
            ]
        },
        {
            name: "Pagoda Guest House", tier: "backpacker", stars: 2, emoji: "🛖",
            amenities: ["WiFi", "Rooftop", "Common Room"],
            note: "No frills but unbeatable location. The rooftop has an authentic Durbar Square view.",
            recommended: false,
            packages: [
                { id: "p1", name: "Basic Room", icon: "🛏️", price: 900, includes: ["Room", "WiFi", "Rooftop access"] },
            ]
        },
    ],
    Kaski: [
        {
            name: "Fish Tail Lodge", tier: "platinum", stars: 5, emoji: "🏝️",
            amenities: ["Lake-facing Pool", "Spa", "Fine Dining", "Private Island", "WiFi", "Boat Access", "Butler", "Yoga Deck"],
            note: "Nepal's most romantic hotel. Accessed only by rope-pulled raft. Utterly magical.",
            recommended: true,
            packages: [
                { id: "p1", name: "Lake View", icon: "⛵", price: 16000, includes: ["Lake view room", "WiFi", "Boat access"] },
                { id: "p2", name: "Half Board", icon: "🍽️", price: 19000, includes: ["Room", "Breakfast", "Dinner", "Yoga session", "Boat"] },
                { id: "p3", name: "Romance", icon: "💕", price: 24000, includes: ["Suite", "All meals", "Spa for 2", "Sunrise boat", "Candle dinner"] },
                { id: "p4", name: "Ultimate", icon: "💎", price: 29000, includes: ["Presidential suite", "All meals", "Unlimited spa", "Private guide", "Helicopter sunrise"] },
            ]
        },
        {
            name: "Temple Tree Resort", tier: "luxury", stars: 5, emoji: "🌿",
            amenities: ["Pool", "Spa", "4 Restaurants", "Lakeside Garden", "Yoga", "WiFi", "Bike Rental"],
            note: "Award-winning eco-luxury. The pool stretches toward the lake at golden hour.",
            recommended: false,
            packages: [
                { id: "p1", name: "Standard", icon: "🛏️", price: 10500, includes: ["Room", "WiFi", "Pool"] },
                { id: "p2", name: "Wellness", icon: "🧘", price: 13000, includes: ["Room", "Breakfast", "Daily yoga", "Spa treatment", "Lake tour"] },
            ]
        },
        {
            name: "Hotel Middle Path", tier: "premium", stars: 3, emoji: "⛵",
            amenities: ["Lakeside Restaurant", "WiFi", "Lake View", "Rooftop", "Bike Rental"],
            note: "Right on the lakeside strip. The rooftop sunset view is free and spectacular.",
            recommended: false,
            packages: [
                { id: "p1", name: "Room Only", icon: "🛏️", price: 4200, includes: ["Room", "WiFi"] },
                { id: "p2", name: "Lake View B&B", icon: "🌅", price: 5000, includes: ["Lake view room", "Breakfast", "Bike rental"] },
            ]
        },
        {
            name: "Butterfly Lodge", tier: "budget", stars: 2, emoji: "🦋",
            amenities: ["WiFi", "Garden", "Breakfast", "Common Lounge", "Bike Hire"],
            note: "Beloved backpacker lodge in a garden setting. The manager knows every good trail.",
            recommended: false,
            packages: [
                { id: "p1", name: "Basic", icon: "🛏️", price: 950, includes: ["Room", "WiFi"] },
                { id: "p2", name: "Breakfast Deal", icon: "☕", price: 1200, includes: ["Room", "WiFi", "Breakfast", "Garden"] },
            ]
        },
    ],
    Chitwan: [
        {
            name: "Meghauli Serai (Taj)", tier: "platinum", stars: 5, emoji: "🐘",
            amenities: ["Infinity Pool", "Spa", "Fine Dining", "Safari", "River View", "Butler", "Wildlife Walks", "Birdwatching"],
            note: "The Taj inside the park. Elephants and rhinos walk past the pool. Life-defining.",
            recommended: true,
            packages: [
                { id: "p1", name: "Park Stay", icon: "🦏", price: 27000, includes: ["Room", "All meals", "1 safari", "River sunset"] },
                { id: "p2", name: "Wildlife", icon: "💎", price: 35000, includes: ["Suite", "All meals", "3 safaris", "Canoe", "Village visit", "Spa"] },
            ]
        },
        {
            name: "Kasara Resort", tier: "premium", stars: 4, emoji: "🌿",
            amenities: ["Pool", "WiFi", "Restaurant", "Safari", "Birding", "Nature Walks", "Bonfire"],
            note: "On the park boundary. Exceptional birding access. Tiger sightings from the lawn.",
            recommended: false,
            packages: [
                { id: "p1", name: "Standard", icon: "🛏️", price: 6500, includes: ["Room", "WiFi", "Breakfast"] },
                { id: "p2", name: "Jungle Pack", icon: "🌿", price: 8500, includes: ["Room", "All meals", "Safari", "Canoe", "Cultural show"] },
            ]
        },
        {
            name: "Travellers Jungle Camp", tier: "budget", stars: 2, emoji: "🏕️",
            amenities: ["WiFi", "Meals included", "Common Fire", "Safari booking", "Garden"],
            note: "No-frills jungle camp. The campfire stories from the staff are unforgettable.",
            recommended: false,
            packages: [
                { id: "p1", name: "Camp Stay", icon: "🔥", price: 1600, includes: ["Room", "Breakfast", "Dinner", "WiFi", "Campfire"] },
            ]
        },
    ],
    Solukhumbu: [
        {
            name: "Everest View Hotel", tier: "luxury", stars: 4, emoji: "🏔️",
            amenities: ["Panoramic Restaurant", "Everest View", "Oxygen Assist", "WiFi", "Tea Lounge", "Heli Pad"],
            note: "The highest hotel in the world at 3,880 m. Breakfast with Everest in your face.",
            recommended: true,
            packages: [
                { id: "p1", name: "Standard", icon: "🛏️", price: 13000, includes: ["Room", "Breakfast", "Everest view", "WiFi"] },
                { id: "p2", name: "Full Board", icon: "🏔️", price: 17000, includes: ["Room", "All meals", "Acclimatisation support", "Lukla pick-up"] },
            ]
        },
        {
            name: "Namche Eco Lodge", tier: "mid", stars: 3, emoji: "🏠",
            amenities: ["WiFi", "Dal Bhat", "Hot Shower", "Gear Storage", "Trekking Advice"],
            note: "Warm and cosy in Namche. The lodge owner has trekked EBC over 200 times.",
            recommended: false,
            packages: [
                { id: "p1", name: "B&B", icon: "☕", price: 2800, includes: ["Room", "Breakfast", "WiFi"] },
                { id: "p2", name: "Half Board", icon: "🍲", price: 3500, includes: ["Room", "Breakfast", "Dal bhat dinner", "Gear storage"] },
            ]
        },
        {
            name: "Trekkers Tea House", tier: "backpacker", stars: 1, emoji: "🍵",
            amenities: ["Dal Bhat", "Blankets", "Common Dining", "Trekking Tips"],
            note: "Basic but warm. Unlimited dal bhat refills included. The authentic EBC experience.",
            recommended: false,
            packages: [
                { id: "p1", name: "Half Board", icon: "🍲", price: 800, includes: ["Bed", "Breakfast", "Dal bhat dinner"] },
            ]
        },
    ],
    Mustang: [
        {
            name: "Lo Manthang Hotel", tier: "luxury", stars: 3, emoji: "🏰",
            amenities: ["Restaurant", "WiFi", "Rooftop", "Cultural Tours", "Inner City View"],
            note: "The only hotel inside the walled city of Lo Manthang. A rare privilege.",
            recommended: true,
            packages: [
                { id: "p1", name: "Standard", icon: "🛏️", price: 9000, includes: ["Room", "Breakfast", "WiFi", "Walled city access"] },
                { id: "p2", name: "Kingdom Pkg", icon: "👑", price: 13000, includes: ["Room", "All meals", "Sky cave visit", "Monastery tour", "Cultural dinner"] },
            ]
        },
        {
            name: "Dhaulagiri Lodge", tier: "mid", stars: 2, emoji: "🏔️",
            amenities: ["Meals", "WiFi", "Mountain View", "Warm Bedding", "Trekking Support"],
            note: "Solid mid-range option in Jomsom. Great views of Dhaulagiri at sunrise.",
            recommended: false,
            packages: [
                { id: "p1", name: "Half Board", icon: "🍽️", price: 3200, includes: ["Room", "Breakfast", "Dinner", "WiFi"] },
            ]
        },
        {
            name: "Mustang Heritage Lodge", tier: "backpacker", stars: 1, emoji: "🪨",
            amenities: ["Meals", "Blankets", "Local Kitchen"],
            note: "Traditional stone lodge with earthen walls. Sleep like a Mustangi local.",
            recommended: false,
            packages: [
                { id: "p1", name: "Basic", icon: "🛏️", price: 1000, includes: ["Room", "Breakfast", "Dinner"] },
            ]
        },
    ],
    Ilam: [
        {
            name: "Kanyam Tea Resort", tier: "premium", stars: 3, emoji: "🌿",
            amenities: ["Tea Garden", "Restaurant", "WiFi", "Sunrise Deck", "Guided Tea Walks", "Bonfire"],
            note: "Waking up inside a tea garden with Kanchenjunga in the distance. Unmissable.",
            recommended: true,
            packages: [
                { id: "p1", name: "Standard", icon: "🛏️", price: 5500, includes: ["Room", "Breakfast", "WiFi", "Tea garden walk"] },
                { id: "p2", name: "Tea Immersion", icon: "🍵", price: 7500, includes: ["Room", "All meals", "Factory tour", "Guided walks", "Bonfire evening"] },
            ]
        },
        {
            name: "Ilam Green Lodge", tier: "mid", stars: 2, emoji: "🏡",
            amenities: ["WiFi", "Breakfast", "Tea View", "Clean Bathrooms"],
            note: "Clean, comfortable, and honest. Tea is served at sunrise on the porch.",
            recommended: false,
            packages: [
                { id: "p1", name: "B&B", icon: "☕", price: 2200, includes: ["Room", "Breakfast", "WiFi"] },
            ]
        },
        {
            name: "Tea Country Guesthouse", tier: "backpacker", stars: 1, emoji: "🛖",
            amenities: ["Breakfast", "Shared Bathrooms", "Common Room"],
            note: "Humble surroundings, extraordinary scenery just outside the door.",
            recommended: false,
            packages: [
                { id: "p1", name: "Basic", icon: "🛏️", price: 750, includes: ["Room", "Breakfast"] },
            ]
        },
    ],
    Banke: [
        {
            name: "Bardia Wildlife Resort", tier: "luxury", stars: 4, emoji: "🐯",
            amenities: ["Pool", "Restaurant", "WiFi", "Safari", "Nature Walks", "Bonfire", "Bird Hides"],
            note: "The finest jungle lodge in Bardia. Tiger sighting rate here is Nepal's best.",
            recommended: true,
            packages: [
                { id: "p1", name: "Standard", icon: "🛏️", price: 9500, includes: ["Room", "Breakfast", "WiFi"] },
                { id: "p2", name: "Safari Pack", icon: "🐅", price: 13000, includes: ["Room", "All meals", "2 safaris", "Canoe", "Tharu show", "Nature walk"] },
                { id: "p3", name: "Tiger Trail", icon: "💎", price: 17000, includes: ["Suite", "All meals", "4 safaris", "Night drive", "Rafting", "Spa"] },
            ]
        },
        {
            name: "Bardia Eco Lodge", tier: "premium", stars: 3, emoji: "🌿",
            amenities: ["WiFi", "Meals", "Safari", "Garden", "Bonfire", "Bird Walks"],
            note: "On the park boundary. Eco-conscious lodge run by a former park warden.",
            recommended: false,
            packages: [
                { id: "p1", name: "Half Board", icon: "🍽️", price: 3800, includes: ["Room", "Breakfast", "Dinner", "WiFi"] },
                { id: "p2", name: "Safari Pack", icon: "🌿", price: 5500, includes: ["Room", "All meals", "1 safari", "Bird walk", "Bonfire"] },
            ]
        },
        {
            name: "Jungle Safari Camp", tier: "backpacker", stars: 1, emoji: "⛺",
            amenities: ["Meals", "Safari booking", "Campfire", "Tented rooms"],
            note: "Tented camp with wild atmosphere. Hyenas call from beyond the fence at night.",
            recommended: false,
            packages: [
                { id: "p1", name: "Camp Package", icon: "🔥", price: 1300, includes: ["Tent", "All meals", "Campfire", "WiFi"] },
            ]
        },
    ],
};

const GUIDES = {
    Kathmandu: [
        { id: "kg1", name: "Sanjay Maharjan", rating: 4.9, reviews: 312, langs: ["English", "French", "Hindi"], speciality: "Heritage & Temples", price: 2500, avatar: "🧑‍🦱", bio: "Born in Kathmandu Valley. Every hidden courtyard, every shrine has a story — I know them all.", tours: ["Durbar Squares", "Old City Walks", "Spiritual Circuits"] },
        { id: "kg2", name: "Priya Shrestha", rating: 4.8, reviews: 198, langs: ["English", "German"], speciality: "Food & Culture", price: 2000, avatar: "👩‍🦱", bio: "Former chef turned guide. I'll feed you as well as educate you.", tours: ["Street Food", "Newari Culture", "Markets"] },
        { id: "kg3", name: "Ram Tamang", rating: 4.7, reviews: 445, langs: ["English", "Japanese"], speciality: "Photography & Sunrise", price: 3000, avatar: "🧔", bio: "Professional photographer. Every stop is timed for the best light.", tours: ["Photography Tours", "Sunrise Spots", "Viewpoints"] },
    ],
    Lalitpur: [
        { id: "lg1", name: "Aasha Joshi", rating: 4.9, reviews: 267, langs: ["English", "Spanish", "Nepali"], speciality: "Art & Bronze Craft", price: 2200, avatar: "👩‍🎨", bio: "Art historian and practising thangka artist. Patan's museums are my second home.", tours: ["Museum Deep Dives", "Craft Workshops", "Architecture"] },
        { id: "lg2", name: "Bikash Manandhar", rating: 4.8, reviews: 189, langs: ["English", "French"], speciality: "History & Legends", price: 1800, avatar: "🧑‍🎓", bio: "PhD in Newar history. Every stone in Patan has a story.", tours: ["Historical Walks", "Temple Legends", "Old Patan"] },
    ],
    Bhaktapur: [
        { id: "bk1", name: "Gopal Chitrakar", rating: 5.0, reviews: 523, langs: ["English", "Italian", "Nepali"], speciality: "Pottery & Crafts", price: 2800, avatar: "🧑‍🏭", bio: "Third-generation potter from Pottery Square. I'll teach you the clay.", tours: ["Craft Quarter", "Durbar Deep Dive", "Local Food"] },
        { id: "bk2", name: "Laxmi Karmacharya", rating: 4.8, reviews: 301, langs: ["English", "Hindi"], speciality: "Festivals & Traditions", price: 2000, avatar: "👩‍🦰", bio: "Festival photographer and cultural guide.", tours: ["Festival Immersion", "Sacred Architecture", "Juju Dhau Trail"] },
    ],
    Kaski: [
        { id: "kk1", name: "Dorje Gurung", rating: 4.9, reviews: 412, langs: ["English", "Chinese", "Nepali"], speciality: "Paragliding & Adventure", price: 1500, avatar: "🧗", bio: "Licensed paragliding instructor and trekking guide. The mountains are my backyard.", tours: ["Sunrise Hikes", "Adventure Sports", "Mountain Views"] },
        { id: "kk2", name: "Maya Thapa", rating: 4.8, reviews: 234, langs: ["English", "French"], speciality: "Lakeside & Wellness", price: 1800, avatar: "🧘‍♀️", bio: "Yoga teacher and mindful travel guide. Pokhara's soul is in its stillness.", tours: ["Mindful Walks", "Phewa Lake", "Sunset Spots"] },
    ],
    Chitwan: [
        { id: "ct1", name: "Dinesh Chaudhary", rating: 4.9, reviews: 678, langs: ["English", "Hindi", "Nepali"], speciality: "Wildlife Safaris", price: 3500, avatar: "🦁", bio: "Ex-national park ranger with 20 years tracking rhinos and tigers.", tours: ["Jeep Safaris", "Canoe Rides", "Tiger Tracking"] },
        { id: "ct2", name: "Sunita Tharu", rating: 4.8, reviews: 287, langs: ["English", "Nepali"], speciality: "Tharu Culture", price: 2000, avatar: "👩‍🌾", bio: "Tharu community leader sharing our living culture.", tours: ["Village Walks", "Cooking Classes", "Cultural Shows"] },
    ],
    Solukhumbu: [
        { id: "sk1", name: "Pasang Sherpa", rating: 5.0, reviews: 891, langs: ["English", "German", "Nepali"], speciality: "High Altitude Trekking", price: 5000, avatar: "🏔️", bio: "Summited Everest three times. I know the mountain like my own face.", tours: ["EBC Trek", "Acclimatisation", "Sherpa Culture"] },
        { id: "sk2", name: "Karma Lama", rating: 4.9, reviews: 456, langs: ["English", "Japanese"], speciality: "Buddhist Culture", price: 3500, avatar: "🧘", bio: "Trained monk and licensed guide. The spiritual Himalaya is my specialty.", tours: ["Monastery Circuit", "Buddhist Philosophy", "Namche Village"] },
    ],
    Mustang: [
        { id: "ms1", name: "Tenzin Gurung", rating: 5.0, reviews: 234, langs: ["English", "Tibetan", "Nepali"], speciality: "Ancient Kingdom & Caves", price: 6000, avatar: "👴", bio: "Mustangi elder with deep knowledge of Lo Manthang's royal history.", tours: ["Lo Manthang", "Sky Caves", "Ancient Murals"] },
    ],
    Ilam: [
        { id: "il1", name: "Sita Limbu", rating: 4.8, reviews: 145, langs: ["English", "Nepali", "Limbu"], speciality: "Tea & Eco Tourism", price: 1500, avatar: "🌱", bio: "Third-generation tea farmer. I'll show you every step from bush to cup.", tours: ["Tea Garden Walks", "Factory Tours", "Kanchenjunga Views"] },
    ],
    Banke: [
        { id: "bk_b", name: "Arjun Rana", rating: 4.9, reviews: 312, langs: ["English", "Hindi", "Nepali"], speciality: "Tiger & Wildlife Safaris", price: 4500, avatar: "🐅", bio: "Ex-anti-poaching ranger turned guide. Bardia's finest wildlife tracker.", tours: ["Tiger Safaris", "Rafting", "Night Drives"] },
    ],
};

const CAT_COLOR = {
    Culture: "#C8972B", Food: "#8B1A1A", Nature: "#C8972B", Adventure: "#8B1A1A",
    Trekking: "#C8972B", Leisure: "#8B1A1A", Activity: "#C8972B", Nightlife: "#8B1A1A",
    Wellness: "#C8972B", Sightseeing: "#8B1A1A",
};

const TIER_META = {
    platinum: { icon: "💎", label: "Platinum", badge: "Most Exclusive", color: "#C8972B", desc: "The absolute finest" },
    luxury: { icon: "✨", label: "Luxury", badge: "Top Rated", color: "#C8972B", desc: "Premium in every detail" },
    premium: { icon: "🏅", label: "Premium", badge: "Best Value+", color: "#8B1A1A", desc: "Comfort & quality" },
    mid: { icon: "🏨", label: "Comfortable", badge: "Popular", color: "#C8972B", desc: "Great balance" },
    budget: { icon: "🎒", label: "Budget", badge: "Smart Pick", color: "#8B1A1A", desc: "Wallet-friendly" },
    backpacker: { icon: "🛏️", label: "Backpacker", badge: "Bare Essentials", color: "#C8972B", desc: "Just the essentials" },
};

// ─── KNAPSACK ─────────────────────────────────────────────────────────────────
function knapsack(budget, items) {
    if (!items.length || budget <= 0) return [];
    const S = 50, W = Math.floor(budget / S), n = items.length;
    const dp = new Array(W + 1).fill(0);
    const keep = Array.from({ length: n }, () => new Uint8Array(W + 1));
    for (let i = 0; i < n; i++) {
        const wi = Math.max(1, Math.floor(items[i].cost / S));
        const vi = items[i].rating;
        for (let w = W; w >= wi; w--) {
            if (dp[w - wi] + vi > dp[w]) { dp[w] = dp[w - wi] + vi; keep[i][w] = 1; }
        }
    }
    const sel = []; let w = W;
    for (let i = n - 1; i >= 0; i--) {
        if (keep[i][w]) { sel.push(items[i]); w -= Math.max(1, Math.floor(items[i].cost / S)); }
    }
    return sel;
}

function byTime(acts) {
    const o = { morning: 0, afternoon: 1, evening: 2 };
    return [...acts].sort((a, b) => (o[a.timeSlot] || 1) - (o[b.timeSlot] || 1));
}

const fmt = n => `NPR ${Number(n).toLocaleString()}`;
const greet = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"; };

// ─── LANDMARK MAP ─────────────────────────────────────────────────────────────
const LMKS = {
    Kathmandu: [{ x: 45, y: 28, n: "Boudhanath" }, { x: 32, y: 48, n: "Pashupatinath" }, { x: 62, y: 55, n: "Swayambhunath" }, { x: 50, y: 68, n: "Durbar Sq" }, { x: 70, y: 38, n: "Thamel" }],
    Lalitpur: [{ x: 40, y: 34, n: "Patan Museum" }, { x: 55, y: 52, n: "Durbar Sq" }, { x: 66, y: 30, n: "Golden Temple" }, { x: 35, y: 65, n: "Kumbheshwar" }, { x: 60, y: 68, n: "Mahabouddha" }],
    Bhaktapur: [{ x: 35, y: 38, n: "Durbar Sq" }, { x: 56, y: 34, n: "Nyatapola" }, { x: 66, y: 56, n: "Pottery Sq" }, { x: 45, y: 67, n: "Dattatreya" }, { x: 72, y: 42, n: "Taumadhi" }],
    Kaski: [{ x: 38, y: 58, n: "Phewa Lake" }, { x: 24, y: 22, n: "Sarangkot" }, { x: 66, y: 18, n: "Annapurna" }, { x: 56, y: 72, n: "Davis Falls" }, { x: 44, y: 35, n: "Lakeside" }],
    Chitwan: [{ x: 40, y: 42, n: "Natl Park" }, { x: 56, y: 62, n: "Rapti River" }, { x: 66, y: 30, n: "Elephant Ctr" }, { x: 28, y: 66, n: "Tharu Village" }, { x: 52, y: 35, n: "Buffer Zone" }],
    Solukhumbu: [{ x: 50, y: 18, n: "EBC" }, { x: 40, y: 40, n: "Namche" }, { x: 60, y: 56, n: "Tengboche" }, { x: 34, y: 68, n: "Lukla" }, { x: 68, y: 30, n: "Khumbu Glacier" }],
    Mustang: [{ x: 46, y: 24, n: "Lo Manthang" }, { x: 56, y: 50, n: "Muktinath" }, { x: 34, y: 62, n: "Kagbeni" }, { x: 66, y: 40, n: "Sky Caves" }, { x: 50, y: 68, n: "Jomsom" }],
    Ilam: [{ x: 40, y: 34, n: "Tea Garden" }, { x: 56, y: 52, n: "Mai Pokhari" }, { x: 66, y: 28, n: "Kanyam View" }, { x: 34, y: 66, n: "Tea Factory" }, { x: 58, y: 68, n: "Sandakphu" }],
    Banke: [{ x: 40, y: 40, n: "Natl Park" }, { x: 56, y: 34, n: "Babai River" }, { x: 66, y: 62, n: "Tiger Zone" }, { x: 28, y: 62, n: "Wetlands" }, { x: 52, y: 58, n: "Tharu Village" }],
};

function MapView({ district, compact = false }) {
    const meta = DISTRICTS_META[district];
    if (!meta) return null;
    const c = meta.color;
    const pts = LMKS[district] || [];
    return (
        <div style={{ position: "relative", width: "100%", height: compact ? "130px" : "210px", borderRadius: "3px", overflow: "hidden", background: "linear-gradient(145deg,#1A0A00,#2A1200)", border: `1px solid ${c}30` }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05 }} viewBox="0 0 100 100" preserveAspectRatio="none">
                {[10, 20, 30, 40, 50, 60, 70, 80, 90].flatMap(v => [
                    <line key={`h${v}`} x1="0" y1={v} x2="100" y2={v} stroke={c} strokeWidth="0.5" />,
                    <line key={`v${v}`} x1={v} y1="0" x2={v} y2="100" stroke={c} strokeWidth="0.5" />
                ])}
            </svg>
            <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 50% 50%,${c}15 0%,transparent 70%)` }} />
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 100 100">
                {pts.map((p, i) => (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r="2.2" fill={c} opacity="0.9" />
                        <circle cx={p.x} cy={p.y} r="5" fill="none" stroke={c} strokeWidth="0.6" opacity="0.35" />
                        <circle cx={p.x} cy={p.y} r="9" fill="none" stroke={c} strokeWidth="0.3" opacity="0.14">
                            <animate attributeName="r" values="9;16;9" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
                            <animate attributeName="opacity" values="0.14;0;0.14" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" begin={`${i * 0.4}s`} />
                        </circle>
                        {!compact && <text x={p.x + 3.5} y={p.y + 1.5} fontSize="3.4" fill="rgba(245,236,215,0.7)" fontFamily="Crimson Pro">{p.n}</text>}
                    </g>
                ))}
            </svg>
            <div style={{ position: "absolute", top: 7, right: 9, fontSize: "14px", opacity: 0.25 }}>🧭</div>
            <div style={{ position: "absolute", bottom: 7, left: 9, fontFamily: "Cinzel", fontSize: "8px", color: c, letterSpacing: "2px", opacity: 0.8 }}>{meta.label} · {meta.region}</div>
            <div style={{ position: "absolute", bottom: 7, right: 9, fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.3)" }}>{meta.temp}</div>
        </div>
    );
}

// ─── QA CHAT ──────────────────────────────────────────────────────────────────
const QA = {
    "Best time to visit?": "October–November and March–April are peak season — crystal skies, perfect temperatures, rhododendrons in bloom. June–August is monsoon: lush and dramatic, but rain every afternoon. November–February is dry and mild but cold at altitude.",
    "Is it safe solo?": "Nepal is genuinely one of the safest countries for solo travel. Locals are remarkably welcoming. Stay alert for pickpockets in busy Thamel-style areas, but violent crime against tourists is extremely rare. Many solo women travelers love it.",
    "Local food to try?": "Must-try: dal bhat (always unlimited refills!), momos, sel-roti, juju dhau (Bhaktapur's king yoghurt), thukpa, and chiya (spiced milk tea). For the adventurous: choila (spiced buff meat) and samay baji — a full Newari feast platter.",
    "How to get around?": "Within cities: microbuses and taxis are cheap. Kathmandu–Pokhara: 25 min flight or 6-7hr scenic bus. For the mountains: tiny Twin Otter planes fly to Lukla (EBC) and Jomsom (Mustang) — book early! Motorbike rentals are great in Pokhara.",
    "What to pack?": "Layers are everything. Comfortable walking shoes (cobblestones everywhere). Light rain jacket, sunscreen, and lip balm. Modest clothes for temples — cover shoulders and knees. A headtorch for early hikes. Power bank — load-shedding still happens.",
    "Tipping culture?": "Appreciated but not mandatory. Guides: NPR 500–1000/day is generous. Restaurants: 10% if service not included. Drivers: NPR 200–500 for a full day. Always tip guides separately from the agency — it goes directly to them.",
};

// ─── CHAT BUBBLE ──────────────────────────────────────────────────────────────
function Bubble({ text, from = "hati", typing = false }) {
    const isH = from === "hati";
    return (
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginBottom: "10px", flexDirection: isH ? "row" : "row-reverse", animation: "slideUp 0.25s ease both" }}>
            {isH && (
                <div style={{ width: "28px", height: "28px", borderRadius: "3px", background: "linear-gradient(135deg,#8B1A1A,#C8972B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", flexShrink: 0 }}>🐘</div>
            )}
            <div style={{ maxWidth: "84%", padding: "9px 13px", borderRadius: isH ? "3px 10px 10px 10px" : "10px 3px 10px 10px", background: isH ? "rgba(200,151,43,0.08)" : "rgba(139,26,26,0.12)", border: `1px solid ${isH ? "rgba(200,151,43,0.2)" : "rgba(139,26,26,0.25)"}`, fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "13px", lineHeight: "1.7", color: "rgba(245,236,215,0.9)", whiteSpace: "pre-wrap" }}>
                {typing ? <span style={{ animation: "pulse 1s ease-in-out infinite", fontFamily: "monospace", letterSpacing: "4px", color: "rgba(200,151,43,0.7)" }}>● ● ●</span> : text}
            </div>
        </div>
    );
}

// ─── CHAT PANE ────────────────────────────────────────────────────────────────
function ChatPane({ name, district }) {
    const meta = DISTRICTS_META[district] || {};
    const [msgs, setMsgs] = useState([{ from: "hati", text: `नमस्ते ${name} 🙏 How's ${meta.label || "Nepal"} treating you?\n\nAsk me anything about tips, transport, food, safety, or what to do next. Or tap a quick question below.` }]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);
    const endRef = useRef(null);

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

    function send(text) {
        if (!text.trim()) return;
        setMsgs(prev => [...prev, { from: "user", text: text.trim() }]);
        setInput("");
        setTyping(true);
        setTimeout(() => {
            const lo = text.toLowerCase();
            let r = QA[text];
            if (!r) {
                if (lo.includes("hotel") || lo.includes("stay")) r = `For ${meta.label || "this area"}, head to the Hotels tab — I've curated options from backpacker (NPR 500/night) all the way to platinum (NPR 30,000+/night). Each hotel has multiple packages so you can fine-tune what's included.`;
                else if (lo.includes("guide")) r = `Local guides transform ordinary travel into extraordinary travel. Check the Guide tab — I've handpicked verified guides for ${meta.label} with their specialities, languages, and ratings.`;
                else if (lo.includes("budget") || lo.includes("money")) r = `Nepal is remarkably affordable! Backpacker: NPR 2,000–4,000/day. Mid-range: NPR 6,000–10,000/day. Luxury: NPR 20,000+/day. The big costs are paragliding, safaris, and permits. Dal bhat always comes with unlimited refills.`;
                else if (lo.includes("weather") || lo.includes("season")) r = `Best season for ${meta.label || "Nepal"}: ${meta.season || "Oct–Nov, Mar–Apr"}. Temperature range: ${meta.temp || "varies"}. Monsoon (Jun–Sep) brings dramatic green landscapes but afternoon rain.`;
                else if (lo.includes("thank")) r = `Always a pleasure, ${name}! 🙏 That's exactly what I'm here for. Enjoy every moment — Nepal stays with you long after you leave.`;
                else r = `Great question! My best tip: talk to the locals — every chai stall owner has a recommendation you won't find in any guidebook. What specifically are you wondering about?`;
            }
            setTyping(false);
            setMsgs(prev => [...prev, { from: "hati", text: r }]);
        }, 700 + Math.random() * 400);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "60vh" }}>
            <div style={{ flex: 1, overflowY: "auto", paddingBottom: "6px" }}>
                {msgs.map((m, i) => <Bubble key={i} from={m.from} text={m.text} />)}
                {typing && <Bubble from="hati" typing />}
                <div ref={endRef} />
            </div>
            <div style={{ margin: "8px 0" }}>
                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.28)", marginBottom: "6px", letterSpacing: "0.1em", textTransform: "uppercase" }}>Quick questions:</div>
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {Object.keys(QA).map(q => (
                        <button key={q} onClick={() => send(q)} style={{ padding: "5px 10px", borderRadius: "2px", border: "1px solid rgba(200,151,43,0.15)", background: "rgba(200,151,43,0.04)", color: "rgba(245,236,215,0.45)", fontFamily: "'Crimson Pro',serif", fontSize: "10px" }}>
                            {q}
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)}
                    placeholder={`Ask HATI about ${meta.label || "Nepal"}...`}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: "2px", border: "1px solid rgba(200,151,43,0.18)", background: "rgba(245,236,215,0.03)", color: "#F5ECD7", fontFamily: "'Crimson Pro',serif", fontSize: "12px" }} />
                <button onClick={() => send(input)} style={{ width: "38px", height: "38px", borderRadius: "2px", background: "linear-gradient(135deg,#8B1A1A,#C8972B)", color: "#F5ECD7", fontSize: "15px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(200,151,43,0.3)" }}>➤</button>
            </div>
        </div>
    );
}

// ─── ACTIVITY CARD ────────────────────────────────────────────────────────────
function ActCard({ act, included, onToggle, canAfford }) {
    const c = CAT_COLOR[act.cat] || "#C8972B";
    const ti = { morning: "🌅", afternoon: "☀️", evening: "🌙" }[act.timeSlot] || "🕐";
    const dim = !included && !canAfford;
    return (
        <div className="card-hover" style={{ display: "flex", gap: "10px", alignItems: "flex-start", padding: "12px 14px", borderRadius: "2px", marginBottom: "7px", background: included ? "rgba(200,151,43,0.06)" : "rgba(245,236,215,0.02)", border: `1px solid ${included ? c + "55" : "rgba(200,151,43,0.1)"}`, opacity: dim ? 0.45 : 1, transition: "all 0.22s", animation: "slideUp 0.25s ease both" }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "15px", fontWeight: 600, color: included ? "#F5ECD7" : "rgba(245,236,215,0.55)", marginBottom: "4px" }}>{act.name}</div>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginBottom: "5px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.35)", letterSpacing: "0.08em" }}>{ti} {act.timeSlot}</span>
                    <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", padding: "1px 7px", borderRadius: "2px", background: `${c}12`, color: c, border: `1px solid ${c}25` }}>{act.cat}</span>
                    <span style={{ fontFamily: "Cinzel", fontSize: "10px", color: act.cost === 0 ? "#22c55e" : "#C8972B" }}>{act.cost === 0 ? "Free" : fmt(act.cost)}</span>
                    {act.dur && <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.25)" }}>~{act.dur}h</span>}
                    <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.3)" }}>★{act.rating}</span>
                </div>
                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.4)", lineHeight: "1.55", borderLeft: `2px solid ${c}25`, paddingLeft: "7px", fontStyle: "italic" }}>💡 {act.tip}</div>
                {!included && !canAfford && <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "#e07070", marginTop: "4px" }}>⚠ Exceeds activity budget</div>}
            </div>
            <button onClick={() => onToggle(act)} style={{ flexShrink: 0, width: "32px", height: "32px", borderRadius: "2px", border: `1.5px solid ${included ? c : "rgba(200,151,43,0.2)"}`, background: included ? `${c}20` : "transparent", color: included ? c : "rgba(200,151,43,0.35)", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center", animation: included ? "glow 2s ease-in-out infinite" : "none" }}>
                {included ? "✓" : "＋"}
            </button>
        </div>
    );
}

// ─── HOTEL CARD ───────────────────────────────────────────────────────────────
function HotelCard({ hotel, selected, selectedPkg, onSelect, dpd }) {
    const [open, setOpen] = useState(false);
    const tm = TIER_META[hotel.tier] || TIER_META.mid;
    const tc = tm.color;
    const currentPkg = selected ? selectedPkg : hotel.packages?.[0];
    const displayPrice = currentPkg?.price || hotel.packages?.[0]?.price || 0;

    return (
        <div className="card-hover" style={{ marginBottom: "10px", borderRadius: "2px", overflow: "hidden", border: `1px solid ${selected ? "rgba(200,151,43,0.45)" : tc + "20"}`, background: selected ? "rgba(200,151,43,0.07)" : "rgba(245,236,215,0.02)", transition: "all 0.22s" }}>
            {hotel.recommended && (
                <div style={{ background: `linear-gradient(90deg,${tc}20,transparent)`, padding: "4px 14px", display: "flex", alignItems: "center", gap: "6px", borderBottom: `1px solid ${tc}15` }}>
                    <span style={{ fontSize: "10px" }}>❈</span>
                    <span style={{ fontFamily: "Cinzel", fontSize: "9px", letterSpacing: "1.5px", color: tc }}>HATI RECOMMENDS</span>
                </div>
            )}
            <div onClick={() => setOpen(!open)} style={{ padding: "14px", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "11px" }}>
                    <div style={{ fontSize: "28px", flexShrink: 0, width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px", background: "rgba(200,151,43,0.06)", border: "1px solid rgba(200,151,43,0.12)" }}>{hotel.emoji || "🏨"}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "16px", fontWeight: 600, color: "#F5ECD7", marginBottom: "3px" }}>{hotel.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px", flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", padding: "2px 8px", borderRadius: "2px", background: `${tc}15`, color: tc, border: `1px solid ${tc}25`, display: "flex", alignItems: "center", gap: "3px" }}>{tm.icon} {tm.label}</span>
                            <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.3)" }}>{hotel.stars}★</span>
                            <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", padding: "1px 6px", borderRadius: "2px", background: "rgba(245,236,215,0.04)", color: "rgba(245,236,215,0.35)", letterSpacing: "0.06em" }}>{tm.badge}</span>
                        </div>
                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.4)", fontStyle: "italic", lineHeight: "1.5" }}>{hotel.note}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0, minWidth: "80px" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: "13px", color: selected ? "#C8972B" : tc }}>{fmt(displayPrice)}</div>
                        <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.28)" }}>/ night</div>
                        {dpd > 1 && <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.22)", marginTop: "2px" }}>{fmt(displayPrice * dpd)} total</div>}
                        {selected && <div style={{ color: "#22c55e", fontSize: "12px", marginTop: "3px" }}>✓ booked</div>}
                        <div style={{ color: "rgba(200,151,43,0.25)", fontSize: "11px", marginTop: "5px" }}>{open ? "▲" : "▼"}</div>
                    </div>
                </div>
            </div>

            {open && (
                <div style={{ borderTop: "1px solid rgba(200,151,43,0.08)" }}>
                    <div style={{ padding: "12px 14px" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: "8px", letterSpacing: "2px", color: "rgba(200,151,43,0.3)", marginBottom: "7px" }}>AMENITIES</div>
                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                            {hotel.amenities.map(a => (
                                <span key={a} style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", padding: "3px 8px", borderRadius: "2px", background: "rgba(200,151,43,0.05)", color: "rgba(245,236,215,0.45)", border: "1px solid rgba(200,151,43,0.12)" }}>{a}</span>
                            ))}
                        </div>
                    </div>
                    <div style={{ padding: "0 14px 14px" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: "8px", letterSpacing: "2px", color: "rgba(200,151,43,0.3)", marginBottom: "9px" }}>PACKAGES — choose one</div>
                        <div style={{ display: "grid", gap: "7px" }}>
                            {hotel.packages.map((pkg, i) => {
                                const pkgSel = selected && selectedPkg?.id === pkg.id;
                                const isPopular = i === 1 && hotel.packages.length > 2;
                                const isBest = i === hotel.packages.length - 1 && hotel.packages.length > 2;
                                return (
                                    <div key={pkg.id} onClick={() => onSelect(hotel, pkg)} style={{ padding: "11px 13px", borderRadius: "2px", cursor: "pointer", background: pkgSel ? "rgba(200,151,43,0.12)" : "rgba(245,236,215,0.03)", border: `1px solid ${pkgSel ? "rgba(200,151,43,0.45)" : "rgba(200,151,43,0.1)"}`, transition: "all 0.18s", position: "relative" }}>
                                        {isPopular && <span style={{ position: "absolute", top: "-6px", right: "10px", fontFamily: "Cinzel", fontSize: "8px", padding: "2px 8px", borderRadius: "2px", background: "rgba(22,163,74,0.15)", color: "#22c55e", border: "1px solid rgba(22,163,74,0.25)" }}>Most Popular</span>}
                                        {isBest && <span style={{ position: "absolute", top: "-6px", right: "10px", fontFamily: "Cinzel", fontSize: "8px", padding: "2px 8px", borderRadius: "2px", background: `${tc}18`, color: tc, border: `1px solid ${tc}30` }}>Best Value</span>}
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "6px" }}>
                                                    <span style={{ fontSize: "16px" }}>{pkg.icon}</span>
                                                    <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "13px", fontWeight: 600, color: pkgSel ? "#C8972B" : "#F5ECD7" }}>{pkg.name}</span>
                                                </div>
                                                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                    {pkg.includes.map(inc => (
                                                        <span key={inc} style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.42)", display: "flex", alignItems: "center", gap: "3px" }}>
                                                            <span style={{ color: "#22c55e", fontSize: "9px" }}>✓</span>{inc}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                <div style={{ fontFamily: "Cinzel", fontSize: "14px", color: pkgSel ? "#C8972B" : tc }}>{fmt(pkg.price)}</div>
                                                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.28)" }}>/ night</div>
                                                {dpd > 1 && <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.2)", marginTop: "1px" }}>{fmt(pkg.price * dpd)} total</div>}
                                                {pkgSel && <div style={{ color: "#22c55e", fontSize: "13px", marginTop: "3px" }}>✓</div>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── GUIDE CARD ───────────────────────────────────────────────────────────────
function GuideCard({ guide, selected, onSelect }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="card-hover" style={{ marginBottom: "8px", borderRadius: "2px", border: `1px solid ${selected ? "rgba(200,151,43,0.45)" : "rgba(200,151,43,0.1)"}`, background: selected ? "rgba(200,151,43,0.07)" : "rgba(245,236,215,0.02)", overflow: "hidden", transition: "all 0.22s" }}>
            <div onClick={() => setOpen(!open)} style={{ padding: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "11px" }}>
                <div style={{ fontSize: "26px", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "2px", background: "rgba(200,151,43,0.06)", border: "1px solid rgba(200,151,43,0.15)", flexShrink: 0 }}>{guide.avatar}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "16px", fontWeight: 600, color: "#F5ECD7", marginBottom: "2px" }}>{guide.name}</div>
                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.4)", marginBottom: "3px", letterSpacing: "0.06em" }}>{guide.speciality}</div>
                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "#C8972B" }}>
                        {"★".repeat(Math.round(guide.rating))} <span style={{ color: "rgba(245,236,215,0.35)" }}>{guide.rating} · {guide.reviews} reviews</span>
                    </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontFamily: "Cinzel", fontSize: "12px", color: "#C8972B" }}>{fmt(guide.price)}</div>
                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.3)" }}>/ day</div>
                    <div style={{ fontSize: "11px", color: "rgba(200,151,43,0.3)", marginTop: "4px" }}>{open ? "▲" : "▼"}</div>
                </div>
            </div>
            {open && (
                <div style={{ padding: "0 13px 13px", borderTop: "1px solid rgba(200,151,43,0.08)" }}>
                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "12px", color: "rgba(245,236,215,0.55)", fontStyle: "italic", margin: "10px 0", lineHeight: "1.6" }}>"{guide.bio}"</div>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "7px" }}>
                        {guide.langs.map(l => <span key={l} style={{ padding: "2px 8px", borderRadius: "2px", background: "rgba(200,151,43,0.06)", color: "rgba(245,236,215,0.45)", fontFamily: "'Crimson Pro',serif", fontSize: "10px", border: "1px solid rgba(200,151,43,0.12)" }}>🌐 {l}</span>)}
                    </div>
                    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginBottom: "12px" }}>
                        {guide.tours.map(t => <span key={t} style={{ padding: "2px 8px", borderRadius: "2px", background: "rgba(139,26,26,0.12)", color: "#C8972B", fontFamily: "'Crimson Pro',serif", fontSize: "10px", border: "1px solid rgba(200,151,43,0.2)" }}>📍 {t}</span>)}
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onSelect(guide); }} style={{ width: "100%", padding: "10px", borderRadius: "2px", background: selected ? "rgba(200,151,43,0.15)" : "linear-gradient(135deg,#8B1A1A,#C8972B)", color: "#F5ECD7", fontFamily: "Cinzel", fontSize: "11px", letterSpacing: "1px", border: "1px solid rgba(200,151,43,0.3)" }}>
                        {selected ? "❈ Booked!" : "Book This Guide"}
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── EXPERIENCE RATING ────────────────────────────────────────────────────────
function ExpCard({ act }) {
    const [r, setR] = useState(null);
    const [note, setNote] = useState("");
    const [done, setDone] = useState(false);
    if (done) return (
        <div style={{ padding: "10px 13px", borderRadius: "2px", background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.18)", marginBottom: "7px", fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.5)" }}>
            ✓ <strong style={{ color: "rgba(245,236,215,0.7)" }}>{act.name}</strong> — logged. Thank you! 🙏
        </div>
    );
    return (
        <div style={{ padding: "13px", borderRadius: "2px", background: "rgba(245,236,215,0.02)", border: "1px solid rgba(200,151,43,0.1)", marginBottom: "8px" }}>
            <div style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "14px", fontWeight: 600, color: "#F5ECD7", marginBottom: "8px" }}>{act.name}</div>
            {!r ? (
                <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                    {["😍 Loved it", "😊 Good", "😐 Okay", "😕 Meh", "💔 Skip it"].map(x => (
                        <button key={x} onClick={() => setR(x)} style={{ padding: "5px 10px", borderRadius: "2px", border: "1px solid rgba(200,151,43,0.15)", background: "rgba(200,151,43,0.04)", color: "rgba(245,236,215,0.6)", fontFamily: "'Crimson Pro',serif", fontSize: "10px" }}>{x}</button>
                    ))}
                </div>
            ) : (
                <div>
                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.5)", marginBottom: "7px" }}>Rated: <strong style={{ color: "#F5ECD7" }}>{r}</strong></div>
                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Share a tip for future travelers..." style={{ width: "100%", background: "rgba(245,236,215,0.03)", border: "1px solid rgba(200,151,43,0.12)", borderRadius: "2px", padding: "8px 11px", color: "#F5ECD7", fontFamily: "'Crimson Pro',serif", fontSize: "11px", resize: "none", height: "55px" }} />
                    <button onClick={() => setDone(true)} style={{ marginTop: "6px", padding: "7px 16px", borderRadius: "2px", background: "linear-gradient(135deg,#8B1A1A,#C8972B)", color: "#F5ECD7", fontFamily: "Cinzel", fontSize: "10px", fontWeight: 500, border: "1px solid rgba(200,151,43,0.3)" }}>Share 🙏</button>
                </div>
            )}
        </div>
    );
}

// ─── LAYOUT WRAPPERS ──────────────────────────────────────────────────────────
function Wrap({ children }) {
    return (
        <div style={{ minHeight: "100vh", background: "#1A0A00", position: "relative", overflowX: "hidden" }}>
            <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", top: "-15%", left: "-10%", width: "45%", height: "45%", background: "radial-gradient(circle,rgba(200,151,43,0.06) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "fixed", bottom: "-15%", right: "-10%", width: "45%", height: "45%", background: "radial-gradient(circle,rgba(139,26,26,0.06) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ maxWidth: "560px", margin: "0 auto", padding: "22px 16px 80px", position: "relative", zIndex: 1 }}>{children}</div>
        </div>
    );
}

function Logo({ sm }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: sm ? 0 : "20px" }}>
            <span style={{ fontSize: sm ? "20px" : "28px", display: "inline-block", animation: "float 4s ease-in-out infinite" }}>🐘</span>
            <span style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: sm ? "16px" : "24px", letterSpacing: "4px", background: "linear-gradient(135deg,#8B1A1A,#C8972B,#E8A020)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HATI</span>
        </div>
    );
}

function Btn({ onClick, children, disabled, ghost, small }) {
    return (
        <button onClick={onClick} disabled={disabled} style={{ width: "100%", padding: small ? "11px" : "15px", borderRadius: "2px", border: ghost ? "1px solid rgba(200,151,43,0.35)" : "1px solid rgba(200,151,43,0.2)", background: ghost ? "transparent" : disabled ? "rgba(245,236,215,0.04)" : "linear-gradient(135deg,#8B1A1A,#C8972B)", color: ghost ? "#C8972B" : disabled ? "rgba(245,236,215,0.2)" : "#F5ECD7", fontFamily: "Cinzel", fontSize: small ? "10px" : "12px", letterSpacing: "1.5px", cursor: disabled ? "not-allowed" : "pointer", boxShadow: (!disabled && !ghost) ? "0 4px 18px rgba(139,26,26,0.2)" : "none" }}>
            {children}
        </button>
    );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function PlannerPage() {
    const [screen, setScreen] = useState("welcome");
    const [name, setName] = useState("");
    const [nameInput, setNameInput] = useState("");
    const [days, setDays] = useState(7);
    const [budget, setBudget] = useState(50000);
    const [districts, setDistricts] = useState([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [completed, setCompleted] = useState([]);
    const [spentHistory, setSpentHistory] = useState([]);

    const [included, setIncluded] = useState({});
    const [hotels, setHotels] = useState({});
    const [hotelPkgs, setHotelPkgs] = useState({});
    const [guides, setGuides] = useState({});
    const [tab, setTab] = useState("activities");
    const [tierFilter, setTierFilter] = useState("all");
    const [travelStyle, setTravelStyle] = useState("");
    const [customExpenses, setCustomExpenses] = useState({});
    const [customLabel, setCustomLabel] = useState("");
    const [customAmount, setCustomAmount] = useState("");
    const [unlockMode, setUnlockMode] = useState(false);
    const [extraD, setExtraD] = useState("");

    const cur = districts[currentIdx];
    const curMeta = cur ? DISTRICTS_META[cur] : null;

    const dpd = Math.max(1, Math.floor(days / Math.max(districts.length, 1)));
    const alreadySpent = spentHistory.reduce((s, h) => s + h.total, 0);
    const remainingDistricts = districts.length - spentHistory.length;
    const remainingBudget = Math.max(0, budget - alreadySpent);
    const bdPerD = remainingDistricts > 0 ? Math.floor(remainingBudget / remainingDistricts) : 0;
    const cumulativeDrift = alreadySpent - spentHistory.reduce((s, h) => s + h.allowance, 0);

    const hotelObj = hotels[cur];
    const hotelPkg = hotelPkgs[cur];
    const hotelNight = hotelPkg ? hotelPkg.price : hotelObj ? (hotelObj.packages?.[0]?.price || 0) : 0;
    const hotelTotal = hotelNight * dpd;
    const actBudget = Math.max(0, bdPerD - hotelTotal);

    useEffect(() => {
        if (!cur) return;
        const pool = ACTIVITIES.filter(a => a.district === cur);
        const ks = knapsack(actBudget, pool);
        setIncluded(prev => {
            if (prev[cur] !== undefined) return prev;
            return { ...prev, [cur]: new Set(ks.map(a => a.id)) };
        });
    }, [cur, hotelTotal, bdPerD]);

    const resetAndReoptimise = useCallback(() => {
        if (!cur) return;
        const pool = ACTIVITIES.filter(a => a.district === cur);
        const ks = knapsack(actBudget, pool);
        setIncluded(prev => ({ ...prev, [cur]: new Set(ks.map(a => a.id)) }));
    }, [cur, actBudget]);

    const curIncluded = included[cur] || new Set();
    const allPool = cur ? [...ACTIVITIES.filter(a => a.district === cur), ...MISC] : [];
    const includedList = allPool.filter(a => curIncluded.has(a.id));
    const actTotal = includedList.reduce((s, a) => s + a.cost, 0);
    const customTotal = (customExpenses[cur] || []).reduce((s, e) => s + e.amount, 0);
    const distTotal = actTotal + hotelTotal + customTotal;
    const overBudget = distTotal > bdPerD;
    const distSaving = bdPerD - distTotal;

    function toggle(act) {
        setIncluded(prev => {
            const s = new Set(prev[cur] || []);
            s.has(act.id) ? s.delete(act.id) : s.add(act.id);
            return { ...prev, [cur]: s };
        });
    }

    const totalSpentSoFar = alreadySpent + distTotal;
    const remaining = Math.max(0, budget - totalSpentSoFar);
    const canUnlock = remaining > 12000;

    function completeDistrict() {
        setCompleted(prev => [...prev, cur]);
        setSpentHistory(prev => [...prev, { district: cur, total: distTotal, allowance: bdPerD, actTotal, hotelTotal, custom: (customExpenses[cur] || []) }]);
        if (currentIdx < districts.length - 1) { setCurrentIdx(i => i + 1); setTab("activities"); }
        else setScreen("review");
    }

    function selectHotelAndPkg(ho, pkg) {
        setHotels(prev => ({ ...prev, [cur]: ho }));
        setHotelPkgs(prev => ({ ...prev, [cur]: pkg }));
        const newActBudget = Math.max(0, bdPerD - pkg.price * dpd);
        const pool = ACTIVITIES.filter(a => a.district === cur);
        const ks = knapsack(newActBudget, pool);
        setIncluded(prev => ({ ...prev, [cur]: new Set(ks.map(a => a.id)) }));
    }

    // ── WELCOME ────────────────────────────────────────────────────────────────
    if (screen === "welcome") return (
        <Wrap>
            <div style={{ textAlign: "center", paddingTop: "8vh" }}>
                <div style={{ fontSize: "60px", marginBottom: "10px", display: "inline-block", animation: "float 4s ease-in-out infinite" }}>🐘</div>
                <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "44px", fontWeight: 600, letterSpacing: "6px", background: "linear-gradient(135deg,#8B1A1A 0%,#C8972B 45%,#E8A020 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "5px" }}>HATI</div>
                <div style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "16px", color: "rgba(245,236,215,0.3)", letterSpacing: "4px", fontStyle: "italic", marginBottom: "5px" }}>Your Nepal Journey Planner</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "0 auto 28px" }}>
                    <div style={{ height: 1, width: 32, background: "rgba(200,151,43,0.25)" }}></div>
                    <span style={{ color: "rgba(200,151,43,0.3)", fontSize: 11 }}>❈</span>
                    <div style={{ height: 1, width: 32, background: "rgba(200,151,43,0.25)" }}></div>
                </div>
                <div style={{ marginBottom: "24px", textAlign: "left" }}>
                    <Bubble from="hati" text={`${greet()}, traveler! I'm HATI — Himalayan Adaptive Travel Intelligence 🐘\n\nI optimise your itinerary using a knapsack algorithm to pick the highest-rated activities within your budget. Choose from backpacker to platinum hotels, each with multiple packages. Interact with every choice — swap, add, remove, book guides, and chat anytime.\n\nBut first —`} />
                </div>
                <input value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === "Enter" && nameInput.trim() && (setName(nameInput.trim()), setScreen("setup"))}
                    placeholder="What should I call you?"
                    style={{ width: "100%", padding: "15px 20px", borderRadius: "2px", border: "1px solid rgba(200,151,43,0.25)", background: "rgba(245,236,215,0.03)", color: "#F5ECD7", fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "15px", textAlign: "center", marginBottom: "12px" }} />
                <Btn onClick={() => nameInput.trim() && (setName(nameInput.trim()), setScreen("setup"))} disabled={!nameInput.trim()}>BEGIN MY JOURNEY →</Btn>
            </div>
        </Wrap>
    );

    // ── SETUP ──────────────────────────────────────────────────────────────────
    if (screen === "setup") return (
        <Wrap>
            <Logo sm />
            <div style={{ width: "36px", height: "1px", background: "linear-gradient(90deg,transparent,#C8972B,transparent)", margin: "10px 0 18px" }} />
            <div style={{ marginBottom: "20px" }}><Bubble from="hati" text={`Welcome, ${name}! 🙏 Let's shape your journey. I'll use your inputs to optimise the perfect itinerary — you can fine-tune everything once we're on the road.`} /></div>

            {/* Days */}
            <div style={{ marginBottom: "24px" }}>
                <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "18px", color: "#F5ECD7", marginBottom: "4px" }}>How many days?</div>
                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.35)", marginBottom: "12px", letterSpacing: "0.04em" }}>I'll split them evenly across your chosen destinations.</div>
                <div style={{ display: "flex", gap: "7px", flexWrap: "wrap" }}>
                    {[3, 5, 7, 10, 14, 21].map(d => (
                        <button key={d} onClick={() => setDays(d)} style={{ padding: "9px 17px", borderRadius: "2px", border: `1px solid ${days === d ? "#C8972B" : "rgba(200,151,43,0.12)"}`, background: days === d ? "rgba(200,151,43,0.12)" : "rgba(245,236,215,0.02)", color: days === d ? "#C8972B" : "rgba(245,236,215,0.45)", fontFamily: "'Crimson Pro',serif", fontSize: "13px" }}>
                            {d} days
                        </button>
                    ))}
                </div>
            </div>

            {/* Budget */}
            <div style={{ marginBottom: "28px" }}>
                <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "18px", color: "#F5ECD7", marginBottom: "2px" }}>Total budget <span style={{ fontSize: "13px", color: "rgba(245,236,215,0.3)" }}>(NPR, flights excluded)</span></div>
                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.35)", marginBottom: "14px" }}>I'll allocate across hotels and activities per stop.</div>
                <input type="range" min={10000} max={1000000} step={5000} value={budget} onChange={e => setBudget(+e.target.value)} style={{ marginBottom: "10px" }} />
                <div style={{ textAlign: "center", fontFamily: "Cinzel", fontSize: "24px", color: "#C8972B" }}>{fmt(budget)}</div>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.2)", marginTop: "4px" }}>
                    <span>NPR 10k minimum</span><span>Sky's the limit</span>
                </div>
            </div>

            {/* Travel style */}
            <div style={{ marginBottom: "28px" }}>
                <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "18px", color: "#F5ECD7", marginBottom: "4px" }}>How do you travel?</div>
                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.35)", marginBottom: "12px" }}>Shapes hotel and activity recommendations.</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {[
                        { id: "explorer", icon: "🧗", label: "Explorer", desc: "Adventure first, comfort second" },
                        { id: "cultural", icon: "🛕", label: "Cultural", desc: "History, art, temples, stories" },
                        { id: "foodie", icon: "🍜", label: "Foodie", desc: "Eat everything, find hidden spots" },
                        { id: "luxury", icon: "✨", label: "Luxe", desc: "Best hotels, curated experiences" },
                        { id: "budget", icon: "🎒", label: "Budget", desc: "Stretch every rupee, live locally" },
                        { id: "wellness", icon: "🧘", label: "Wellness", desc: "Slow travel, yoga, mindfulness" },
                    ].map(s => (
                        <div key={s.id} onClick={() => setTravelStyle(s.id)} style={{ padding: "13px", borderRadius: "2px", cursor: "pointer", background: travelStyle === s.id ? "rgba(200,151,43,0.1)" : "rgba(245,236,215,0.02)", border: `1px solid ${travelStyle === s.id ? "rgba(200,151,43,0.45)" : "rgba(200,151,43,0.1)"}`, transition: "all 0.2s" }}>
                            <div style={{ fontSize: "22px", marginBottom: "5px" }}>{s.icon}</div>
                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "12px", fontWeight: 600, color: travelStyle === s.id ? "#C8972B" : "#F5ECD7", marginBottom: "2px" }}>{s.label}</div>
                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.35)" }}>{s.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {days > 0 && budget > 0 && (
                <div style={{ marginBottom: "18px", padding: "14px", borderRadius: "2px", background: "rgba(200,151,43,0.05)", border: "1px solid rgba(200,151,43,0.15)" }}>
                    <div style={{ fontFamily: "Cinzel", fontSize: "9px", letterSpacing: "2px", color: "rgba(200,151,43,0.3)", marginBottom: "10px" }}>YOUR JOURNEY AT A GLANCE</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", textAlign: "center" }}>
                        <div><div style={{ fontFamily: "Cinzel", fontSize: "17px", color: "#C8972B" }}>{days}</div><div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.32)" }}>days</div></div>
                        <div><div style={{ fontFamily: "Cinzel", fontSize: "17px", color: "#C8972B" }}>{fmt(Math.floor(budget / days))}</div><div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.32)" }}>per day</div></div>
                        <div><div style={{ fontFamily: "Cinzel", fontSize: "15px", color: "#C8972B" }}>{travelStyle || "–"}</div><div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.32)" }}>style</div></div>
                    </div>
                </div>
            )}
            <Btn onClick={() => setScreen("destinations")}>CHOOSE MY DESTINATIONS →</Btn>
        </Wrap>
    );

    // ── DESTINATIONS ──────────────────────────────────────────────────────────
    if (screen === "destinations") return (
        <Wrap>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <Logo sm />
                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.28)", letterSpacing: "0.06em" }}>{days} days · {fmt(budget)}</div>
            </div>
            <div style={{ marginBottom: "14px" }}>
                <Bubble from="hati" text={`Pick the places your heart is drawn to, ${name} 🗺️\n\nYou can mix culture, adventure, nature, and wilderness. Once you start the journey, new destinations unlock only when budget allows.`} />
            </div>

            {districts.length > 0 && (
                <div style={{ marginBottom: "14px", padding: "11px 13px", borderRadius: "2px", background: "rgba(200,151,43,0.05)", border: "1px solid rgba(200,151,43,0.15)" }}>
                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.35)", marginBottom: "6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Your route · ~{Math.max(1, Math.floor(days / districts.length))} day{Math.max(1, Math.floor(days / districts.length)) > 1 ? "s" : ""} each</div>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                        {districts.map(d => {
                            const m = DISTRICTS_META[d];
                            return (
                                <div key={d} onClick={() => setDistricts(prev => prev.filter(x => x !== d))} style={{ display: "flex", alignItems: "center", gap: "3px", padding: "3px 10px", borderRadius: "2px", background: `${m.color}15`, border: `1px solid ${m.color}30`, fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: m.color, cursor: "pointer" }}>
                                    {m.emoji} {m.label} <span style={{ opacity: .4, marginLeft: "2px" }}>✕</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px", marginBottom: "18px" }}>
                {Object.entries(DISTRICTS_META).map(([key, meta]) => {
                    const sel = districts.includes(key);
                    return (
                        <div key={key} onClick={() => setDistricts(prev => sel ? prev.filter(x => x !== key) : [...prev, key])} className="card-hover" style={{ borderRadius: "2px", padding: "13px", cursor: "pointer", position: "relative", background: sel ? `${meta.color}10` : "rgba(245,236,215,0.02)", border: `1px solid ${sel ? meta.color : "rgba(200,151,43,0.1)"}`, transform: sel ? "scale(1.02)" : "scale(1)", transition: "all 0.2s" }}>
                            {sel && <div style={{ position: "absolute", top: 7, right: 8, fontSize: "12px", color: meta.color }}>✓</div>}
                            <div style={{ fontSize: "24px", marginBottom: "5px" }}>{meta.emoji}</div>
                            <div style={{ fontFamily: "Cinzel", fontSize: "11px", color: sel ? meta.color : "rgba(245,236,215,0.85)", marginBottom: "2px" }}>{meta.label}</div>
                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.35)", marginBottom: "5px", fontStyle: "italic" }}>{meta.tagline}</div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.25)", letterSpacing: "0.08em" }}>{meta.region}</span>
                                <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.22)" }}>{meta.season}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
            <Btn onClick={() => { if (districts.length > 0) { setScreen("active"); setTab("activities"); } }} disabled={districts.length === 0}>
                {districts.length === 0 ? "SELECT AT LEAST ONE DESTINATION" : "LOCK & START JOURNEY ❈"}
            </Btn>
            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.18)", textAlign: "center", marginTop: "8px", letterSpacing: "0.06em" }}>Destinations lock once the journey begins. New ones unlock mid-trip if budget allows.</div>
        </Wrap>
    );

    // ── ACTIVE JOURNEY ─────────────────────────────────────────────────────────
    if (screen === "active" && curMeta) {
        const c = curMeta.color;
        const distActs = ACTIVITIES.filter(a => a.district === cur);
        const incBySlot = (slot) => byTime(includedList).filter(a => a.timeSlot === slot && a.district === cur);
        const incMisc = includedList.filter(a => MISC.find(m => m.id === a.id));
        const budgetPct = Math.min(100, distTotal / bdPerD * 100);

        return (
            <div style={{ minHeight: "100vh", background: "#1A0A00", display: "flex", flexDirection: "column" }}>
                <div style={{ position: "fixed", inset: 0, backgroundImage: GRAIN, pointerEvents: "none", zIndex: 0 }} />

                {/* Sticky header */}
                <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(26,10,0,0.95)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(200,151,43,0.15)", padding: "10px 16px" }}>
                    <div style={{ maxWidth: "560px", margin: "0 auto" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "8px" }}>
                            <span style={{ fontSize: "18px", animation: "float 4s ease-in-out infinite", display: "inline-block" }}>🐘</span>
                            <span style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "14px", letterSpacing: "3px", background: "linear-gradient(135deg,#8B1A1A,#C8972B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>HATI</span>
                            <div style={{ marginLeft: "auto", display: "flex", gap: "4px", alignItems: "center" }}>
                                {districts.map((d, i) => (
                                    <div key={d} title={DISTRICTS_META[d]?.label} style={{ width: i === currentIdx ? 18 : 7, height: "7px", borderRadius: "2px", background: i < currentIdx ? "#22c55e" : i === currentIdx ? c : "rgba(200,151,43,0.1)", transition: "all 0.3s" }} />
                                ))}
                            </div>
                        </div>
                        <div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                                <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.3)" }}>
                                    {curMeta.emoji} {curMeta.label} · {dpd}d
                                    {hotelObj ? ` · 🏨 ${fmt(hotelTotal)}` : ""}
                                    {actTotal > 0 ? ` · 🎭 ${fmt(actTotal)}` : ""}
                                    {customTotal > 0 ? ` · 🧾 ${fmt(customTotal)}` : ""}
                                </span>
                                <span style={{ fontFamily: "Cinzel", fontSize: "10px", color: overBudget ? "#e07070" : c }}>{fmt(distTotal)} / {fmt(bdPerD)}</span>
                            </div>
                            <div style={{ height: "3px", borderRadius: "2px", background: "rgba(245,236,215,0.06)" }}>
                                <div style={{ height: "100%", borderRadius: "2px", width: `${budgetPct}%`, background: overBudget ? "linear-gradient(90deg,#8B1A1A,#e07070)" : `linear-gradient(90deg,#8B1A1A,${c})`, transition: "width 0.35s ease" }} />
                            </div>
                            {cumulativeDrift !== 0 && (
                                <div style={{ marginTop: "4px", fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: cumulativeDrift > 0 ? "#e07070" : "#4ade80", letterSpacing: "0.04em" }}>
                                    {cumulativeDrift > 0
                                        ? `⚠ Previous stops overspent by ${fmt(cumulativeDrift)} — this stop's budget was reduced`
                                        : `✓ Previous stops saved ${fmt(-cumulativeDrift)} — this stop gets more to spend`}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div style={{ maxWidth: "560px", margin: "0 auto", width: "100%", flex: 1, overflowY: "auto", position: "relative", zIndex: 1 }}>

                    {/* Map + title */}
                    <div style={{ padding: "12px 16px 0" }}>
                        <MapView district={cur} />
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
                            <span style={{ fontSize: "22px" }}>{curMeta.emoji}</span>
                            <div>
                                <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "19px", color: "#F5ECD7" }}>{curMeta.label}</div>
                                <div style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "12px", color: "rgba(245,236,215,0.4)", fontStyle: "italic" }}>{curMeta.tagline}</div>
                            </div>
                            <div style={{ marginLeft: "auto", display: "flex", gap: "6px", flexDirection: "column", alignItems: "flex-end" }}>
                                {guides[cur] && <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "#22c55e" }}>🧭 {guides[cur].name.split(" ")[0]}</div>}
                                {hotelObj && <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.4)" }}>{hotelObj.emoji} {hotelObj.name.split(" ").slice(0, 2).join(" ")}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ padding: "10px 16px 0" }}>
                        <div style={{ display: "flex", borderBottom: "1px solid rgba(200,151,43,0.1)" }}>
                            {[
                                { key: "activities", label: "Planned" },
                                { key: "misc", label: "Add-Ons" },
                                { key: "hotels", label: "Hotel" },
                                { key: "guides", label: "Guide" },
                                { key: "chat", label: "Chat" },
                            ].map(t => (
                                <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: "9px 2px", border: "none", borderBottom: `2px solid ${tab === t.key ? c : "transparent"}`, background: "transparent", color: tab === t.key ? c : "rgba(245,236,215,0.26)", fontFamily: "Cinzel", fontSize: "8.5px", letterSpacing: "0.8px", textTransform: "uppercase", transition: "all 0.2s" }}>
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ padding: "14px 16px 32px" }}>

                        {/* ── ACTIVITIES ── */}
                        {tab === "activities" && (
                            <div>
                                {overBudget && (
                                    <div style={{ padding: "10px 13px", borderRadius: "2px", background: "rgba(139,26,26,0.12)", border: "1px solid rgba(139,26,26,0.3)", marginBottom: "12px", fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "#e07070" }}>
                                        ⚠ Over by {fmt(distTotal - bdPerD)} this stop. Remove activities or choose a cheaper hotel package — any overspend reduces the budget for your remaining stops.
                                    </div>
                                )}
                                {!overBudget && distSaving > 0 && spentHistory.length > 0 && (
                                    <div style={{ padding: "9px 13px", borderRadius: "2px", background: "rgba(74,222,128,0.06)", border: "1px solid rgba(74,222,128,0.18)", marginBottom: "12px", fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "#4ade80" }}>
                                        ✓ Saving {fmt(distSaving)} here — that rolls forward to boost your next stop's budget.
                                    </div>
                                )}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.42)" }}>
                                        {includedList.filter(a => a.district === cur).length} activities · {fmt(actTotal)} of {fmt(actBudget)} activity budget
                                        {hotelObj && <span style={{ color: "rgba(245,236,215,0.28)" }}> · Hotel {fmt(hotelTotal)}</span>}
                                    </div>
                                    <button onClick={resetAndReoptimise} style={{ padding: "4px 10px", borderRadius: "2px", border: "1px solid rgba(200,151,43,0.25)", background: "rgba(200,151,43,0.06)", color: "#C8972B", fontFamily: "'Crimson Pro',serif", fontSize: "9px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                                        ↺ Re-optimise
                                    </button>
                                </div>

                                {includedList.length === 0 && (
                                    <div style={{ textAlign: "center", padding: "30px", color: "rgba(245,236,215,0.2)", fontFamily: "'Crimson Pro',serif", fontSize: "12px", fontStyle: "italic" }}>No activities selected. Tap ＋ below or switch to Add-Ons.</div>
                                )}

                                {["morning", "afternoon", "evening"].map(slot => {
                                    const sl = incBySlot(slot);
                                    if (!sl.length) return null;
                                    const ico = { morning: "🌅 Morning", afternoon: "☀️ Afternoon", evening: "🌙 Evening" }[slot];
                                    return (
                                        <div key={slot} style={{ marginBottom: "16px" }}>
                                            <div style={{ fontFamily: "Cinzel", fontSize: "9px", letterSpacing: "2px", color: "rgba(200,151,43,0.3)", marginBottom: "8px" }}>{ico}</div>
                                            {sl.map(a => <ActCard key={a.id} act={a} included={true} onToggle={toggle} canAfford={true} />)}
                                        </div>
                                    );
                                })}

                                {incMisc.length > 0 && (
                                    <div style={{ marginBottom: "16px" }}>
                                        <div style={{ fontFamily: "Cinzel", fontSize: "9px", letterSpacing: "2px", color: "rgba(200,151,43,0.3)", marginBottom: "8px" }}>❈ ADD-ONS INCLUDED</div>
                                        {byTime(incMisc).map(a => <ActCard key={a.id} act={a} included={true} onToggle={toggle} canAfford={true} />)}
                                    </div>
                                )}

                                {(() => {
                                    const notIncD = distActs.filter(a => !curIncluded.has(a.id));
                                    if (!notIncD.length) return null;
                                    return (
                                        <div>
                                            <div style={{ fontFamily: "Cinzel", fontSize: "9px", letterSpacing: "2px", color: "rgba(245,236,215,0.15)", marginBottom: "8px" }}>NOT INCLUDED — tap ＋ to add</div>
                                            {notIncD.map(a => {
                                                const canAfford = actTotal + a.cost <= actBudget;
                                                return <ActCard key={a.id} act={a} included={false} onToggle={toggle} canAfford={canAfford} />;
                                            })}
                                        </div>
                                    );
                                })()}

                                {/* Extra purchases */}
                                <div style={{ marginTop: "20px", padding: "15px", borderRadius: "2px", background: "rgba(245,236,215,0.02)", border: "1px solid rgba(200,151,43,0.1)" }}>
                                    <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "16px", color: "#F5ECD7", marginBottom: "4px" }}>Extra Purchases</div>
                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.36)", marginBottom: "13px", fontStyle: "italic" }}>Souvenirs, meals, rickshaws, tips — counts against your budget.</div>
                                    {(customExpenses[cur] || []).length > 0 && (
                                        <div style={{ marginBottom: "11px" }}>
                                            {(customExpenses[cur] || []).map((e, i) => (
                                                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 10px", borderRadius: "2px", background: "rgba(245,236,215,0.03)", marginBottom: "5px", border: "1px solid rgba(200,151,43,0.08)" }}>
                                                    <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "12px", color: "rgba(245,236,215,0.65)" }}>{e.label}</span>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                        <span style={{ fontFamily: "Cinzel", fontSize: "11px", color: "#C8972B" }}>{fmt(e.amount)}</span>
                                                        <button onClick={() => setCustomExpenses(prev => ({ ...prev, [cur]: (prev[cur] || []).filter((_, j) => j !== i) }))} style={{ width: "20px", height: "20px", borderRadius: "2px", border: "1px solid rgba(200,151,43,0.15)", background: "transparent", color: "rgba(245,236,215,0.3)", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                                                    </div>
                                                </div>
                                            ))}
                                            <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 10px 0", borderTop: "1px solid rgba(200,151,43,0.08)", marginTop: "5px" }}>
                                                <span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.3)" }}>Total extras</span>
                                                <span style={{ fontFamily: "Cinzel", fontSize: "11px", color: "#C8972B" }}>{fmt(customTotal)}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div style={{ display: "flex", gap: "7px" }}>
                                        <input value={customLabel} onChange={e => setCustomLabel(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && customLabel.trim() && +customAmount > 0 && (setCustomExpenses(prev => ({ ...prev, [cur]: [...(prev[cur] || []), { label: customLabel.trim(), amount: +customAmount }] })), setCustomLabel(""), setCustomAmount(""))}
                                            placeholder="e.g. Souvenir, Tea, Rickshaw..."
                                            style={{ flex: 1, padding: "9px 12px", borderRadius: "2px", border: "1px solid rgba(200,151,43,0.12)", background: "rgba(245,236,215,0.02)", color: "#F5ECD7", fontFamily: "'Crimson Pro',serif", fontSize: "12px" }} />
                                        <input value={customAmount} onChange={e => setCustomAmount(e.target.value.replace(/[^0-9]/g, ""))}
                                            onKeyDown={e => e.key === "Enter" && customLabel.trim() && +customAmount > 0 && (setCustomExpenses(prev => ({ ...prev, [cur]: [...(prev[cur] || []), { label: customLabel.trim(), amount: +customAmount }] })), setCustomLabel(""), setCustomAmount(""))}
                                            placeholder="NPR"
                                            style={{ width: "80px", padding: "9px 10px", borderRadius: "2px", border: "1px solid rgba(200,151,43,0.12)", background: "rgba(245,236,215,0.02)", color: "#F5ECD7", fontFamily: "Cinzel", fontSize: "11px", textAlign: "center" }} />
                                        <button onClick={() => { if (customLabel.trim() && +customAmount > 0) { setCustomExpenses(prev => ({ ...prev, [cur]: [...(prev[cur] || []), { label: customLabel.trim(), amount: +customAmount }] })); setCustomLabel(""); setCustomAmount(""); } }}
                                            style={{ width: "36px", height: "36px", borderRadius: "2px", background: "linear-gradient(135deg,#8B1A1A,#C8972B)", color: "#F5ECD7", fontSize: "17px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(200,151,43,0.3)" }}>＋</button>
                                    </div>
                                </div>

                                {/* Complete / unlock */}
                                <div style={{ marginTop: "22px", padding: "16px", borderRadius: "2px", background: `${c}08`, border: `1px solid ${c}18` }}>
                                    <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "16px", color: "#F5ECD7", marginBottom: "5px" }}>Ready to move on?</div>
                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.4)", marginBottom: "6px", fontStyle: "italic" }}>
                                        Mark {curMeta.label} complete to continue.
                                    </div>
                                    {currentIdx < districts.length - 1 && (
                                        <div style={{ padding: "9px 12px", borderRadius: "2px", background: "rgba(245,236,215,0.03)", border: "1px solid rgba(200,151,43,0.1)", marginBottom: "12px", fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.45)" }}>
                                            {distSaving >= 0
                                                ? <><span style={{ color: "#4ade80" }}>✓ {fmt(distSaving)} under budget</span> — your next stop's allocation increases.</>
                                                : <><span style={{ color: "#e07070" }}>⚠ {fmt(-distSaving)} over budget</span> — your next stop's allocation decreases.</>
                                            }
                                            {(() => {
                                                const nextRemaining = budget - (alreadySpent + distTotal);
                                                const nextStops = districts.length - (spentHistory.length + 1);
                                                const nextBdPerD = nextStops > 0 ? Math.floor(nextRemaining / nextStops) : 0;
                                                return nextStops > 0 ? (
                                                    <span style={{ color: "rgba(245,236,215,0.3)" }}> Next stop allowance: <span style={{ color: c, fontFamily: "Cinzel" }}>{fmt(nextBdPerD)}</span></span>
                                                ) : null;
                                            })()}
                                        </div>
                                    )}
                                    <button onClick={completeDistrict} style={{ width: "100%", padding: "13px", borderRadius: "2px", background: "linear-gradient(135deg,#166534,#22c55e)", color: "#F5ECD7", fontFamily: "Cinzel", fontSize: "11px", letterSpacing: "1.5px", border: "1px solid rgba(34,197,94,0.3)" }}>
                                        ✓ {currentIdx < districts.length - 1 ? "COMPLETE & NEXT STOP" : "COMPLETE MY JOURNEY"}
                                    </button>
                                    {canUnlock && !unlockMode && (
                                        <button onClick={() => setUnlockMode(true)} style={{ width: "100%", marginTop: "8px", padding: "11px", borderRadius: "2px", border: "1px solid rgba(200,151,43,0.25)", background: "transparent", color: "#C8972B", fontFamily: "'Crimson Pro',serif", fontSize: "11px", letterSpacing: "0.06em" }}>
                                            🔓 Unlock a new destination ({fmt(Math.round(remaining))} remaining)
                                        </button>
                                    )}
                                    {unlockMode && (
                                        <div style={{ marginTop: "10px", padding: "13px", borderRadius: "2px", background: "rgba(200,151,43,0.05)", border: "1px solid rgba(200,151,43,0.18)" }}>
                                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "12px", color: "rgba(245,236,215,0.6)", marginBottom: "9px" }}>Where would you like to go next?</div>
                                            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "9px" }}>
                                                {Object.entries(DISTRICTS_META).filter(([k]) => !districts.includes(k)).map(([k, m]) => (
                                                    <button key={k} onClick={() => setExtraD(k)} style={{ padding: "5px 10px", borderRadius: "2px", border: `1px solid ${extraD === k ? m.color : "rgba(200,151,43,0.12)"}`, background: extraD === k ? `${m.color}12` : "transparent", color: extraD === k ? m.color : "rgba(245,236,215,0.42)", fontFamily: "'Crimson Pro',serif", fontSize: "11px" }}>
                                                        {m.emoji} {m.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {extraD && (
                                                <button onClick={() => { setDistricts(prev => [...prev, extraD]); setUnlockMode(false); setExtraD(""); }} style={{ width: "100%", padding: "10px", borderRadius: "2px", background: "linear-gradient(135deg,#8B1A1A,#C8972B)", color: "#F5ECD7", fontFamily: "Cinzel", fontSize: "11px", letterSpacing: "1px", border: "1px solid rgba(200,151,43,0.3)" }}>
                                                    ADD {DISTRICTS_META[extraD]?.label?.toUpperCase()}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* ── ADD-ONS ── */}
                        {tab === "misc" && (
                            <div>
                                <div style={{ marginBottom: "12px" }}>
                                    <Bubble from="hati" text={`These flexible add-ons slot into any free moment in ${curMeta.label}. A slow morning, a rest afternoon, or simply wandering. Tap ＋ to include in your plan.`} />
                                </div>
                                {MISC.map(a => <ActCard key={a.id} act={a} included={curIncluded.has(a.id)} onToggle={toggle} canAfford={true} />)}
                            </div>
                        )}

                        {/* ── HOTELS ── */}
                        {tab === "hotels" && (() => {
                            const allHotels = HOTELS[cur] || [];
                            const hotelList = tierFilter === "all" ? allHotels : allHotels.filter(h => h.tier === tierFilter);
                            return (
                                <div>
                                    <div style={{ marginBottom: "12px" }}>
                                        <Bubble from="hati" text={`Pick your stay in ${curMeta.label} 🏨\n\nEach hotel has multiple packages — from Room Only to Full Experience with meals, spa, and transfers. Your choice updates the activity budget live. I've marked my top recommendation with ❈`} />
                                    </div>

                                    {hotelObj && (
                                        <div style={{ marginBottom: "16px", padding: "13px 15px", borderRadius: "2px", background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.2)" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "#22c55e", marginBottom: "3px", letterSpacing: "0.1em", textTransform: "uppercase" }}>✓ Currently booked</div>
                                                    <div style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "16px", fontWeight: 600, color: "#F5ECD7" }}>{hotelObj.name}</div>
                                                    {hotelPkg && (
                                                        <div>
                                                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.45)", marginTop: "2px" }}>{hotelPkg.icon} {hotelPkg.name} package</div>
                                                            <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginTop: "5px" }}>
                                                                {hotelPkg.includes.map(i => (
                                                                    <span key={i} style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.38)", display: "flex", alignItems: "center", gap: "2px" }}><span style={{ color: "#22c55e", fontSize: "9px" }}>✓</span>{i}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                                    <div style={{ fontFamily: "Cinzel", fontSize: "14px", color: "#C8972B" }}>{fmt(hotelNight)}<span style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.3)" }}>/nt</span></div>
                                                    <div style={{ fontFamily: "Cinzel", fontSize: "11px", color: "rgba(245,236,215,0.45)", marginTop: "2px" }}>{fmt(hotelTotal)} total</div>
                                                    <button onClick={() => { setHotels(prev => ({ ...prev, [cur]: null })); setHotelPkgs(prev => ({ ...prev, [cur]: null })); resetAndReoptimise(); }} style={{ marginTop: "7px", padding: "3px 9px", borderRadius: "2px", border: "1px solid rgba(224,112,112,0.25)", background: "transparent", color: "rgba(224,112,112,0.65)", fontFamily: "'Crimson Pro',serif", fontSize: "10px", letterSpacing: "0.06em" }}>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Tier filter */}
                                    <div style={{ marginBottom: "14px" }}>
                                        <div style={{ fontFamily: "Cinzel", fontSize: "8px", letterSpacing: "2px", color: "rgba(200,151,43,0.3)", marginBottom: "8px" }}>FILTER BY TIER</div>
                                        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                                            {[{ id: "all", icon: "🏨", label: "All", color: "#C8972B" }, ...Object.entries(TIER_META).map(([id, tm]) => ({ id, ...tm }))].map(t => {
                                                const active = tierFilter === t.id;
                                                return (
                                                    <button key={t.id} onClick={() => setTierFilter(t.id)} style={{ padding: "4px 11px", borderRadius: "2px", border: `1px solid ${active ? t.color : "rgba(200,151,43,0.12)"}`, background: active ? `${t.color}15` : "rgba(245,236,215,0.02)", color: active ? t.color : "rgba(245,236,215,0.4)", fontFamily: "'Crimson Pro',serif", fontSize: "10px", display: "flex", alignItems: "center", gap: "4px", transition: "all 0.15s" }}>
                                                        <span>{t.icon}</span>{t.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {tierFilter !== "all" && (
                                            <div style={{ marginTop: "7px", fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.3)", fontStyle: "italic" }}>{TIER_META[tierFilter]?.desc}</div>
                                        )}
                                    </div>

                                    {hotelList.length === 0
                                        ? <div style={{ textAlign: "center", padding: "32px", color: "rgba(245,236,215,0.25)", fontFamily: "'Crimson Pro',serif", fontSize: "12px", fontStyle: "italic" }}>No hotels in this tier for {curMeta.label}.</div>
                                        : hotelList.map(h => (
                                            <HotelCard key={h.name} hotel={h} dpd={dpd}
                                                selected={hotelObj?.name === h.name}
                                                selectedPkg={hotelObj?.name === h.name ? hotelPkg : null}
                                                onSelect={selectHotelAndPkg} />
                                        ))
                                    }
                                </div>
                            );
                        })()}

                        {/* ── GUIDES ── */}
                        {tab === "guides" && (
                            <div>
                                <div style={{ marginBottom: "12px" }}>
                                    <Bubble from="hati" text={`${name}, a great local guide transforms good travel into extraordinary travel 🧭\n\nThese are ${curMeta.label}'s finest — verified, passionate, deeply rooted in this land.`} />
                                </div>
                                {guides[cur] && (
                                    <div style={{ marginBottom: "12px", padding: "9px 13px", borderRadius: "2px", background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.18)", fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.6)" }}>
                                        ✓ <strong style={{ color: "#22c55e" }}>{guides[cur].name}</strong> is guiding you through {curMeta.label}
                                        <button onClick={() => setGuides(prev => ({ ...prev, [cur]: null }))} style={{ float: "right", padding: "2px 8px", borderRadius: "2px", border: "1px solid rgba(200,151,43,0.15)", background: "transparent", color: "rgba(245,236,215,0.35)", fontFamily: "'Crimson Pro',serif", fontSize: "10px" }}>Remove</button>
                                    </div>
                                )}
                                {(GUIDES[cur] || []).length === 0
                                    ? <div style={{ textAlign: "center", padding: "28px", color: "rgba(245,236,215,0.25)", fontFamily: "'Crimson Pro',serif", fontSize: "12px", fontStyle: "italic" }}>No local guides listed yet for this region.</div>
                                    : (GUIDES[cur] || []).map(g => <GuideCard key={g.id} guide={g} selected={guides[cur]?.id === g.id} onSelect={g => setGuides(prev => ({ ...prev, [cur]: g }))} />)
                                }
                            </div>
                        )}

                        {/* ── CHAT ── */}
                        {tab === "chat" && (
                            <div>
                                {includedList.length > 0 && (
                                    <div style={{ marginBottom: "18px" }}>
                                        <div style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "15px", color: "rgba(245,236,215,0.5)", fontStyle: "italic", marginBottom: "10px" }}>Rate your experiences:</div>
                                        {includedList.slice(0, 4).map(a => <ExpCard key={a.id} act={a} />)}
                                    </div>
                                )}
                                <ChatPane name={name} district={cur} />
                            </div>
                        )}

                    </div>
                </div>
            </div>
        );
    }

    // ── REVIEW ─────────────────────────────────────────────────────────────────
    if (screen === "review") {
        const grandTotal = spentHistory.reduce((s, h) => s + h.total, 0);
        const savings = budget - grandTotal;
        return (
            <Wrap>
                <div style={{ textAlign: "center", paddingTop: "6vh" }}>
                    <div style={{ fontSize: "60px", marginBottom: "12px" }}>🙏</div>
                    <div style={{ fontFamily: "'Tiro Devanagari Sanskrit',serif", fontSize: "28px", letterSpacing: "4px", background: "linear-gradient(135deg,#8B1A1A,#C8972B,#E8A020)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "5px" }}>Journey Complete</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", margin: "0 auto 16px" }}>
                        <div style={{ height: 1, width: 32, background: "rgba(200,151,43,0.25)" }}></div>
                        <span style={{ color: "rgba(200,151,43,0.3)", fontSize: 11 }}>❈</span>
                        <div style={{ height: 1, width: 32, background: "rgba(200,151,43,0.25)" }}></div>
                    </div>
                    <div style={{ fontFamily: "'Crimson Pro',Georgia,serif", fontSize: "15px", color: "rgba(245,236,215,0.35)", fontStyle: "italic", marginBottom: "26px" }}>Nepal will stay with you forever, {name}.</div>

                    <div style={{ textAlign: "left", marginBottom: "20px" }}>
                        <Bubble from="hati" text={`What a journey, ${name}! 🏔️\n\nYou explored ${completed.length} destination${completed.length > 1 ? "s" : ""} across Nepal — temples, jungles, mountains, tea gardens. Every experience was optimised for maximum joy within your budget.\n\nTravel is the only thing you buy that makes you richer. Come back soon.`} />
                    </div>

                    {/* Summary card */}
                    <div style={{ marginBottom: "18px", padding: "18px", borderRadius: "2px", background: "linear-gradient(135deg,rgba(200,151,43,0.07),rgba(139,26,26,0.06))", border: "1px solid rgba(200,151,43,0.15)" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: "9px", letterSpacing: "2px", color: "rgba(200,151,43,0.3)", marginBottom: "14px" }}>TRIP COST SUMMARY</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px", textAlign: "center", marginBottom: "14px" }}>
                            <div>
                                <div style={{ fontFamily: "Cinzel", fontSize: "20px", color: "#C8972B" }}>{fmt(grandTotal)}</div>
                                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.32)" }}>total spent</div>
                            </div>
                            <div>
                                <div style={{ fontFamily: "Cinzel", fontSize: "20px", color: savings >= 0 ? "#22c55e" : "#e07070" }}>{fmt(Math.abs(savings))}</div>
                                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.32)" }}>{savings >= 0 ? "saved" : "over budget"}</div>
                            </div>
                            <div>
                                <div style={{ fontFamily: "Cinzel", fontSize: "20px", color: "#8B1A1A" }}>{completed.length}</div>
                                <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.32)" }}>destinations</div>
                            </div>
                        </div>
                        <div style={{ height: "1px", background: "rgba(200,151,43,0.08)", marginBottom: "12px" }} />
                        {[
                            ["🏨 Accommodation", spentHistory.reduce((s, h) => s + (h.hotelTotal || 0), 0)],
                            ["🎭 Activities", spentHistory.reduce((s, h) => s + (h.actTotal || 0), 0)],
                            ["🧾 Extras", spentHistory.reduce((s, h) => s + (h.custom || []).reduce((ss, e) => ss + e.amount, 0), 0)],
                        ].map(([label, val]) => (
                            <div key={label} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'Crimson Pro',serif", fontSize: "11px", color: "rgba(245,236,215,0.38)", marginBottom: "5px" }}>
                                <span>{label}</span>
                                <span style={{ fontFamily: "Cinzel", fontSize: "11px", color: "rgba(245,236,215,0.55)" }}>{fmt(val)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Journey log */}
                    <div style={{ marginBottom: "22px", padding: "18px", borderRadius: "2px", background: "rgba(245,236,215,0.02)", border: "1px solid rgba(200,151,43,0.1)", textAlign: "left" }}>
                        <div style={{ fontFamily: "Cinzel", fontSize: "9px", letterSpacing: "2px", color: "rgba(200,151,43,0.28)", marginBottom: "14px" }}>YOUR NEPAL STORY</div>
                        {completed.map((d, i) => {
                            const meta = DISTRICTS_META[d];
                            const h = spentHistory[i];
                            const guide = guides[d];
                            const hotel = hotels[d];
                            const pkg = hotelPkgs[d];
                            const diff = h ? h.total - h.allowance : 0;
                            return (
                                <div key={d} style={{ padding: "12px 0", borderBottom: i < completed.length - 1 ? "1px solid rgba(200,151,43,0.07)" : "none" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "5px" }}>
                                        <span style={{ fontSize: "22px" }}>{hotel?.emoji || meta.emoji}</span>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "13px", fontWeight: 600, color: "#F5ECD7" }}>{meta.label}</div>
                                            {hotel && <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.35)" }}>{hotel.name}{pkg ? " · " + pkg.name : ""}</div>}
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            {h && (
                                                <>
                                                    <div style={{ fontFamily: "Cinzel", fontSize: "12px", color: "#C8972B" }}>{fmt(h.total)}</div>
                                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", color: "rgba(245,236,215,0.28)" }}>of {fmt(h.allowance)}</div>
                                                    <div style={{ fontFamily: "'Crimson Pro',serif", fontSize: "9px", marginTop: "1px", color: diff > 0 ? "#e07070" : "#4ade80" }}>
                                                        {diff > 0 ? `+${fmt(diff)} over` : `${fmt(-diff)} saved`}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {h && (
                                        <div style={{ paddingLeft: "32px", marginBottom: "6px" }}>
                                            <div style={{ height: "2px", borderRadius: "1px", background: "rgba(245,236,215,0.05)", overflow: "hidden" }}>
                                                <div style={{ height: "100%", borderRadius: "1px", width: `${Math.min(100, h.total / h.allowance * 100)}%`, background: diff > 0 ? "#8B1A1A" : meta.color, transition: "width 0.5s ease" }} />
                                            </div>
                                        </div>
                                    )}
                                    {(guide || (h?.custom && h.custom.length > 0)) && (
                                        <div style={{ paddingLeft: "32px", fontFamily: "'Crimson Pro',serif", fontSize: "10px", color: "rgba(245,236,215,0.3)", lineHeight: "1.9" }}>
                                            {guide && <div>🧭 {guide.name} · {guide.speciality}</div>}
                                            {h?.custom?.length > 0 && <div>🧾 Extras: {h.custom.map(e => `${e.label} (${fmt(e.amount)})`).join(" · ")}</div>}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <Btn ghost onClick={() => {
                        setScreen("welcome"); setDistricts([]); setCurrentIdx(0); setCompleted([]);
                        setGuides({}); setHotels({}); setHotelPkgs({}); setIncluded({});
                        setSpentHistory([]); setCustomExpenses({}); setCustomLabel(""); setCustomAmount("");
                        setName(""); setNameInput(""); setUnlockMode(false); setExtraD("");
                    }}>
                        PLAN ANOTHER JOURNEY
                    </Btn>
                </div>
            </Wrap>
        );
    }

    return null;
}
