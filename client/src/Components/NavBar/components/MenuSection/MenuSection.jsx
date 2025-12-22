import React from 'react'
import { Menu } from 'antd'
import { Link } from 'react-router-dom'
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
} from '@ant-design/icons'
import styles from './MenuSection.module.css'

const MenuSection = ({ selectedKeys, openKeys, onOpenChange, userRolesAuth }) => {
     
     const hasAccess = (role) => {
          return userRolesAuth.includes(role) || userRolesAuth.includes('ADMIN')
     }

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

          // Админ меню (только для ADMIN)
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
     ]

     return (
          <Menu
               theme="dark"
               mode="inline"
               selectedKeys={selectedKeys}
               openKeys={openKeys}
               onOpenChange={onOpenChange}
               items={menuItems}
               className={styles.menu}
          />
     )
}

export default MenuSection