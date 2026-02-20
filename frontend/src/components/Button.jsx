import React from "react";

const Button = ({ children, variant = "primary", className = "", ...props }) => {
    const base =
        "px-6 py-3 rounded-lg font-semibold transition-all duration-300 inline-flex items-center justify-center uppercase tracking-widest text-sm cursor-pointer border";

    const variants = {
        // Deep red — primary action, white text
        primary:
            "bg-[#9B2335] hover:bg-[#7D1C2B] text-white border-transparent shadow-md shadow-[#9B2335]/25 hover:shadow-lg hover:shadow-[#9B2335]/35 hover:-translate-y-px",

        // Ghost — secondary action, brown text on ivory
        secondary:
            "bg-transparent text-[#6B3D1E] border-[#6B3D1E]/30 hover:border-[#9B2335] hover:text-[#9B2335] hover:bg-[#9B2335]/5",

        // Gold fill — accent / highlight action
        accent:
            "bg-[#B8892A] hover:bg-[#9A7020] text-white border-transparent shadow-md shadow-[#B8892A]/25 hover:shadow-lg hover:shadow-[#B8892A]/35 hover:-translate-y-px",

        // Outline red — softer primary
        outline:
            "bg-transparent text-[#9B2335] border-[#9B2335]/40 hover:border-[#9B2335] hover:bg-[#9B2335]/06",
    };

    return (
        <button
            className={`${base} ${variants[variant] ?? variants.primary} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;