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
        <section className="px-6 py-16 md:px-8 lg:py-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left: Headline + CTA */}
            <div className="flex flex-col gap-7 md:gap-9">

                {/* Eyebrow badge */}
                <div className="inline-flex items-center gap-2 self-start border border-[#C8972B]/25 px-3 py-1.5 rounded-sm"
                    style={{ background: 'rgba(200,151,43,0.06)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C8972B] animate-pulse"></span>
                    <span className="text-[#C8972B]/80 text-xs uppercase tracking-[0.2em] font-medium">AI-Powered Nepal Travel Guide</span>
                </div>

                {/* Headline */}
                <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-[#F5ECD7] tracking-tight"
                        style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
                        Navigate Nepal
                        <br className="hidden md:block" />
                        <span className="text-[#C8972B]"> intelligently.</span>
                    </h1>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="h-px w-12 bg-[#C8972B]/40"></div>
                        <span className="text-[#C8972B]/40 text-xs tracking-widest">❈</span>
                    </div>
                </div>

                {/* Body */}
                <p className="text-base md:text-lg text-[#F5ECD7]/50 max-w-md leading-relaxed">
                    HATI combines real-time mapping, curated local expertise, and
                    adaptive AI to craft deeply personal Himalayan travel experiences —
                    from Kathmandu's temple courtyards to Everest Base Camp.
                </p>

                {/* CTA row */}
                <div className="flex flex-wrap gap-3 mt-1">
                    <Link to="/hati">
                        <Button variant="primary"
                            className="bg-[#8B1A1A] hover:bg-[#C8972B] text-[#F5ECD7] border border-[#C8972B]/30 rounded-sm uppercase tracking-widest text-xs font-semibold px-6 py-3 transition-all duration-300">
                            🐘 Talk to HATI
                        </Button>
                    </Link>
                    <Link to="/hati">
                        <Button variant="secondary"
                            className="bg-transparent text-[#F5ECD7]/55 hover:text-[#F5ECD7] border border-[#C8972B]/20 hover:border-[#C8972B]/50 rounded-sm uppercase tracking-widest text-xs font-semibold px-6 py-3 transition-all duration-300">
                            🗺️ Explore the Map
                        </Button>
                    </Link>
                </div>

                {/* Stats strip */}
                <div className="flex items-center gap-6 pt-2 border-t border-[#C8972B]/10">
                    {[
                        { value: '200+', label: 'Destinations' },
                        { value: '50+', label: 'Trek Routes' },
                        { value: '24/7', label: 'AI Support' },
                    ].map(({ value, label }) => (
                        <div key={label} className="flex flex-col gap-0.5">
                            <span className="text-[#C8972B] text-lg font-bold"
                                style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>{value}</span>
                            <span className="text-[#F5ECD7]/30 text-xs uppercase tracking-widest">{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Slideshow Panel */}
            <div className="relative w-full aspect-square md:aspect-video lg:aspect-square rounded-sm border border-[#C8972B]/20 overflow-hidden"
                style={{
                    background: '#1A0A00',
                    boxShadow: '0 8px 64px rgba(139,26,26,0.25), 0 0 0 1px rgba(200,151,43,0.08)',
                }}>

                {/* Slideshow image */}
                <img
                    key={slide.file}
                    src={`/images/${slide.file}`}
                    alt={slide.label}
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        opacity: fading ? 0 : 1,
                        transition: 'opacity 0.5s ease',
                    }}
                />

                {/* Dark overlay gradient */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(26,10,0,0.25) 0%, transparent 40%, rgba(26,10,0,0.75) 100%)',
                    pointerEvents: 'none',
                }} />

                {/* Corner ornaments */}
                {['top-3 left-3', 'top-3 right-3'].map((pos) => (
                    <span key={pos} className={`absolute ${pos} text-[#C8972B]/40 text-base select-none z-10`}>❈</span>
                ))}

                {/* Top label */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    <div className="h-px w-5 bg-[#C8972B]/30"></div>
                    <span className="text-[#C8972B]/50 text-[9px] uppercase tracking-[0.25em]">Discover Nepal</span>
                    <div className="h-px w-5 bg-[#C8972B]/30"></div>
                </div>

                {/* Slide caption */}
                <div className="absolute left-0 right-0 z-10 px-5 pb-5"
                    style={{
                        bottom: 48,
                        opacity: fading ? 0 : 1,
                        transition: 'opacity 0.5s ease',
                    }}>
                    <p className="text-[#F5ECD7] font-bold text-base tracking-wide"
                        style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
                        {slide.label}
                    </p>
                    <p className="text-[#C8972B]/60 text-[10px] uppercase tracking-widest mt-0.5">
                        {slide.sub}
                    </p>
                </div>

                {/* Dot indicators */}
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    {SLIDES.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            style={{
                                width: i === current ? 18 : 5,
                                height: 5, borderRadius: 2,
                                background: i === current
                                    ? '#C8972B'
                                    : 'rgba(245,236,215,0.2)',
                                border: 'none', cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                padding: 0,
                            }}
                        />
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="absolute bottom-0 left-0 right-0 px-5 py-3 flex items-center justify-between border-t border-[#C8972B]/15 z-10"
                    style={{ background: 'rgba(26,10,0,0.75)' }}>
                    <span className="text-[#F5ECD7]/20 text-[9px] uppercase tracking-widest">🇳🇵 Nepal</span>
                    <span className="text-[#F5ECD7]/20 text-[9px] uppercase tracking-widest">
                        {current + 1} / {SLIDES.length}
                    </span>
                    <Link to="/hati" className="flex items-center gap-1.5 text-[9px] text-[#C8972B]/50 hover:text-[#C8972B] uppercase tracking-widest transition-colors duration-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60"></span>
                        HATI Active →
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;