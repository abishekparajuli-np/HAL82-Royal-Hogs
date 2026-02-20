import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { Link } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        dob: '',
    });
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        const validationErrors = [];

        if (formData.password !== formData.confirmPassword) {
            validationErrors.push('Passwords do not match');
        }
        if (formData.password.length < 8) {
            validationErrors.push('Passwords must be at least 8 characters');
        }
        if (formData.username.length < 3) {
            validationErrors.push('Username should be at least 3 characters');
        }
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        try {
            await register(formData.email, formData.username, formData.password, formData.dob);
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);
            const messages =
                err.response?.data?.messsages ||
                [err.response?.data?.message] ||
                ['Registration failed. Please try again.'];
            setErrors(messages.filter(Boolean));
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full bg-[#1A0A00]/80 border border-[#C8972B]/20 rounded-sm px-3 py-2 text-[#F5ECD7] placeholder-[#F5ECD7]/20 focus:outline-none focus:border-[#C8972B]/60 focus:ring-1 focus:ring-[#C8972B]/20 transition-colors text-sm";
    const labelClass = "block text-xs font-medium text-[#C8972B]/80 mb-1 uppercase tracking-widest";

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-[#1A0A00] py-12 px-4"
            style={{ backgroundImage: 'radial-gradient(ellipse at top, rgba(139,26,26,0.12) 0%, transparent 70%), repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(200,151,43,0.03) 40px, rgba(200,151,43,0.03) 80px)' }}
        >
            <div className="max-w-md w-full">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="text-3xl mb-2">🐘</div>
                    <h1 className="text-3xl font-bold text-[#C8972B] tracking-wide" style={{ fontFamily: "'Tiro Devanagari Sanskrit', serif" }}>
                        Create Account
                    </h1>
                    <p className="mt-2 text-[#F5ECD7]/50 text-sm uppercase tracking-widest">Begin your Himalayan journey</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <div className="h-px w-16 bg-[#C8972B]/30"></div>
                        <span className="text-[#C8972B]/50 text-xs">❈</span>
                        <div className="h-px w-16 bg-[#C8972B]/30"></div>
                    </div>
                </div>

                {/* Form Card */}
                <div
                    className="p-6 rounded-sm border border-[#C8972B]/25 bg-[#2A1200]/60 shadow-lg"
                    style={{ boxShadow: '0 4px 32px rgba(139,26,26,0.15), inset 0 0 0 1px rgba(200,151,43,0.08)' }}
                >
                    {/* Error Alert */}
                    {errors.length > 0 && (
                        <div className="bg-[#8B1A1A]/20 border border-[#8B1A1A]/40 text-[#e07070] p-3 mb-5 rounded-sm text-sm space-y-1">
                            <Alert type="error" messages={errors} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className={labelClass}>Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Username */}
                        <div>
                            <label htmlFor="username" className={labelClass}>Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="traveler_name"
                                required
                                autoComplete="username"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className={labelClass}>Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                            />
                            <p className="mt-1 text-xs text-[#F5ECD7]/25 italic">
                                At least 8 characters with uppercase, lowercase, and number
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className={labelClass}>Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#8B1A1A] hover:bg-[#C8972B] text-[#F5ECD7] font-semibold tracking-widest uppercase text-sm rounded-sm border border-[#C8972B]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ fontFamily: 'inherit' }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-5 flex items-center gap-3">
                        <div className="h-px flex-1 bg-[#C8972B]/15"></div>
                        <span className="text-[#C8972B]/30 text-xs">❈</span>
                        <div className="h-px flex-1 bg-[#C8972B]/15"></div>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-[#F5ECD7]/40 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#C8972B] hover:text-[#E8A020] underline underline-offset-2 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Footer stamp */}
                <p className="text-center mt-6 text-[#C8972B]/20 text-xs tracking-widest uppercase">🇳🇵 HATI · Himalayan Adaptive Travel Intelligence</p>
            </div>
        </div>
    );
}