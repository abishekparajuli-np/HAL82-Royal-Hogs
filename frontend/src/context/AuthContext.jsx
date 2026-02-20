import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // -----------------------------
    // Check authentication on load
    // -----------------------------
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await authAPI.getMe();
                setUser(response.data.user);
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // -----------------------------
    // Login
    // -----------------------------
    const login = async (email, password) => {
        const response = await authAPI.login({
            email,
            password,
        });

        const { user, access_token, refresh_token } = response.data;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        setUser(user);
        return user;
    };

    // -----------------------------
    // Register
    // -----------------------------
    const register = async (email, username, password) => {
        const response = await authAPI.register({
            email,
            username,
            password,
        });

        const { user, access_token, refresh_token } = response.data;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        setUser(user);
        return user;
    };

    // -----------------------------
    // Logout
    // -----------------------------
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        }

        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}