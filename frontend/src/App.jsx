import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { HatiProvider } from "./context/HatiContext";   // ✅ add this

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTAFooter from "./components/CTAFooter";

import Login from "./pages/Login";
import Register from "./pages/Register";
import HatiPage from "./pages/HatiPage";  // ✅ add this

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HatiProvider> {/* ✅ Wrap inside Auth so it has access to JWT */}

          <div className="min-h-screen bg-[#0B1220] text-[#E5E7EB] font-sans selection:bg-[#3B82F6]/30">

            <Navbar />

            <main>
              <Routes>

                {/* Home */}
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <Features />
                    </>
                  }
                />

                {/* Auth */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* HATI Travel AI */}
                <Route path="/hati" element={<HatiPage />} />

              </Routes>
            </main>

            <CTAFooter />
          </div>

        </HatiProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}