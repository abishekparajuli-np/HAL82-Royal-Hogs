import React from "react";
import { Link } from "react-router-dom";
import Button from "./Button";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 py-4 md:px-8 border-b border-[#C8972B]/20"
            style={{ background: 'rgba(26,10,0,0.85)', backdropFilter: 'blur(8px)' }}>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-wide text-[#F5ECD7] no-underline"
                style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
                <div className="w-8 h-8 rounded-sm bg-[#8B1A1A] border border-[#C8972B]/40 flex items-center justify-center">
                    <span className="text-[#C8972B] text-base">🐘</span>
                </div>
                <span className="text-[#C8972B]">HATI</span>
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-3">

                {/* Travel Buddy */}
                <Link to="/hati"
                    className="hidden md:inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C8972B]/70 hover:text-[#C8972B] border border-[#C8972B]/20 hover:border-[#C8972B]/50 px-3 py-1.5 rounded-sm transition-all duration-200">
                    🐘 Travel Buddy
                </Link>

                {/* Trip Planner */}
                <Link to="/plan"
                    className="hidden md:inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C8972B]/70 hover:text-[#C8972B] border border-[#C8972B]/20 hover:border-[#C8972B]/50 px-3 py-1.5 rounded-sm transition-all duration-200">
                    🗺️ Plan Trip
                </Link>

                <Link to="/login">
                    <Button
                        variant="secondary"
                        className="text-xs px-4 py-2 hidden md:inline-flex uppercase tracking-widest rounded-sm bg-transparent border border-[#C8972B]/25 text-[#F5ECD7]/60 hover:border-[#C8972B]/60 hover:text-[#F5ECD7] transition-all duration-200"
                    >
                        Sign In
                    </Button>
                </Link>

                <Link to="/register">
                    <Button
                        variant="primary"
                        className="text-xs px-4 py-2 hidden md:inline-flex uppercase tracking-widest rounded-sm bg-[#8B1A1A] border border-[#C8972B]/30 text-[#F5ECD7] hover:bg-[#C8972B] transition-all duration-200"
                    >
                        Register
                    </Button>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;