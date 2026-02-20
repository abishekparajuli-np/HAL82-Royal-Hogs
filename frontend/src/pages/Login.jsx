import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import logo from "../assets/logo.png"

const inputClass = `
    w-full bg-white border border-[rgba(184,137,42,0.25)] rounded-lg px-4 py-2.5
    text-[#2A1608] placeholder-[rgba(61,32,16,0.3)]
    focus:outline-none focus:border-[#B8892A] focus:ring-2 focus:ring-[rgba(184,137,42,0.12)]
    transition-all duration-200 text-sm font-[inherit]
`.replace(/\s+/g, " ").trim();

const labelClass = "block text-xs font-semibold text-[#6B3D1E] mb-1.5 uppercase tracking-widest";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError([]);
        setLoading(true);
        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            console.error("Login error:", err);
            const message =
                err.response?.data?.message || "Login failed. Please try again.";
            setError([message]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center py-12 px-4"
            style={{ backgroundColor: "#F9F3E8" }}
        >
            <div className="max-w-md w-full">

                {/* ── Header ── */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center justify-center w-14 h-14 rounded-2xl text-2xl mb-4"
                        style={{
                            background: "linear-gradient(135deg, #9B2335, #C4445A)",
                            boxShadow: "0 4px 16px rgba(155,35,53,0.28)",
                        }}
                    >
                        <img
                            src={logo}
                            alt="Hati Logo"
                            className="w-full h-full object-contain rounded-lg"
                        />
                    </div>

                    <h1
                        className="text-3xl font-bold tracking-wide"
                        style={{
                            fontFamily: "'Tiro Devanagari Sanskrit', serif",
                            color: "#2A1608",
                        }}
                    >
                        Welcome Back
                    </h1>

                    <p
                        className="mt-1.5 text-sm uppercase tracking-widest"
                        style={{ color: "#9C6840" }}
                    >
                        Sign in to your account
                    </p>

                    {/* Gold rule */}
                    <div className="mt-4 flex items-center justify-center gap-2">
                        <div
                            className="h-0.5 w-14 rounded-full"
                            style={{ background: "linear-gradient(90deg, transparent, #B8892A)" }}
                        />
                        <span style={{ color: "#B8892A", fontSize: "0.8rem" }}>❈</span>
                        <div
                            className="h-0.5 w-14 rounded-full"
                            style={{ background: "linear-gradient(270deg, transparent, #B8892A)" }}
                        />
                    </div>
                </div>

                {/* ── Form Card ── */}
                <div
                    className="p-7 rounded-2xl"
                    style={{
                        background: "#FFFFFF",
                        border: "1px solid rgba(184,137,42,0.18)",
                        boxShadow: "0 4px 32px rgba(61,32,16,0.09), 0 1px 4px rgba(61,32,16,0.06)",
                    }}
                >
                    {/* Error alert */}
                    {error.length > 0 && (
                        <Alert type="error" messages={error} />
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className={labelClass}>Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className={inputClass}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className={labelClass}>Password</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className={inputClass}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 font-semibold tracking-widest uppercase text-sm rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: loading ? "#C4445A" : "#9B2335",
                                color: "#FFFFFF",
                                border: "none",
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "inherit",
                                boxShadow: "0 2px 12px rgba(155,35,53,0.25)",
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#7D1C2B"; }}
                            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#9B2335"; }}
                        >
                            {loading ? "Signing in…" : "Sign In"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1" style={{ background: "rgba(184,137,42,0.18)" }} />
                        <span style={{ color: "rgba(184,137,42,0.5)", fontSize: "0.8rem" }}>❈</span>
                        <div className="h-px flex-1" style={{ background: "rgba(184,137,42,0.18)" }} />
                    </div>

                    {/* Register link */}
                    <p className="text-center text-sm" style={{ color: "#6B3D1E" }}>
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold underline underline-offset-2 transition-colors duration-200"
                            style={{ color: "#9B2335", textDecorationColor: "rgba(155,35,53,0.4)" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#7D1C2B"}
                            onMouseLeave={e => e.currentTarget.style.color = "#9B2335"}
                        >
                            Register
                        </Link>
                    </p>
                </div>

                {/* Footer stamp */}
                <p
                    className="text-center mt-6 text-xs tracking-widest uppercase"
                    style={{ color: "rgba(61,32,16,0.3)" }}
                >
                    🇳🇵 HATI · Himalayan Adaptive Travel Intelligence
                </p>

            </div>
        </div>
    );
}