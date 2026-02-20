import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError([]);
        setLoading(true);

        try {
            await login(email, password);
            navigate(from, { replace: true });
        } catch (err) {
            console.error('Login error:', err);
            const message =
                err.response?.data?.message || 'Login Failed. Please Try Again';
            setError([message]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A0A00] py-12 px-4"
            style={{ backgroundImage: 'radial-gradient(ellipse at top, rgba(139,26,26,0.12) 0%, transparent 70%), repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(200,151,43,0.03) 40px, rgba(200,151,43,0.03) 80px)' }}>
            <div className="max-w-md w-full">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-3xl mb-2">🐘</div>
                    <h1 className="text-3xl font-bold text-[#C8972B] tracking-wide" style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-[#F5ECD7]/50 text-sm uppercase tracking-widest">Sign in to your account</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <div className="h-px w-16 bg-[#C8972B]/30"></div>
                        <span className="text-[#C8972B]/50 text-xs">❈</span>
                        <div className="h-px w-16 bg-[#C8972B]/30"></div>
                    </div>
                </div>

                {/* Error Display */}
                {error.length > 0 && (
                    <div className="bg-[#8B1A1A]/20 border border-[#8B1A1A]/40 text-[#e07070] p-3 mb-4 rounded-sm text-sm">
                        {error.map((msg, idx) => <p key={idx}>{msg}</p>)}
                    </div>
                )}

                {/* Form Card */}
                <div className="p-6 rounded-sm border border-[#C8972B]/25 bg-[#2A1200]/60 shadow-lg"
                    style={{ boxShadow: '0 4px 32px rgba(139,26,26,0.15), inset 0 0 0 1px rgba(200,151,43,0.08)' }}>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-[#C8972B]/80 mb-1 uppercase tracking-widest">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#1A0A00]/80 border border-[#C8972B]/20 rounded-sm px-3 py-2 text-[#F5ECD7] placeholder-[#F5ECD7]/20 focus:outline-none focus:border-[#C8972B]/60 focus:ring-1 focus:ring-[#C8972B]/20 transition-colors text-sm"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-[#C8972B]/80 mb-1 uppercase tracking-widest">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#1A0A00]/80 border border-[#C8972B]/20 rounded-sm px-3 py-2 text-[#F5ECD7] placeholder-[#F5ECD7]/20 focus:outline-none focus:border-[#C8972B]/60 focus:ring-1 focus:ring-[#C8972B]/20 transition-colors text-sm"
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#8B1A1A] hover:bg-[#C8972B] text-[#F5ECD7] font-semibold tracking-widest uppercase text-sm rounded-sm border border-[#C8972B]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: 'inherit' }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-[#C8972B]/15"></div>
                        <span className="text-[#C8972B]/30 text-xs">❈</span>
                        <div className="h-px flex-1 bg-[#C8972B]/15"></div>
                    </div>

                    {/* Register Link */}
                    <p className="text-center text-[#F5ECD7]/40 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#C8972B] hover:text-[#E8A020] underline underline-offset-2 font-medium transition-colors">
                            Register
                        </Link>
                    </p>
                </div>

                {/* Footer ornament */}
                <p className="text-center mt-6 text-[#C8972B]/20 text-xs tracking-widest uppercase">🇳🇵 HATI · Himalayan Adaptive Travel Intelligence</p>
            </div>
        </div>
    );
}