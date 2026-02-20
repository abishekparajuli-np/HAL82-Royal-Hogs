import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const SLIDES = [
    { file: 'boudhanath.jpg', label: 'Boudhanath Stupa', sub: 'Kathmandu Valley' },
    { file: 'chitwan.jpg', label: 'Chitwan National Park', sub: 'Terai Region' },
    { file: 'Bhaktapur.jpg', label: 'Bhaktapur Durbar', sub: 'Ancient City' },
    { file: 'pokhara.jpg', label: 'Pokhara Valley', sub: 'Lakeside Jewel' },
    { file: 'mustang.jpg', label: 'Upper Mustang', sub: 'Forbidden Kingdom' },
    { file: 'lumbini.jpg', label: 'Lumbini', sub: 'Birthplace of Buddha' },
];

const Hero = () => {
    const [current, setCurrent] = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setCurrent(prev => (prev + 1) % SLIDES.length);
                setFading(false);
            }, 500);
        }, 3500);
        return () => clearInterval(timer);
    }, []);

    const goTo = (i) => {
        if (i === current) return;
        setFading(true);
        setTimeout(() => { setCurrent(i); setFading(false); }, 400);
    };

    const slide = SLIDES[current];

    return (
        <section className="px-6 py-16 md:px-10 lg:py-28 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── Left: Headline + CTA ── */}
            <div className="flex flex-col gap-7">

                {/* Eyebrow badge */}
                <div
                    className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full"
                    style={{
                        background: "rgba(155,35,53,0.07)",
                        border: "1px solid rgba(155,35,53,0.18)",
                    }}
                >
                    <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: "#9B2335" }}
                    />
                    <span
                        className="text-xs uppercase tracking-widest font-semibold"
                        style={{ color: "#9B2335" }}
                    >
                        AI-Powered Nepal Travel Guide
                    </span>
                </div>

                {/* Headline */}
                <div>
                    <h1
                        className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight"
                        style={{
                            fontFamily: "'Tiro Devanagari Sanskrit', serif",
                            color: "#2A1608",
                        }}
                    >
                        Nepal isn’t just visited.
                        <br className="hidden md:block" />
                        <span style={{ color: "#9B2335" }}> It’s experienced..</span>
                    </h1>

                    {/* Gold accent rule */}
                    <div className="mt-5 flex items-center gap-3">
                        <div
                            className="h-0.5 w-12 rounded-full"
                            style={{ background: "linear-gradient(90deg, #B8892A, #D4A84B)" }}
                        />
                        <span style={{ color: "#B8892A", fontSize: "0.85rem" }}>❈</span>
                    </div>
                </div>

                {/* Body copy */}
                <p
                    className="text-base md:text-lg max-w-md leading-relaxed"
                    style={{ color: "#6B3D1E" }}
                >
                    From incense-filled temple alleys to Himalayan trails above the clouds — HATI helps you travel deeper, spend smarter, and discover what guidebooks miss.
                </p>

                {/* CTA row */}
                <div className="flex flex-wrap gap-3">
                    <Link to="/hati" style={{ textDecoration: "none" }}>
                        <button
                            className="uppercase tracking-widest text-xs font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                            style={{
                                background: "#9B2335",
                                color: "#FFFFFF",
                                border: "none",
                                cursor: "pointer",
                                boxShadow: "0 2px 14px rgba(155,35,53,0.28)",
                                fontFamily: "'Crimson Pro', serif",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "#7D1C2B";
                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(155,35,53,0.38)";
                                e.currentTarget.style.transform = "translateY(-1px)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "#9B2335";
                                e.currentTarget.style.boxShadow = "0 2px 14px rgba(155,35,53,0.28)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            Talk to HATI
                        </button>
                    </Link>

                    <Link to="/plan" style={{ textDecoration: "none" }}>
                        <button
                            className="uppercase tracking-widest text-xs font-semibold px-6 py-3 rounded-lg transition-all duration-300"
                            style={{
                                background: "transparent",
                                color: "#6B3D1E",
                                border: "1.5px solid rgba(107,61,30,0.3)",
                                cursor: "pointer",
                                fontFamily: "'Crimson Pro', serif",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = "#9B2335";
                                e.currentTarget.style.color = "#9B2335";
                                e.currentTarget.style.background = "rgba(155,35,53,0.05)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = "rgba(107,61,30,0.3)";
                                e.currentTarget.style.color = "#6B3D1E";
                                e.currentTarget.style.background = "transparent";
                            }}
                        >
                            Plan Trip
                        </button>
                    </Link>
                </div>

                {/* Stats strip */}
                <div
                    className="flex items-center gap-8 pt-5"
                    style={{ borderTop: "1px solid rgba(184,137,42,0.18)" }}
                >
                    {[
                        { value: "200+", label: "Destinations" },
                        { value: "50+", label: "Trek Routes" },
                        { value: "24/7", label: "AI Support" },
                    ].map(({ value, label }) => (
                        <div key={label} className="flex flex-col gap-0.5">
                            <span
                                className="text-xl font-bold"
                                style={{
                                    fontFamily: "'Tiro Devanagari Sanskrit', serif",
                                    color: "#9B2335",
                                }}
                            >
                                {value}
                            </span>
                            <span
                                className="text-xs uppercase tracking-widest font-medium"
                                style={{ color: "#9C6840" }}
                            >
                                {label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Right: Slideshow Panel ── */}
            <div
                className="relative w-full aspect-square md:aspect-video lg:aspect-square rounded-2xl overflow-hidden"
                style={{
                    background: "#1C0D05",
                    boxShadow: "0 8px 48px rgba(61,32,16,0.18), 0 0 0 1px rgba(184,137,42,0.12)",
                }}
            >
                {/* Slide image */}
                <img
                    key={slide.file}
                    src={`/images/${slide.file}`}
                    alt={slide.label}
                    style={{
                        position: "absolute", inset: 0,
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        opacity: fading ? 0 : 1,
                        transition: "opacity 0.5s ease",
                    }}
                />

                {/* Gradient overlay — stronger at bottom for caption legibility */}
                <div
                    style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to bottom, rgba(20,8,2,0.15) 0%, transparent 35%, rgba(20,8,2,0.82) 100%)",
                        pointerEvents: "none",
                    }}
                />

                {/* Top label */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    <div className="h-px w-5" style={{ background: "rgba(212,168,75,0.45)" }} />
                    <span
                        className="text-[9px] uppercase tracking-widest"
                        style={{ color: "rgba(212,168,75,0.8)" }}
                    >
                        Discover Nepal
                    </span>
                    <div className="h-px w-5" style={{ background: "rgba(212,168,75,0.45)" }} />
                </div>

                {/* Corner ornament */}
                <span
                    className="absolute top-3.5 left-4 text-base select-none z-10"
                    style={{ color: "rgba(212,168,75,0.5)" }}
                >❈</span>
                <span
                    className="absolute top-3.5 right-4 text-base select-none z-10"
                    style={{ color: "rgba(212,168,75,0.5)" }}
                >❈</span>

                {/* Slide caption — white on the dark gradient, always readable */}
                <div
                    className="absolute left-0 right-0 z-10 px-5 pb-4"
                    style={{
                        bottom: 52,
                        opacity: fading ? 0 : 1,
                        transition: "opacity 0.5s ease",
                    }}
                >
                    <p
                        className="font-bold text-base tracking-wide"
                        style={{
                            fontFamily: "'Tiro Devanagari Sanskrit', serif",
                            color: "#FFFFFF",
                            textShadow: "0 1px 6px rgba(0,0,0,0.5)",
                        }}
                    >
                        {slide.label}
                    </p>
                    <p
                        className="text-[10px] uppercase tracking-widest mt-0.5"
                        style={{ color: "rgba(212,168,75,0.9)" }}
                    >
                        {slide.sub}
                    </p>
                </div>

                {/* Dot indicators */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            style={{
                                width: i === current ? 20 : 5,
                                height: 5,
                                borderRadius: 3,
                                background: i === current
                                    ? "#D4A84B"
                                    : "rgba(255,255,255,0.3)",
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                                transition: "all 0.3s ease",
                            }}
                        />
                    ))}
                </div>

                {/* Bottom bar */}
                <div
                    className="absolute bottom-0 left-0 right-0 px-5 py-3 flex items-center justify-between z-10"
                    style={{
                        background: "rgba(15,6,2,0.7)",
                        backdropFilter: "blur(6px)",
                        borderTop: "1px solid rgba(212,168,75,0.12)",
                    }}
                >
                    <span
                        className="text-[9px] uppercase tracking-widest"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                        🇳🇵 Nepal
                    </span>
                    <span
                        className="text-[9px] uppercase tracking-widest"
                        style={{ color: "rgba(255,255,255,0.45)" }}
                    >
                        {current + 1} / {SLIDES.length}
                    </span>
                    <Link
                        to="/hati"
                        className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest transition-colors duration-200"
                        style={{ color: "rgba(212,168,75,0.75)", textDecoration: "none" }}
                        onMouseEnter={e => e.currentTarget.style.color = "#D4A84B"}
                        onMouseLeave={e => e.currentTarget.style.color = "rgba(212,168,75,0.75)"}
                    >
                        <span
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: "#4ade80" }}
                        />
                        HATI Active →
                    </Link>
                </div>
            </div>

        </section>
    );
};

export default Hero;