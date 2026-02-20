import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { hatiAPI } from '../services/api';

const HatiContext = createContext();

export function HatiProvider({ children }) {
    const [messages, setMessages] = useState([]);
    const [busy, setBusy] = useState(false);
    const [weather, setWeather] = useState(null);
    const [routeOptions, setRouteOptions] = useState([]);
    const [origin, setOrigin] = useState(null);
    const [dest, setDest] = useState(null);
    const [activeTab, setActiveTab] = useState('map');

    const addMsg = useCallback((role, text, extras = {}) => {
        setMessages(prev => [
            ...prev,
            { id: Date.now() + Math.random(), role, text, ...extras }
        ]);
    }, []);

    const sendMessage = useCallback(async (text) => {
        if (busy) return;
        setBusy(true);
        addMsg('user', text);
        try {
            const { data } = await hatiAPI.chat(text);
            addMsg('bot', data.response || data.error);
        } catch {
            addMsg('bot', '⚠️ Could not reach HATI. Please try again.');
        } finally {
            setBusy(false);
        }
    }, [busy, addMsg]);

    const triggerArrival = useCallback(async (place, lat, lon) => {
        if (busy) return;
        setBusy(true);
        setActiveTab('chat');
        addMsg('user', `I just arrived at ${place.split(',')[0]}!`);
        try {
            const { data } = await hatiAPI.arrival(place, lat, lon);
            addMsg('bot', data.response, {
                images: data.images || [],
                isArrival: true,
            });
            if (data.weather) {
                setWeather(data.weather);
                const w = data.weather;
                if (w.temp !== undefined) {
                    addMsg('bot',
                        `${w.icon || '🌤️'} Current weather: ${w.description}, ${w.temp}°C ` +
                        `(feels like ${w.feels_like}°C), wind ${w.wind_kmh} km/h, humidity ${w.humidity}%.`
                    );
                }
            }
        } catch {
            addMsg('bot', `Namaste! 🙏 Welcome to ${place.split(',')[0]}! Ask me anything about this place.`);
        } finally {
            setBusy(false);
        }
    }, [busy, addMsg]);

    const fetchRoute = useCallback(async (distKm, lat, lon) => {
        try {
            const { data } = await hatiAPI.route(distKm, lat, lon);
            if (data.options) setRouteOptions(data.options);
            if (data.weather) setWeather(data.weather);
            return data;
        } catch {
            return null;
        }
    }, []);

    const fetchWeather = useCallback(async (lat, lon) => {
        try {
            const { data } = await hatiAPI.weather(lat, lon);
            setWeather(data);
        } catch { /* silent */ }
    }, []);

    const reset = useCallback(async () => {
        setMessages([]);
        setWeather(null);
        setRouteOptions([]);
        setOrigin(null);
        setDest(null);
        try { await hatiAPI.reset(); } catch { /* silent */ }
    }, []);

    return (
        <HatiContext.Provider value={{
            messages, busy, weather, routeOptions,
            origin, setOrigin, dest, setDest,
            activeTab, setActiveTab,
            addMsg, sendMessage, triggerArrival,
            fetchRoute, fetchWeather, reset,
        }}>
            {children}
        </HatiContext.Provider>
    );
}

export const useHati = () => useContext(HatiContext);