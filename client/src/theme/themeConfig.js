// src/theme/themeConfig.js
import defaultTheme from './themes/default';
import darkOrangeTheme from './themes/darkOrange';
import gazpromClassic from './themes/gazpromClassic';
import gazpromDark from './themes/gazpromDark';

export const themes = {
  default: defaultTheme,
  darkOrange: darkOrangeTheme,
  gazpromClassic: gazpromClassic,
  gazpromDark: gazpromDark,
};

export const DEFAULT_THEME_KEY = 'default';

export const getThemeConfig = (themeKey) => {
  return themes[themeKey]?.config || themes[DEFAULT_THEME_KEY].config;
};