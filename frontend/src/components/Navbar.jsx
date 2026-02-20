import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button";
import logo from "../assets/logo.png";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const navLink = (to, label, emoji) => {
        const active = location.pathname === to;
        return (
            <Link
                to={to}
                className="hidden md:inline-flex items-center gap-1.5 text-xs uppercase tracking-widest transition-all duration-200"
                style={{
                    color: active ? "#9B2335" : "#6B3D1E",
                    borderBottom: active ? "2px solid #B8892A" : "2px solid transparent",
                    paddingBottom: "2px",
                    fontWeight: active ? 600 : 500,
                    textDecoration: "none",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.color = "#9B2335"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.color = "#6B3D1E"; }}
            >
                <span>{emoji}</span>
                {label}
            </Link>
        );
    };

    return (
        <nav
            style={{
                backgroundColor: scrolled ? "rgba(249,243,232,0.96)" : "#F9F3E8",
                backdropFilter: scrolled ? "blur(10px)" : "none",
                borderBottom: "1px solid rgba(184,137,42,0.22)",
                boxShadow: scrolled ? "0 2px 16px rgba(61,32,16,0.08)" : "none",
                transition: "box-shadow 250ms ease, background-color 250ms ease",
                position: "sticky",
                top: 0,
                zIndex: 100,
            }}
            className="flex items-center justify-between px-6 py-3.5 md:px-10"
        >

            {/* Logo */}
            <Link
                to="/"
                className="flex items-center gap-2.5 no-underline"
                style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
            >
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
                    style={{
                        background: "linear-gradient(135deg, #9B2335, #C4445A)",
                        boxShadow: "0 2px 8px rgba(155,35,53,0.28)",
                    }}
                >
                    <img
                        src={logo}
                        alt="Hati Logo"
                        className="w-full h-full object-contain rounded-lg"
                    />
                </div>

                {/* Brand name — dark brown, fully readable */}
                <span
                    className="text-xl font-bold tracking-wide"
                    style={{ color: "#2A1608", fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                >
                    HATI
                </span>

                {/* Sub-label — medium brown, still legible */}
                <span
                    className="hidden sm:block text-xs uppercase tracking-widest font-medium"
                    style={{
                        color: "#9C6840",
                        borderLeft: "1px solid rgba(184,137,42,0.35)",
                        paddingLeft: "0.65rem",
                    }}
                >
                    Nepal Travel
                </span>
            </Link>

            {/* Nav links */}
            <div className="flex items-center gap-8">
                {navLink("/hati", "Travel Buddy", "🐘")}
                {navLink("/plan", "Plan Trip", "🗺️")}
            </div>

            {/* Auth actions */}
            <div className="flex items-center gap-2">

                {/* Sign In — dark enough to read clearly */}
                <Link to="/login" className="hidden md:block" style={{ textDecoration: "none" }}>
                    <button
                        className="text-xs px-4 py-2 uppercase tracking-widest rounded-lg transition-all duration-200 font-semibold"
                        style={{
                            background: "transparent",
                            border: "1.5px solid rgba(107,61,30,0.3)",
                            color: "#6B3D1E",
                            fontFamily: "'Crimson Pro', serif",
                            cursor: "pointer",
                            letterSpacing: "0.08em",
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
                        Sign In
                    </button>
                </Link>

                {/* Register — white on red, always visible */}
                <Link to="/register" className="hidden md:block" style={{ textDecoration: "none" }}>
                    <button
                        className="text-xs px-4 py-2 uppercase tracking-widest rounded-lg font-semibold transition-all duration-200"
                        style={{
                            background: "#9B2335",
                            border: "1.5px solid transparent",
                            color: "#FFFFFF",
                            fontFamily: "'Crimson Pro', serif",
                            cursor: "pointer",
                            boxShadow: "0 2px 10px rgba(155,35,53,0.25)",
                            letterSpacing: "0.08em",
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = "#7D1C2B";
                            e.currentTarget.style.boxShadow = "0 4px 16px rgba(155,35,53,0.35)";
                            e.currentTarget.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = "#9B2335";
                            e.currentTarget.style.boxShadow = "0 2px 10px rgba(155,35,53,0.25)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        Register
                    </button>
                </Link>
            </div>

        </nav>
    );
};

export default Navbar;