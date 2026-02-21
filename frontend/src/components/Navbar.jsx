import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    React.useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        if (!dropdownOpen) return;
        const handler = () => setDropdownOpen(false);
        document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [dropdownOpen]);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate("/");
    };

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
                <span
                    className="text-xl font-bold tracking-wide"
                    style={{ color: "#2A1608", fontFamily: "'Tiro Devanagari Sanskrit', serif" }}
                >
                    HATI
                </span>
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
                {navLink("/hati", "Travel Buddy")}
                {navLink("/plan", "Plan Trip")}
            </div>

            {/* Auth section */}
            <div className="flex items-center gap-2">
                {user ? (
                    /* ── Logged-in: avatar + dropdown ── */
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setDropdownOpen(prev => !prev)}
                            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200"
                            style={{
                                background: "rgba(155,35,53,0.07)",
                                border: "1.5px solid rgba(155,35,53,0.2)",
                                cursor: "pointer",
                                fontFamily: "inherit",
                            }}
                        >
                            {/* Avatar circle */}
                            <div
                                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{
                                    background: "linear-gradient(135deg, #9B2335, #C4445A)",
                                    color: "#fff",
                                    flexShrink: 0,
                                }}
                            >
                                {user.username?.[0]?.toUpperCase() ?? "U"}
                            </div>
                            <span
                                className="text-xs font-semibold uppercase tracking-widest"
                                style={{ color: "#6B3D1E" }}
                            >
                                {user.username}
                            </span>
                            {/* Chevron */}
                            <svg
                                width="10" height="10" viewBox="0 0 10 10" fill="none"
                                style={{
                                    color: "#9C6840",
                                    transform: dropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 200ms ease",
                                }}
                            >
                                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {/* Dropdown */}
                        {dropdownOpen && (
                            <div
                                className="absolute right-0 mt-2 w-44 rounded-xl py-1.5 z-50"
                                style={{
                                    background: "#FFFFFF",
                                    border: "1px solid rgba(184,137,42,0.2)",
                                    boxShadow: "0 8px 32px rgba(61,32,16,0.12)",
                                }}
                            >
                                {/* Username header */}
                                <div
                                    className="px-4 py-2 text-xs uppercase tracking-widest font-semibold border-b"
                                    style={{
                                        color: "#9C6840",
                                        borderColor: "rgba(184,137,42,0.15)",
                                    }}
                                >
                                    {user.username}
                                </div>

                                {/* Logout */}
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all duration-150"
                                    style={{
                                        color: "#9B2335",
                                        background: "transparent",
                                        border: "none",
                                        cursor: "pointer",
                                        fontFamily: "inherit",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "rgba(155,35,53,0.06)"}
                                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                                >
                                    🚪 Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    /* ── Logged-out: Sign In + Register ── */
                    <>
                        <Link to="/login" className="hidden md:block" style={{ textDecoration: "none" }}>
                            <button
                                className="text-xs px-4 py-2 uppercase tracking-widest rounded-lg transition-all duration-200 font-semibold"
                                style={{
                                    background: "transparent",
                                    border: "1.5px solid rgba(107,61,30,0.3)",
                                    color: "#6B3D1E",
                                    fontFamily: "inherit",
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

                        <Link to="/register" className="hidden md:block" style={{ textDecoration: "none" }}>
                            <button
                                className="text-xs px-4 py-2 uppercase tracking-widest rounded-lg font-semibold transition-all duration-200"
                                style={{
                                    background: "#9B2335",
                                    border: "1.5px solid transparent",
                                    color: "#FFFFFF",
                                    fontFamily: "inherit",
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
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;