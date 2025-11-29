import React, { createContext, useContext, useState, useEffect } from 'react';

interface Theme {
    name: string;
    bg: string;
    bgSecondary: string;
    bgTertiary: string;
    textMain: string;
    textMuted: string;
    textAccent: string;
    textHighlight: string;
    border: string;
    borderAccent: string;
    borderHighlight: string;
    accentBg: string;
    accentHover: string;
    corner: string;
    progressFill: string;
    selection: string;
    playBtn: string;
    sidebarActive: string;
    sidebarHover: string;
    sidebarDecor: string;
}

interface ThemeContextType {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    t: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
        return savedTheme || 'dark';
    });

    const themes: Record<'dark' | 'light', Theme> = {
        dark: {
            name: 'Vampiric Silver',
            bg: 'bg-black',
            bgSecondary: 'bg-neutral-900',
            bgTertiary: 'bg-neutral-950',
            textMain: 'text-stone-300',
            textMuted: 'text-stone-500',
            textAccent: 'text-red-600',
            textHighlight: 'text-stone-100',
            border: 'border-neutral-800',
            borderAccent: 'border-red-900',
            borderHighlight: 'border-stone-400',
            accentBg: 'bg-red-900',
            accentHover: 'hover:text-red-400',
            corner: 'border-red-600/50',
            progressFill: 'bg-red-700',
            selection: 'selection:bg-red-900/30 selection:text-red-100',
            playBtn: 'border-red-500 text-red-500 hover:bg-red-600 hover:text-black hover:border-red-600',
            sidebarActive: 'text-red-400 bg-neutral-900',
            sidebarHover: 'hover:text-stone-100',
            sidebarDecor: 'bg-gradient-to-b from-red-800 to-red-500',
        },
        light: {
            name: 'Royal Gold',
            bg: 'bg-stone-50',
            bgSecondary: 'bg-white',
            bgTertiary: 'bg-purple-50/50',
            textMain: 'text-purple-950',
            textMuted: 'text-purple-900/40',
            textAccent: 'text-amber-600',
            textHighlight: 'text-purple-900',
            border: 'border-purple-100',
            borderAccent: 'border-amber-400',
            borderHighlight: 'border-amber-500',
            accentBg: 'bg-purple-100',
            accentHover: 'hover:text-amber-600',
            corner: 'border-amber-400',
            progressFill: 'bg-purple-700',
            selection: 'selection:bg-amber-200 selection:text-purple-900',
            playBtn: 'border-amber-500 text-purple-800 hover:bg-amber-400 hover:text-purple-900 hover:border-amber-400',
            sidebarActive: 'text-purple-900 bg-purple-50',
            sidebarHover: 'hover:text-purple-600',
            sidebarDecor: 'bg-gradient-to-b from-amber-400 to-purple-600',
        }
    };

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = (): void => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const t = themes[theme];

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, t }}>
            {children}
        </ThemeContext.Provider>
    );
};