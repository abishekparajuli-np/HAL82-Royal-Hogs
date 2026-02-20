import React from "react";

const Button = ({ children, variant = "primary", className = "" }) => {
    const baseStyle =
        "px-6 py-3 rounded-sm font-semibold transition-all duration-300 inline-flex items-center justify-center uppercase tracking-widest text-sm";

    const variants = {
        primary:
            "bg-[#8B1A1A] hover:bg-[#C8972B] text-[#F5ECD7] border border-[#C8972B]/30 shadow-lg shadow-[#8B1A1A]/20",
        secondary:
            "bg-transparent hover:border-[#C8972B]/60 text-[#F5ECD7]/60 hover:text-[#F5ECD7] border border-[#C8972B]/20",
        accent:
            "bg-[#C8972B] hover:bg-[#E8A020] text-[#1A0A00] border border-[#C8972B]/50 shadow-lg shadow-[#C8972B]/20",
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

export default Button;