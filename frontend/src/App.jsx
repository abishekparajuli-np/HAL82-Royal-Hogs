import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";  // ✅ import this

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import CTAFooter from "./components/CTAFooter";

import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider> {/* ✅ Wrap everything inside this */}
        <div className="min-h-screen bg-[#0B1220] text-[#E5E7EB] font-sans selection:bg-[#3B82F6]/30">

          <Navbar />

          <main>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Hero />
                    <Features />
                  </>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>

          <CTAFooter />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}