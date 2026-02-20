import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { HatiProvider } from "./context/HatiContext";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import CTAFooter from "./components/CTAFooter";

import Login from "./pages/Login";
import Register from "./pages/Register";
import HatiPage from "./pages/HatiPage";
import PlannerPage from "./pages/PlannerPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HatiProvider>
          <div className="min-h-screen bg-[#1A0A00] text-[#F5ECD7] font-serif selection:bg-[#C8972B]/30 flex flex-col">

            <Navbar />

            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Hero />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/hati" element={<HatiPage />} />
                <Route path="/plan" element={<PlannerPage />} />
              </Routes>
            </main>

            <footer className="border-t border-[#C8972B]/10 py-4 text-center">
              <p className="text-[#F5ECD7]/20 text-xs uppercase tracking-widest">
                &copy; {new Date().getFullYear()} HATI · All rights reserved.
              </p>
            </footer>

          </div>
        </HatiProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}