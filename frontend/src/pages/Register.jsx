
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
            validationErrors.push('Passwords must be atleast 8 characters');
        }

        if (formData.username.length < 3) {
            validationErrors.push('Username should be at least 3 characters')
        }
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        setLoading(true);
        try {
            await register(formData.email, formData.username, formData.password, formData.dob)
            navigate('/');
        } catch (err) {
            console.error('Registration error:', err);
            const messages =
                err.response?.data?.messsages ||
                [err.response?.data?.message] ||
                ['Registration failed. Please Try again.'];
            setErrors(messages.filter(Boolean));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Create account</h1>
                    <p className="mt-2 text-gray-600">Join Ratna Forum today</p>
                </div>

                {/* Form Card */}
                <div className="card">
                    <Alert type="error" messages={errors} />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="input"
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                            />
                        </div>

                        {/* Username Field */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                className="input"
                                placeholder="johndoe"
                                required
                                autoComplete="username"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input"
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                At least 8 characters with uppercase, lowercase, and number
                            </p>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input"
                                placeholder="••••••••"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn btn-primary py-3"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-6 text-center text-gray-600">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-primary-600 hover:underline font-medium"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
