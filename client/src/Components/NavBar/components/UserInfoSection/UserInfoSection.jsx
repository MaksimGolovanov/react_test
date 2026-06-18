// features/navbar/components/UserInfoSection/UserInfoSection.jsx
import React from "react";
import { Typography, Button, Tooltip, theme } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useTheme } from "../../../../context/ThemeContext";
import AvatarWithFallback from "../../../AvatarWithFallback/AvatarWithFallback";
import styles from "./UserInfoSection.module.css";

const { Text } = Typography;
const { useToken } = theme;

const UserInfoSection = ({ collapsed, userName, tabNumber, onLogout }) => {
  const { token } = useToken();
  const { currentTheme } = useTheme();
  const siderTextColor = currentTheme?.siderTextColor || token.colorText;

  return (
    <div className={collapsed ? styles.userInfoCollapsed : styles.userInfoExpanded}>
      <div className={styles.userInfoContainer}>
        <div className={`${styles.userInfoMain} ${collapsed ? styles.userInfoMainCollapsed : styles.userInfoMainExpanded}`}>
          <AvatarWithFallback
            tabNumber={tabNumber}
            size={32}
            icon={<UserOutlined />}
            fallbackSrc={`${process.env.REACT_APP_API_URL}static/photo/no.jpg`}
            timestamp={Date.now()}
            style={{ border: `2px solid ${token.colorPrimary}`, flexShrink: 0 }}
          />
          <div className={styles.userTextWrapper}>
            <Text className={styles.userName} style={{ color: siderTextColor }}>
              {userName || "Пользователь"}
            </Text>
          </div>
        </div>
        <Tooltip title="Выйти" placement={collapsed ? "right" : "top"}>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={onLogout}
            className={styles.logoutButton}
            style={{ color: token.colorTextSecondary }}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default UserInfoSection;