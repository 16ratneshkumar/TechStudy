'use client';
import { createContext, useContext, useState, useEffect } from 'react';
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        // Restore saved preference; if none exists, default is dark
        const saved = localStorage.getItem('studynotes_theme');
        if (saved) {
            setIsDarkMode(saved === 'dark');
        }
        // No saved preference → stays dark (initial state)
    }, []);

    useEffect(() => {
        const theme = isDarkMode ? 'dark' : 'light';
        localStorage.setItem('studynotes_theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [isDarkMode]);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

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
