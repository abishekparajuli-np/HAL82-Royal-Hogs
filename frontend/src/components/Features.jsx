import React from "react";
import Button from "./Btn"

const CTAFooter = () => {
    return (
        <footer className="mt-16 md:mt-24 border-t border-white/5 bg-gradient-to-b from-transparent to-[#111827]/50">
            <div className="px-6 py-20 md:px-8 md:py-32 max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                    Ready to scale your vision?
                </h2>
                <p className="text-lg text-gray-400 max-w-xl">
                    Join hundreds of companies building the future with our tools. Get
                    started for free today.
                </p>
                <Button variant="accent" className="px-8 py-4 text-lg">
                    Start Your Free Trial
                </Button>
            </div>

            <div className="text-center py-6 border-t border-white/5 text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} NepalSaaS. All rights reserved.
            </div>
        </footer>
    );
};

export default CTAFooter;