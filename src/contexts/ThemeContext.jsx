'use client';
import { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Lazily initialize from DOM attribute set by inline script
        if (typeof document !== 'undefined') {
            return document.documentElement.getAttribute('data-theme') || 'dark';
        }
        return 'dark';
    });
    const [mounted, setMounted] = useState(false);

    // Set mounted flag after first render to prevent hydration mismatches
    useEffect(() => {
        setMounted(true);
    }, []);

    // Whenever the theme state changes (via the button), update the DOM and localStorage
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('studynotes_theme', theme);
        } catch (e) {
            console.error("Failed to save theme to localStorage", e);
        }
    }, [theme]);

    const isDarkMode = theme === 'dark';
    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, mounted }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
