import React, { useState, useEffect } from 'react';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import Clock from '../Components/Clock';
import NavBar from '../Components/NavBar/NavBar';
import PrivateRoute from '../shared/PrivateRoute';
import { Prints } from '../features/prints';
import { useTheme } from '../context/ThemeContext';
import { NotesRoutes } from '../features/notes';
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
import { Switch, Space } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';
import LoginPage from '../features/admin/pages/LoginPage';
import Json from '../features/json/pages/JsonViewer';
import './App.css';
import userStore from '../features/admin/store/UserStore';
import { observer } from 'mobx-react-lite';

// Ключ для localStorage
const SIDEBAR_STORAGE_KEY = 'sidebarCollapsed';

// Компонент для определения первой доступной страницы
const FirstAvailablePage = observer(() => {
  const userRoles = userStore.userRolesAuth || [];

  const routesPriority = [
    { path: '/staff', roles: ['ADMIN', 'USER'] },
    { path: '/ipaddress', roles: ['ADMIN', 'IP'] },
    { path: '/prints', roles: ['ADMIN', 'PRINT'] },
    { path: '/badges', roles: ['ADMIN', 'BADGES'] },
    { path: '/usb', roles: ['ADMIN', 'USB'] },
    { path: '/card', roles: ['ADMIN', 'CARD'] },
    { path: '/notes', roles: ['ADMIN', 'NOTES'] },
    { path: '/iuspt', roles: ['ADMIN', 'IUSPT'] },
    { path: '/admin', roles: ['ADMIN'] },
    { path: '/json', roles: ['ADMIN'] },
    { path: '/multiedu', roles: ['ADMIN', 'ST', 'ST-ADMIN'] },
    { path: '/transport', roles: ['ADMIN', 'TRANSPORT', 'TRANSPORT-ORDER'] },
    { path: '/knowledge', roles: ['ADMIN'] },
    { path: '/map', roles: ['ADMIN', 'MAP'] },
  ];

  const getFirstAvailablePath = () => {
    for (const route of routesPriority) {
      if (route.roles.some((role) => userRoles.includes(role))) {
        return route.path;
      }
    }
    return '/login';
  };

  const firstPath = getFirstAvailablePath();
  return <Navigate to={firstPath} replace />;
});

function App() {
  const location = useLocation();

  // ✅ Синхронное чтение из localStorage при инициализации (без прыжков)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return saved === 'true';
  });
  const { isDark, toggleTheme } = useTheme();
  // Сохраняем изменения в localStorage
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  useEffect(() => {
    userStore.fetchUsers();
  }, []);

  const getPageTitle = () => {
    switch (true) {
      case location.pathname === '/' || location.pathname === '/staff':
        return 'ПОЛЬЗОВАТЕЛИ';
      case location.pathname.startsWith('/staff/'):
        return 'ПОЛЬЗОВАТЕЛИ';
      case location.pathname.startsWith('/ipaddress'):
        return 'УЧЁТ IP';
      case location.pathname.startsWith('/prints'):
        return 'УЧЁТ ПРИНТЕРОВ';
      case location.pathname.startsWith('/badges'):
        return 'БЭЙДЖИКИ';
      case location.pathname.startsWith('/usb'):
        return 'УЧЕТ USB';
      case location.pathname.startsWith('/card'):
        return 'УЧЕТ КАРТ ДОСТУПА';
      case location.pathname.startsWith('/notes'):
        return 'ЗАПИСНАЯ КНИЖКА';
      case location.pathname.startsWith('/knowledge'):
        return 'БАЗА ЗНАНИЙ';
      case location.pathname.startsWith('/transport'):
        return 'ЗАЯВКА НА ТРАНСПОРТ';
      case location.pathname.startsWith('/create-post'):
        return 'СОЗДАНИЕ ЗАПИСИ';
      case location.pathname.startsWith('/edit-post/'):
        return 'РЕДАКТИРОВАНИЕ ЗАПИСИ';
      case location.pathname.startsWith('/admin'):
        return 'АДМИНИСТРИРОВАНИЕ';
      case location.pathname.startsWith('/map'):
        return 'КАРТА';
      case location.pathname.startsWith('/iuspt'):
        return 'ИУС П Т';
      case location.pathname.startsWith('/json'):
        return 'JSON Viewer';
      case location.pathname.startsWith('/multiedu'):
        return 'ОБУЧЕНИЕ';
      default:
        return 'ГЛАВНАЯ';
    }
  };

  return (
    <div className="app-container">
      {/* Передаём состояние и функцию изменения в NavBar */}
      <NavBar
        collapsed={sidebarCollapsed}
        onCollapseChange={setSidebarCollapsed}
      />
      <div className={`main-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="page-header sticky-header">
          <div className="header-content">
            <h1 className="page-title">{getPageTitle()}</h1>
            <Space size="middle" className="header-actions">
              <div className="header-clock">
                <Clock />
              </div>
              <Switch
                checkedChildren={<BulbFilled />}
                unCheckedChildren={<BulbOutlined />}
                checked={isDark}
                onChange={toggleTheme}
              />
            </Space>
          </div>
        </div>

        <div className="content-container">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute
                  requiredRole={[
                    'ADMIN',
                    'USER',
                    'IP',
                    'PRINT',
                    'BADGES',
                    'USB',
                    'CARD',
                    'NOTES',
                    'IUSPT',
                    'ST',
                    'ST-ADMIN',
                    'TRANSPORT',
                    'TRANSPORT-ORDER',
                    'MAP',
                  ]}
                >
                  <FirstAvailablePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/staff/*"
              element={
                <PrivateRoute requiredRole={['ADMIN', 'USER']}>
                  <StaffRoutes />
                </PrivateRoute>
              }
            />
            <Route
              path="/ipaddress/*"
              element={
                <PrivateRoute requiredRole={['ADMIN', 'IP']}>
                  <IpRoutes />
                </PrivateRoute>
              }
            />
            <Route
              path="/prints"
              element={
                <PrivateRoute requiredRole={['ADMIN', 'PRINT']}>
                  <Prints />
                </PrivateRoute>
              }
            />
            <Route
              path="/usb/*"
              element={
                <PrivateRoute requiredRole={['ADMIN', 'USB']}>
                  <UsbRoutes />
                </PrivateRoute>
              }
            />
            <Route
              path="/card/*"
              element={
                <PrivateRoute requiredRole={['ADMIN', 'CARD']}>
                  <CardRoutes />
                </PrivateRoute>
              }
            />
            <Route
              path="/badges/*"
              element={
                <PrivateRoute requiredRole={['ADMIN', 'BADGES']}>
                  <BadgesRoutes />
                </PrivateRoute>
              }
            />
            <Route
              path="/knowledge/*"
              element={
                <PrivateRoute requiredRole={['ADMIN', 'NOTES']}>
                  <KnowledgeRoutes />
                </PrivateRoute>
              }
            />
            <Route
              path="/transport/*"
              element={
                <PrivateRoute
                  requiredRole={['ADMIN', 'TRANSPORT', 'TRANSPORT-ORDER']}
                >
                  <TransportRoutes />
                </PrivateRoute>
              }
            />
            <Route
              path="/map/*"
              element={
                <PrivateRoute requiredRole={['ADMIN', 'MAP']}>
                  <MapRoutes />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <PrivateRoute requiredRole={['ADMIN']}>
                  <AdminRoutes />
                </PrivateRoute>
              }
            />
            <Route
              path="/iuspt/*"
              element={
                <PrivateRoute requiredRole={['ADMIN', 'IUSPT']}>
                  <IusPtRoutes />
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/json"
              element={
                <PrivateRoute requiredRole={['ADMIN']}>
                  <Json />
                </PrivateRoute>
              }
            />
            <Route
              path="/multiedu/*"
              element={
                <PrivateRoute requiredRole={['ADMIN', 'ST', 'ST-ADMIN']}>
                  <MultiEduRouters />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <PrivateRoute
                  requiredRole={[
                    'ADMIN',
                    'USER',
                    'IP',
                    'PRINT',
                    'BADGES',
                    'USB',
                    'CARD',
                    'NOTES',
                    'IUSPT',
                    'ST',
                    'ST-ADMIN',
                    'TRANSPORT',
                    'TRANSPORT-ORDER',
                    'MAP',
                  ]}
                >
                  <Navigate to="/" replace />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
