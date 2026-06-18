// features/navbar/components/MenuSection/MenuSection.jsx
import React, { useState, useMemo } from 'react';
import { Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  PrinterOutlined,
  UsbOutlined,
  IdcardOutlined,
  TagOutlined,
  FileTextOutlined,
  SettingOutlined,
  CodeOutlined,
  DashboardOutlined,
  TeamOutlined,
  SafetyOutlined,
  GlobalOutlined,
  BookOutlined,
  ReconciliationOutlined,
  KubernetesOutlined,
  CarOutlined,
  InboxOutlined
} from '@ant-design/icons';
import { useTheme } from '../../../../context/ThemeContext';
import { theme as antdTheme } from 'antd';
import styles from './MenuSection.module.css';

const { useToken } = antdTheme;

const MenuSection = ({ userRolesAuth }) => {
  const location = useLocation();
  const { token } = useToken();
  const { currentTheme } = useTheme();

  const siderTextColor = currentTheme?.siderTextColor || token.colorText;
  const primaryColor = token.colorPrimary;
  const isDark = currentTheme?.isDark || false;
  const hoverBg = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const selectedBg = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';

  const menuVariables = {
    '--menu-text-color': siderTextColor,
    '--menu-primary-color': primaryColor,
    '--menu-hover-bg': hoverBg,
    '--menu-selected-bg': selectedBg,
  };

  const hasAccess = (role) => userRolesAuth.includes(role) || userRolesAuth.includes('ADMIN');

  // Функция для определения openKeys
  const getOpenKeys = useMemo(() => (path) => {
    const keys = [];
    if (path.startsWith('/multiedu') && (hasAccess('ADMIN') || hasAccess('ST-ADMIN'))) {
      keys.push('multi-edu-group');
    }
    if (path.startsWith('/admin') && !path.startsWith('/multiedu/admin') && userRolesAuth.includes('ADMIN')) {
      keys.push('admin');
    }
    return keys;
  }, [hasAccess, userRolesAuth]);

  const [openKeys, setOpenKeys] = useState(() => getOpenKeys(location.pathname));

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const getActualSelectedKeys = useMemo(() => () => {
    const path = location.pathname;
    
    if (path === '/multiedu/admin') return ['/multiedu/admin'];
    if (path === '/multiedu' || path === '/multiedu/') return ['/multiedu'];
    if (path.startsWith('/multiedu/')) {
      if (hasAccess('ST') && !hasAccess('ADMIN') && !hasAccess('ST-ADMIN')) return ['/multiedu'];
      return ['/multiedu'];
    }
    if (path.startsWith('/admin') && !path.startsWith('/multiedu/admin')) {
      if (path === '/admin/' || path === '/admin') return ['/admin/'];
      if (path === '/admin/roles') return ['/admin/roles'];
      if (path === '/admin/create') return ['/admin/create'];
    }
    
    const basePath = `/${path.split('/')[1]}`;
    return [basePath];
  }, [location.pathname, hasAccess]);

  const actualSelectedKeys = getActualSelectedKeys();

  const menuItems = useMemo(() => {
    const items = [];
    
    if (hasAccess('USER')) {
      items.push({ key: '/staff', icon: <TeamOutlined />, label: <Link to="/staff">ПОЛЬЗОВАТЕЛИ</Link> });
    }
    if (hasAccess('CONSUMABLES')) {
      items.push({ key: '/consumables', icon: <InboxOutlined />, label: <Link to="/consumables">РАСХОДНЫЕ МАТЕРИАЛЫ</Link> });
    }
    if (hasAccess('IP')) {
      items.push({ key: '/ipaddress', icon: <KubernetesOutlined />, label: <Link to="/ipaddress">УЧЕТ IP</Link> });
    }
    if (hasAccess('PRINT')) {
      items.push({ key: '/prints', icon: <PrinterOutlined />, label: <Link to="/prints">ПРИНТЕРЫ</Link> });
    }
    if (hasAccess('USB')) {
      items.push({ key: '/usb', icon: <UsbOutlined />, label: <Link to="/usb">УЧЕТ USB</Link> });
    }
    if (hasAccess('CARD')) {
      items.push({ key: '/card', icon: <IdcardOutlined />, label: <Link to="/card">УЧЕТ КАРТ ДОСТУПА</Link> });
    }
    if (hasAccess('BADGES')) {
      items.push({ key: '/badges', icon: <TagOutlined />, label: <Link to="/badges">БЕЙДЖИКИ</Link> });
    }
    if (hasAccess('NOTES')) {
      items.push({ key: '/knowledge', icon: <FileTextOutlined />, label: <Link to="/knowledge">БАЗА ЗНАНИЙ</Link> });
    }
    if (hasAccess('TRANSPORT') || hasAccess('TRANSPORT-ORDER')) {
      items.push({ key: '/transport', icon: <CarOutlined />, label: <Link to="/transport">ЗАЯВКА НА ТРАНСПОРТ</Link> });
    }
    if (hasAccess('MAP')) {
      items.push({ key: '/map', icon: <GlobalOutlined />, label: <Link to="/map">КАРТА</Link> });
    }
    if (hasAccess('IUSPT')) {
      items.push({ key: '/iuspt', icon: <DashboardOutlined />, label: <Link to="/iuspt">ИУС П Т</Link> });
    }
    if (hasAccess('JSON')) {
      items.push({ key: '/json', icon: <CodeOutlined />, label: <Link to="/json">JSON</Link> });
    }
    
    // Обучение
    if (hasAccess('ST') || hasAccess('ADMIN') || hasAccess('ST-ADMIN')) {
      if (hasAccess('ADMIN') || hasAccess('ST-ADMIN')) {
        items.push({
          key: 'multi-edu-group',
          icon: <ReconciliationOutlined />,
          label: 'Обучение',
          children: [
            { key: '/multiedu', label: <Link to="/multiedu">Обучение</Link>, icon: <BookOutlined /> },
            { key: '/multiedu/admin', label: <Link to="/multiedu/admin">Администрирование</Link>, icon: <SettingOutlined /> },
          ],
        });
      } else {
        items.push({ key: '/multiedu', icon: <ReconciliationOutlined />, label: <Link to="/multiedu">Обучение</Link> });
      }
    }
    
    // Админ
    if (userRolesAuth.includes('ADMIN')) {
      items.push({
        key: 'admin',
        icon: <SettingOutlined />,
        label: 'АДМИН',
        children: [
          { key: '/admin/', icon: <TeamOutlined />, label: <Link to="/admin/">Пользователи</Link> },
          { key: '/admin/roles', icon: <SafetyOutlined />, label: <Link to="/admin/roles">Справочник ролей</Link> },
          { key: '/admin/create', icon: <UserOutlined />, label: <Link to="/admin/create">Создание пользователя</Link> },
        ],
      });
    }
    
    return items;
  }, [hasAccess, userRolesAuth]);

  return (
    <div style={menuVariables}>
      <Menu
        mode="inline"
        selectedKeys={actualSelectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        items={menuItems}
        className={styles.menu}
      />
    </div>
  );
};

export default MenuSection;