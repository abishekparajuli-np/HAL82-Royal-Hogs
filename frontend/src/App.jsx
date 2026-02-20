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

          <div
            className="min-h-screen flex flex-col font-serif"
            style={{
              backgroundColor: "#F9F3E8",
              color: "#2A1608",
            }}
          >
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

            {/* Footer */}
            <footer
              style={{
                backgroundColor: "#F0E6D0",
                borderTop: "1px solid rgba(184,137,42,0.2)",
              }}
              className="py-6 text-center"
            >
              <p
                className="text-xs uppercase tracking-widest"
                style={{ color: "rgba(61,32,16,0.4)" }}
              >
                &copy; {new Date().getFullYear()} HATI &middot; All rights reserved.
              </p>
            </footer>

          </div>

        </HatiProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}