
import React from "react";

const Btn = ({ children, variant = "primary", className = "" }) => {
    const baseStyle =
        "px-6 py-3 rounded-lg font-bold transition-all duration-200 inline-flex items-center justify-center";

    const variants = {
        primary:
            "bg-[#3B82F6] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20",
        secondary:
            "bg-[#111827] hover:bg-gray-800 text-[#E5E7EB] border border-gray-700 hover:border-gray-500",
        accent:
            "bg-[#F59E0B] hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20",
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`}>
            {children}
        </button>
    );
};

export default Btn;
