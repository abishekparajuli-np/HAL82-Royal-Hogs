import axios from "axios";

// =====================================
// CONFIG
// =====================================

const BASE_URL = "http://localhost:5000/api";

// =====================================
// AXIOS INSTANCE
// =====================================

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// =====================================
// REQUEST INTERCEPTOR
// Attach access token automatically
// =====================================

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// =====================================
// RESPONSE INTERCEPTOR
// Auto refresh expired access token
// =====================================

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh_token");

            if (!refreshToken) {
                clearAuth();
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(
                    `${BASE_URL}/auth/refresh`,
                    {},
                    {
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    }
                );

                const { access_token } = response.data;

                localStorage.setItem("access_token", access_token);

                originalRequest.headers.Authorization = `Bearer ${access_token}`;

                return api(originalRequest);

            } catch (refreshError) {
                clearAuth();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// =====================================
// HELPER
// =====================================

function clearAuth() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
}

// =====================================
// AUTH APIs
// =====================================

export const authAPI = {
    register: (data) => api.post("/auth/register", data),
    login: (data) => api.post("/auth/login", data),
    logout: () => api.post("/auth/logout"),
    getMe: () => api.get("/auth/me"),
    refresh: () => api.post("/auth/refresh"),
};

// =====================================
// HATI APIs
// =====================================

export const hatiAPI = {
    chat: (message) =>
        api.post("/hati/chat", { message }),

    arrival: (place, lat, lon) =>
        api.post("/hati/arrival", { place, lat, lon }),

    // ✅ was missing lat and lon
    route: (distance_km, lat, lon) =>
        api.post("/hati/route", { distance_km, lat, lon }),

    weather: (lat, lon) =>
        api.post("/hati/weather", { lat, lon }),

    reset: () =>
        api.post("/hati/reset"),
};
export default api;