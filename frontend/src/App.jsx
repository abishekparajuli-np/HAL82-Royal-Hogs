import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTAFooter from "./components/CTAFooter";
export default function App() {
  return (
    // Background and text colors set at the root level
    <div className="min-h-screen bg-[#0B1220] text-[#E5E7EB] font-sans selection:bg-[#3B82F6]/30">
      <Navbar />
      <main>
        <Hero />
        <Features />
      </main>
      <CTAFooter />
    </div>
  );
}