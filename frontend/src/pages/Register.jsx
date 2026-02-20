import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Alert from "../components/Alert";
import logo from "../assets/logo.png";

const inputClass = `
    w-full bg-white border border-[rgba(184,137,42,0.25)] rounded-lg px-4 py-2.5
    text-[#2A1608] placeholder-[rgba(61,32,16,0.3)]
    focus:outline-none focus:border-[#B8892A] focus:ring-2 focus:ring-[rgba(184,137,42,0.12)]
    transition-all duration-200 text-sm font-[inherit]
`.replace(/\s+/g, " ").trim();

const labelClass = "block text-xs font-semibold text-[#6B3D1E] mb-1.5 uppercase tracking-widest";

export default function Register() {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
        dob: "",
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    // Destructure both register AND login so we can auto-login after registration
    const { register, login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const validationErrors = [];

        if (formData.password !== formData.confirmPassword)
            validationErrors.push("Passwords do not match");
        if (formData.password.length < 8)
            validationErrors.push("Password must be at least 8 characters");
        if (formData.username.length < 3)
            validationErrors.push("Username must be at least 3 characters");
        if (validationErrors.length > 0) { setErrors(validationErrors); return; }

        setLoading(true);
        try {
            // 1. Register the account
            await register(formData.email, formData.username, formData.password, formData.dob);

            // 2. Auto-login so the user lands on the app already authenticated.
            //    If your `register()` function already sets auth state internally,
            //    you can remove this login() call — the navigate below is enough.
            try {
                await login(formData.email, formData.password);
            } catch {
                // If auto-login fails (e.g. email-verification required),
                // just continue — the user can sign in manually.
            }

            navigate("/");
        } catch (err) {
            console.error("Registration error:", err);
            const messages =
                err.response?.data?.messages ||
                [err.response?.data?.message] ||
                ["Registration failed. Please try again."];
            setErrors(messages.filter(Boolean));
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
                        style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif", color: "#2A1608" }}
                    >
                        Create Account
                    </h1>

                    <p className="mt-1.5 text-sm uppercase tracking-widest" style={{ color: "#9C6840" }}>
                        Begin your Himalayan journey
                    </p>

                    <div className="mt-4 flex items-center justify-center gap-2">
                        <div className="h-0.5 w-14 rounded-full" style={{ background: "linear-gradient(90deg, transparent, #B8892A)" }} />
                        <span style={{ color: "#B8892A", fontSize: "0.8rem" }}>❈</span>
                        <div className="h-0.5 w-14 rounded-full" style={{ background: "linear-gradient(270deg, transparent, #B8892A)" }} />
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
                    {errors.length > 0 && <Alert type="error" messages={errors} />}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className={labelClass}>Email</label>
                            <input
                                id="email" name="email" type="email"
                                value={formData.email} onChange={handleChange}
                                className={inputClass} placeholder="you@example.com"
                                required autoComplete="email"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className={labelClass}>Username</label>
                            <input
                                id="username" name="username" type="text"
                                value={formData.username} onChange={handleChange}
                                className={inputClass} placeholder="traveler_name"
                                required autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className={labelClass}>Password</label>
                            <input
                                id="password" name="password" type="password"
                                value={formData.password} onChange={handleChange}
                                className={inputClass} placeholder="••••••••"
                                required autoComplete="new-password"
                            />
                            <p className="mt-1.5 text-xs italic" style={{ color: "rgba(61,32,16,0.4)" }}>
                                At least 8 characters with uppercase, lowercase, and a number.
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
                            <input
                                id="confirmPassword" name="confirmPassword" type="password"
                                value={formData.confirmPassword} onChange={handleChange}
                                className={inputClass} placeholder="••••••••"
                                required autoComplete="new-password"
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
                            {loading ? "Creating account…" : "Create Account"}
                        </button>
                    </form>

                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1" style={{ background: "rgba(184,137,42,0.18)" }} />
                        <span style={{ color: "rgba(184,137,42,0.5)", fontSize: "0.8rem" }}>❈</span>
                        <div className="h-px flex-1" style={{ background: "rgba(184,137,42,0.18)" }} />
                    </div>

                    <p className="text-center text-sm" style={{ color: "#6B3D1E" }}>
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold underline underline-offset-2 transition-colors duration-200"
                            style={{ color: "#9B2335", textDecorationColor: "rgba(155,35,53,0.4)" }}
                            onMouseEnter={e => e.currentTarget.style.color = "#7D1C2B"}
                            onMouseLeave={e => e.currentTarget.style.color = "#9B2335"}
                        >
                            Sign in
                        </Link>
                    </p>
                </div>

                <p className="text-center mt-6 text-xs tracking-widest uppercase" style={{ color: "rgba(61,32,16,0.3)" }}>
                    🇳🇵 HATI · Himalayan Adaptive Travel Intelligence
                </p>
            </div>
        </div>
    );
}