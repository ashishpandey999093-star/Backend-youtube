import { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

const THEMES = ["obsidian", "cyberpunk", "sunset", "light"];

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState("obsidian");

    const cycleTheme = () => {
        setTheme((prev) => {
            const currentIndex = THEMES.indexOf(prev);
            const nextIndex = (currentIndex + 1) % THEMES.length;
            return THEMES[nextIndex];
        });
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme,
            cycleTheme,
            availableThemes: THEMES
        }}>
            <div data-theme={theme}>{children}</div>
        </ThemeContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
    return useContext(ThemeContext);
}