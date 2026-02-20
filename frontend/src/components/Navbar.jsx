import React from "react";
import Button from "./Btn";

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between px-6 py-6 md:px-8 border-b border-white/5">
            <div className="flex items-center gap-2 text-2xl font-bold tracking-tight text-white">
                <div className="w-8 h-8 rounded-lg bg-[#3B82F6] flex items-center justify-center">
                    <span className="text-white text-lg">N</span>
                </div>
                NepalSaaS
            </div>
            <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
                <a href="#features" className="hover:text-white transition-colors">
                    Features
                </a>
                <a href="#about" className="hover:text-white transition-colors">
                    About
                </a>
                <a href="#pricing" className="hover:text-white transition-colors">
                    Pricing
                </a>
            </div>
            <div>
                <Button
                    variant="secondary"
                    className="text-sm px-4 py-2 hidden md:inline-flex"
                >
                    Sign In
                </Button>
                <Button variant="primary" className="text-sm px-4 py-2 ml-4 hidden md:inline-flex">
                    Register
                </Button>
            </div>
        </nav>
    );
};

export default Navbar;