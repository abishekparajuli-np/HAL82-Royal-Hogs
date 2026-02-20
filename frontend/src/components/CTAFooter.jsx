import React from "react";
import { Link } from "react-router-dom";

const CTAFooter = () => {
    return (
        <footer
            style={{
                borderTop: "1px solid rgba(184,137,42,0.18)",
                background: "linear-gradient(to bottom, #F9F3E8, #F0E6D0)",
                marginTop: "4rem",
            }}
        >
            {/* ── CTA block ── */}
            <div className="px-6 py-20 md:px-8 md:py-28 max-w-3xl mx-auto text-center flex flex-col items-center gap-7">

                {/* Eyebrow */}
                <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
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
                        Start Exploring
                    </span>
                </div>

                {/* Headline */}
                <h2
                    className="text-3xl md:text-5xl font-bold tracking-tight leading-tight"
                    style={{
                        fontFamily: "'Tiro Devanagari Sanskrit', serif",
                        color: "#2A1608",
                    }}
                >
                    Ready to discover
                    <br />
                    <span style={{ color: "#9B2335" }}>Nepal intelligently?</span>
                </h2>

                {/* Gold accent rule */}
                <div className="flex items-center gap-3">
                    <div
                        className="h-0.5 w-12 rounded-full"
                        style={{ background: "linear-gradient(90deg, #B8892A, #D4A84B)" }}
                    />
                    <span style={{ color: "#B8892A", fontSize: "0.85rem" }}>❈</span>
                    <div
                        className="h-0.5 w-12 rounded-full"
                        style={{ background: "linear-gradient(270deg, #B8892A, #D4A84B)" }}
                    />
                </div>

                {/* Body */}
                <p
                    className="text-base md:text-lg max-w-xl leading-relaxed"
                    style={{ color: "#6B3D1E" }}
                >
                    Let HATI be your guide through ancient temples, hidden valleys, and
                    Himalayan trails. Personalised, real-time, and always by your side.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-3 justify-center mt-1">
                    <Link to="/hati" style={{ textDecoration: "none" }}>
                        <button
                            className="uppercase tracking-widest text-sm font-semibold px-8 py-3.5 rounded-lg transition-all duration-300"
                            style={{
                                background: "#9B2335",
                                color: "#FFFFFF",
                                border: "none",
                                cursor: "pointer",
                                fontFamily: "'Crimson Pro', serif",
                                boxShadow: "0 2px 16px rgba(155,35,53,0.28)",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = "#7D1C2B";
                                e.currentTarget.style.boxShadow = "0 4px 24px rgba(155,35,53,0.38)";
                                e.currentTarget.style.transform = "translateY(-1px)";
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = "#9B2335";
                                e.currentTarget.style.boxShadow = "0 2px 16px rgba(155,35,53,0.28)";
                                e.currentTarget.style.transform = "translateY(0)";
                            }}
                        >
                            🐘 Talk to HATI
                        </button>
                    </Link>

                    <Link to="/plan" style={{ textDecoration: "none" }}>
                        <button
                            className="uppercase tracking-widest text-sm font-semibold px-8 py-3.5 rounded-lg transition-all duration-300"
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
                            🗺️ Plan a Trip
                        </button>
                    </Link>
                </div>
            </div>

            {/* ── Bottom bar ── */}
            <div
                className="px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs uppercase tracking-widest"
                style={{
                    borderTop: "1px solid rgba(184,137,42,0.18)",
                    color: "rgba(61,32,16,0.4)",
                }}
            >
                <span>&copy; {new Date().getFullYear()} HATI &middot; All rights reserved.</span>

                {/* Ornament */}
                <span style={{ color: "rgba(184,137,42,0.45)", fontSize: "1rem" }}>❋</span>

                {/* Footer links */}
                <div className="flex items-center gap-5">
                    {["Privacy", "Terms", "Contact"].map(item => (
                        <a
                            key={item}
                            href="#"
                            className="transition-colors duration-200"
                            style={{ color: "rgba(61,32,16,0.4)", textDecoration: "none" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#9B2335"}
                            onMouseLeave={e => e.currentTarget.style.color = "rgba(61,32,16,0.4)"}
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default CTAFooter;