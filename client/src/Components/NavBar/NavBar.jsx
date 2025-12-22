import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "antd";
import { observer } from "mobx-react";
import userStore from "../../features/admin/store/UserStore";
import LogoSection from "./components/LogoSection/LogoSection";
import MenuSection from "./components/MenuSection/MenuSection";
import UserInfoSection from "./components/UserInfoSection/UserInfoSection";
import styles from "./NavBar.module.css";

const { Sider } = Layout;

const NavBar = observer(({ onCollapseChange }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([location.pathname]);

  useEffect(() => {
    console.log("UserStore debug:", {
      tabNumber: userStore.tabNumber,
      userName: userStore.userName,
      userRolesAuth: userStore.userRolesAuth,
      isAuthenticated: userStore.isAuthenticated,
    });
  }, []);

  useEffect(() => {
    setSelectedKeys([location.pathname]);

    if (location.pathname.includes("/admin")) {
      setOpenKeys(["admin"]);
    } else {
      setOpenKeys([]);
    }
  }, [location.pathname]);

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const toggleCollapsed = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    if (onCollapseChange) {
      onCollapseChange(newCollapsed);
    }
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={250}
      collapsedWidth={80}
      className={styles.sider}
      theme="dark"
    >
      <LogoSection collapsed={collapsed} toggleCollapsed={toggleCollapsed} />

      <MenuSection
        selectedKeys={selectedKeys}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        userRolesAuth={userStore.userRolesAuth}
      />

      <UserInfoSection
        collapsed={collapsed}
        userName={userStore.userName}
        userRolesAuth={userStore.userRolesAuth}
        tabNumber={userStore.tabNumber}
        onLogout={() => {
          if (window.confirm("Вы уверены, что хотите выйти?")) {
            userStore.logout();
            window.location.href = "/login";
          }
        }}
      />
    </Sider>
  );
});

export default NavBar;
