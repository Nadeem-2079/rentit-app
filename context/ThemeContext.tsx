import React, { createContext, useContext, useState } from 'react';
// Removed useColorScheme to stop auto-dark mode

const LightTheme = {
  mode: 'light',
  background: '#FFFFFF',
  text: '#000000',
  textSub: '#666666',
  cardBg: '#F5F5F5',
  border: '#E5E5E5',
  icon: '#000000',
  accent: '#000000',
};

const DarkTheme = {
  mode: 'dark',
  background: '#000000',
  text: '#FFFFFF',
  textSub: '#999999',
  cardBg: '#1A1A1A',
  border: '#333333',
  icon: '#FFFFFF',
  accent: '#FFFFFF',
};

const ThemeContext = createContext({
  isDark: false,
  theme: LightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // FORCE FALSE (Light Mode) by default
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const theme = isDark ? DarkTheme : LightTheme;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeProvider;