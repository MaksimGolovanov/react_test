// context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { DEFAULT_THEME_KEY, themes } from '../theme/themeConfig';

const ThemeContext = createContext();
const THEME_STORAGE_KEY = 'appTheme';

export const ThemeProvider = ({ children }) => {
  const [currentThemeKey, setCurrentThemeKey] = useState(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved && themes[saved] ? saved : DEFAULT_THEME_KEY;
  });

  const changeTheme = (newThemeKey) => {
    if (themes[newThemeKey]) {
      setCurrentThemeKey(newThemeKey);
      localStorage.setItem(THEME_STORAGE_KEY, newThemeKey);
    }
  };

  // Удаляем useEffect, который добавлял/удалял класс dark-theme на body
  // Теперь тема полностью управляется ConfigProvider

  const currentTheme = themes[currentThemeKey];
  const isDark = currentTheme?.mode === 'dark';

  return (
    <ThemeContext.Provider value={{ 
      currentThemeKey, 
      changeTheme, 
      currentTheme,
      isDark
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};