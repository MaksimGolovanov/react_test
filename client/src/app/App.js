// app/App.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { Space, theme, Spin } from 'antd';
import { observer } from 'mobx-react-lite';
import Clock from '../Components/Clock';
import NavBar from '../Components/NavBar/NavBar';
import PrivateRoute from '../shared/PrivateRoute';
import { Prints } from '../features/prints';
import { IusPtRoutes } from '../features/ius-pt';
import { StaffRoutes } from '../features/staff';
import { AdminRoutes } from '../features/admin';
import { IpRoutes } from '../features/ip';
import { BadgesRoutes } from '../features/badges';
import { UsbRoutes } from '../features/usb';
import { CardRoutes } from '../features/card';
import { MultiEduRouters } from '../features/MultiEdu';
import { TransportRoutes } from '../features/transport';
import { KnowledgeRoutes } from '../features/knowledge-base';
import { MapRoutes } from '../features/map';
import LoginPage from '../features/admin/pages/LoginPage';
import ThemeSwitcher from '../Components/ThemeSwitcher';
import Json from '../features/json/pages/JsonViewer';
import './App.css';
import userStore from '../features/admin/store/UserStore';
import { getFirstAvailablePath } from '../shared/routesConfig';
import { ConsumablesRoutes } from '../features/consumables';

const { useToken } = theme;
const SIDEBAR_STORAGE_KEY = 'sidebarCollapsed';

// Компонент-редирект на первую доступную страницу
const FirstAvailablePage = observer(() => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Ждем полной загрузки данных
    if (!userStore.initialized || userStore.loading) {
      return;
    }
    
    if (!userStore.isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }
    
    const firstPath = getFirstAvailablePath(userStore.userRolesAuth);
    navigate(firstPath, { replace: true });
  }, [userStore.initialized, userStore.loading, userStore.isAuthenticated, userStore.userRolesAuth, navigate]);
  
  return <Spin size="large" style={{ position: 'fixed', top: '50%', left: '50%' }} />;
});

const App = observer(() => {
  const { token } = useToken();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/' || path === '/staff') return 'ПОЛЬЗОВАТЕЛИ';
    if (path.startsWith('/staff/')) return 'ПОЛЬЗОВАТЕЛИ';
    if (path.startsWith('/consumables')) return 'РАСХОДНЫЕ МАТЕРИАЛЫ';
    if (path.startsWith('/ipaddress')) return 'УЧЁТ IP';
    if (path.startsWith('/prints')) return 'УЧЁТ ПРИНТЕРОВ';
    if (path.startsWith('/badges')) return 'БЭЙДЖИКИ';
    if (path.startsWith('/usb')) return 'УЧЕТ USB';
    if (path.startsWith('/card')) return 'УЧЕТ КАРТ ДОСТУПА';
    if (path.startsWith('/knowledge')) return 'БАЗА ЗНАНИЙ';
    if (path.startsWith('/transport')) return 'ЗАЯВКА НА ТРАНСПОРТ';
    if (path.startsWith('/map')) return 'КАРТА';
    if (path.startsWith('/iuspt')) return 'ИУС П Т';
    if (path.startsWith('/json')) return 'JSON Viewer';
    if (path.startsWith('/multiedu')) return 'ОБУЧЕНИЕ';
    if (path.startsWith('/admin')) return 'АДМИНИСТРИРОВАНИЕ';
    
    return 'ГЛАВНАЯ';
  };

  // Показываем спиннер пока данные загружаются
  if (!userStore.initialized) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="Загрузка..." />
      </div>
    );
  }

  // Если не авторизован - показываем страницу логина без сайдбара
  if (!userStore.isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="app-container" style={{ backgroundColor: token.colorBgLayout }}>
      <NavBar collapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div
          className="page-header sticky-header"
          style={{
            backgroundColor: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorder}`,
            boxShadow: token.boxShadowTertiary,
          }}
        >
          <div className="header-content">
            <h1
              className="page-title"
              style={{ color: token.colorTextHeading || token.colorText }}
            >
              {getPageTitle()}
            </h1>
            <Space size="middle" className="header-actions">
              <div className="header-clock">
                <Clock />
              </div>
              <ThemeSwitcher />
            </Space>
          </div>
        </div>

        <div className="content-container" style={{ backgroundColor: token.colorBgLayout }}>
          <Routes>
            <Route path="/" element={<FirstAvailablePage />} />
            <Route path="/staff/*" element={<PrivateRoute requiredRole={['ADMIN','USER']}><StaffRoutes /></PrivateRoute>} />
            <Route path="/consumables/*" element={<PrivateRoute requiredRole={['ADMIN', 'CONSUMABLES']}><ConsumablesRoutes /></PrivateRoute>} />
            <Route path="/ipaddress/*" element={<PrivateRoute requiredRole={['ADMIN','IP']}><IpRoutes /></PrivateRoute>} />
            <Route path="/prints/*" element={<PrivateRoute requiredRole={['ADMIN','PRINT']}><Prints /></PrivateRoute>} />
            <Route path="/usb/*" element={<PrivateRoute requiredRole={['ADMIN','USB']}><UsbRoutes /></PrivateRoute>} />
            <Route path="/card/*" element={<PrivateRoute requiredRole={['ADMIN','CARD']}><CardRoutes /></PrivateRoute>} />
            <Route path="/badges/*" element={<PrivateRoute requiredRole={['ADMIN','BADGES']}><BadgesRoutes /></PrivateRoute>} />
            <Route path="/knowledge/*" element={<PrivateRoute requiredRole={['ADMIN','NOTES']}><KnowledgeRoutes /></PrivateRoute>} />
            <Route path="/transport/*" element={<PrivateRoute requiredRole={['ADMIN','TRANSPORT','TRANSPORT-ORDER']}><TransportRoutes /></PrivateRoute>} />
            <Route path="/map/*" element={<PrivateRoute requiredRole={['ADMIN','MAP']}><MapRoutes /></PrivateRoute>} />
            <Route path="/admin/*" element={<PrivateRoute requiredRole={['ADMIN']}><AdminRoutes /></PrivateRoute>} />
            <Route path="/iuspt/*" element={<PrivateRoute requiredRole={['ADMIN','IUSPT']}><IusPtRoutes /></PrivateRoute>} />
            <Route path="/json" element={<PrivateRoute requiredRole={['ADMIN']}><Json /></PrivateRoute>} />
            <Route path="/multiedu/*" element={<PrivateRoute requiredRole={['ADMIN','ST','ST-ADMIN']}><MultiEduRouters /></PrivateRoute>} />
            <Route
              path="*"
              element={
                <PrivateRoute requiredRole={['ADMIN','USER','IP','PRINT','BADGES','USB','CARD','NOTES','IUSPT','ST','ST-ADMIN','TRANSPORT','TRANSPORT-ORDER','MAP','CONSUMABLES']}>
                  <Navigate to="/" replace />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
});

export default App;