'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedTheme = localStorage.getItem('neonmarket_theme');
        if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light')) {
            setTheme(storedTheme);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (!loading) {
            localStorage.setItem('neonmarket_theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
        }
    }, [theme, loading]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const isDark = theme === 'dark';

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme,
            toggleTheme,
            isDark,
        }}>
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
