import React from 'react';
import { Layout } from 'antd';
import { observer } from 'mobx-react';
import userStore from '../../features/admin/store/UserStore';
import LogoSection from './components/LogoSection/LogoSection';
import MenuSection from './components/MenuSection/MenuSection';
import UserInfoSection from './components/UserInfoSection/UserInfoSection';
import styles from './NavBar.module.css';

const { Sider } = Layout;

const NavBar = observer(({ collapsed, onCollapseChange }) => {
  const toggleCollapsed = () => {
    onCollapseChange(!collapsed);
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      collapsedWidth={80}
      className={styles.sider}
      theme="dark"
    >
      <LogoSection collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
      <MenuSection userRolesAuth={userStore.userRolesAuth} />
      <UserInfoSection
        collapsed={collapsed}
        userName={userStore.userName}
        userRolesAuth={userStore.userRolesAuth}
        tabNumber={userStore.tabNumber}
        onLogout={() => {
          if (window.confirm('Вы уверены, что хотите выйти?')) {
            userStore.logout();
            window.location.href = '/login';
          }
        }}
      />
    </Sider>
  );
});

export default NavBar;