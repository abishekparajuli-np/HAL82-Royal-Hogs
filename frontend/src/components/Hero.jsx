import React from "react";
import Button from "./Btn";

const Hero = () => {
    return (
        <section className="px-6 py-16 md:px-8 lg:py-32 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left: Headline + CTA */}
            <div className="flex flex-col gap-6 md:gap-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white tracking-tight">
                    Build premium software <br className="hidden md:block" />
                    <span className="text-[#3B82F6]">from the Himalayas.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
                    Empower your business with next-generation tools designed for speed,
                    scale, and stunning aesthetics.
                </p>
                <div className="flex flex-wrap gap-4 mt-2">
                    <Button variant="primary">Get Started Now</Button>
                    <Button variant="secondary">View Documentation</Button>
                </div>
            </div>

            {/* Right: Animated Map / Illustration Placeholder */}
            <div className="relative w-full aspect-square md:aspect-video lg:aspect-square bg-[#111827] rounded-3xl border border-white/5 overflow-hidden flex items-center justify-center shadow-2xl">
                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#3B82F6]/20 blur-[80px] rounded-full"></div>

                {/* Replace this div with your actual SVG or Lottie animation */}
                <div className="relative text-gray-500 text-sm font-medium flex flex-col items-center gap-4">
                    <svg
                        className="w-24 h-24 text-[#3B82F6] opacity-80"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    [ Interactive Nepal Map ]
                </div>
            </div>
        </section>
    );
};

export default Hero;