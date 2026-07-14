'use client';
import { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark');

    // On mount, sync the React state with the DOM (which was already set by the inline script in layout.jsx)
    useEffect(() => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        setTheme(currentTheme);
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
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
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
