import React, { useState, useEffect } from 'react';
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
} from '@ant-design/icons';
import styles from './MenuSection.module.css';

const MenuSection = ({ userRolesAuth }) => {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);
  const [openKeys, setOpenKeys] = useState([]);

  const hasAccess = (role) => {
    return userRolesAuth.includes(role) || userRolesAuth.includes('ADMIN');
  };

  useEffect(() => {
    setSelectedKeys([location.pathname]);
    
    // Автоматически открываем соответствующее меню
    const path = location.pathname;
    const newOpenKeys = [];
    
    if (path.startsWith('/multiedu') && (hasAccess('ADMIN') || hasAccess('ST-ADMIN'))) {
      newOpenKeys.push('multi-edu-group');
    } else if (
      path.startsWith('/admin') &&
      !path.startsWith('/multiedu/admin') &&
      userRolesAuth.includes('ADMIN')
    ) {
      newOpenKeys.push('admin');
    }
    
    setOpenKeys(newOpenKeys);
  }, [location.pathname, userRolesAuth]);

  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]);
    } else {
      setOpenKeys([]);
    }
  };

  // Функция для определения selectedKeys
  const getActualSelectedKeys = () => {
    const path = location.pathname;
    
    // 1. Админка обучения
    if (path === '/multiedu/admin') {
      return ['/multiedu/admin'];
    }
    
    // 2. Главная страница обучения
    if (path === '/multiedu' || path === '/multiedu/') {
      return ['/multiedu'];
    }
    
    // 3. Любые другие страницы обучения
    if (path.startsWith('/multiedu/')) {
      // Для обычных пользователей подсвечиваем /multiedu
      if (hasAccess('ST') && !hasAccess('ADMIN') && !hasAccess('ST-ADMIN')) {
        return ['/multiedu'];
      }
      // Для админов: если мы в подменю обучения, подсвечиваем главную
      return ['/multiedu'];
    }
    
    // 4. Для системного админ-меню
    if (path.startsWith('/admin') && !path.startsWith('/multiedu/admin')) {
      // Если это конкретный подпункт админ-меню, возвращаем его
      if (path === '/admin/' || path === '/admin') {
        return ['/admin/'];
      }
      if (path === '/admin/roles') {
        return ['/admin/roles'];
      }
      if (path === '/admin/create') {
        return ['/admin/create'];
      }
    }
    
    // 5. Для остальных страниц
    const basePath = `/${path.split('/')[1]}`;
    return [basePath];
  };

  const actualSelectedKeys = getActualSelectedKeys();

  const menuItems = [
    // Пользователи
    ...(hasAccess('USER')
      ? [
          {
            key: '/staff',
            icon: <TeamOutlined />,
            label: <Link to="/staff">ПОЛЬЗОВАТЕЛИ</Link>,
          },
        ]
      : []),

    // Учет IP
    ...(hasAccess('IP')
      ? [
          {
            key: '/ipaddress',
            icon: <GlobalOutlined />,
            label: <Link to="/ipaddress">УЧЕТ IP</Link>,
          },
        ]
      : []),

    // Принтеры
    ...(hasAccess('PRINT')
      ? [
          {
            key: '/prints',
            icon: <PrinterOutlined />,
            label: <Link to="/prints">ПРИНТЕРЫ</Link>,
          },
        ]
      : []),

    // Учет USB
    ...(hasAccess('USB')
      ? [
          {
            key: '/usb',
            icon: <UsbOutlined />,
            label: <Link to="/usb">УЧЕТ USB</Link>,
          },
        ]
      : []),

    // Учет карт доступа
    ...(hasAccess('CARD')
      ? [
          {
            key: '/card',
            icon: <IdcardOutlined />,
            label: <Link to="/card">УЧЕТ КАРТ ДОСТУПА</Link>,
          },
        ]
      : []),

    // Бейджики
    ...(hasAccess('BADGES')
      ? [
          {
            key: '/badges',
            icon: <TagOutlined />,
            label: <Link to="/badges">БЕЙДЖИКИ</Link>,
          },
        ]
      : []),

    // Заметки
    ...(hasAccess('NOTES')
      ? [
          {
            key: '/notes',
            icon: <FileTextOutlined />,
            label: <Link to="/notes">ЗАМЕТКИ</Link>,
          },
        ]
      : []),

    // ИУС П Т
    ...(hasAccess('IUSPT')
      ? [
          {
            key: '/iuspt',
            icon: <DashboardOutlined />,
            label: <Link to="/iuspt">ИУС П Т</Link>,
          },
        ]
      : []),

    // JSON
    ...(hasAccess('JSON')
      ? [
          {
            key: '/json',
            icon: <CodeOutlined />,
            label: <Link to="/json">JSON</Link>,
          },
        ]
      : []),

    // Обучение
    ...(hasAccess('ST') || hasAccess('ADMIN') || hasAccess('ST-ADMIN')
      ? [
          hasAccess('ADMIN') || hasAccess('ST-ADMIN')
            ? {
                key: 'multi-edu-group',
                icon: <ReconciliationOutlined />,
                label: 'Обучение',
                children: [
                  {
                    key: '/multiedu',
                    label: <Link to="/multiedu">Главная</Link>,
                    icon: <BookOutlined />,
                  },
                  {
                    key: '/multiedu/admin',
                    label: <Link to="/multiedu/admin">Администрирование</Link>,
                    icon: <SettingOutlined />,
                  },
                ],
              }
            : {
                key: '/multiedu',
                icon: <ReconciliationOutlined />,
                label: <Link to="/multiedu">Информационная безопасность</Link>,
              },
        ]
      : []),

    // Системное админ-меню
    ...(userRolesAuth.includes('ADMIN')
      ? [
          {
            key: 'admin',
            icon: <SettingOutlined />,
            label: 'АДМИН',
            children: [
              {
                key: '/admin/',
                icon: <TeamOutlined />,
                label: <Link to="/admin/">Пользователи</Link>,
              },
              {
                key: '/admin/roles',
                icon: <SafetyOutlined />,
                label: <Link to="/admin/roles">Справочник ролей</Link>,
              },
              {
                key: '/admin/create',
                icon: <UserOutlined />,
                label: <Link to="/admin/create">Создание пользователя</Link>,
              },
            ],
          },
        ]
      : []),
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={actualSelectedKeys}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      items={menuItems}
      className={styles.menu}
    />
  );
};

export default MenuSection;