import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { observer } from 'mobx-react';
import userStore from './features/admin/store/UserStore';
import 'antd/dist/reset.css';
import './app/App.css';
import App from './app/App';
import LoginPage from './features/admin/pages/LoginPage';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { getThemeConfig } from './theme/themeConfig';

const ThemedApp = observer(() => {
  const { currentThemeKey } = useTheme();
  const themeConfig = getThemeConfig(currentThemeKey);

  return (
    <ConfigProvider locale={ruRU} theme={themeConfig}>
      {userStore.isAuthenticated ? <App /> : <LoginPage />}
    </ConfigProvider>
  );
});

const Root = () => (
  <Router>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Root />);