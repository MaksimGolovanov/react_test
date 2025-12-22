import React from "react";
import { Space, Typography, Button, Tooltip } from "antd";
import { theme } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import AvatarWithFallback from "../../../AvatarWithFallback/AvatarWithFallback";
import styles from "./UserInfoSection.module.css";

const { Text } = Typography;
const { useToken } = theme;

const UserInfoSection = ({
  collapsed,
  userName,
  userRolesAuth,
  tabNumber,
  onLogout,
}) => {
  const {
    token: { colorPrimary },
  } = useToken();

  return (
    <div
      className={collapsed ? styles.userInfoCollapsed : styles.userInfoExpanded}
    >
      {!collapsed ? (
        <Space align="center" className={styles.userInfoContainer}>
          <Space align="center" size="small">
            <AvatarWithFallback
              tabNumber={tabNumber}
              size={32}
              icon={<UserOutlined />}
              fallbackSrc={`${process.env.REACT_APP_API_URL}static/photo/no.jpg`}
              timestamp={Date.now()}
              style={{
                border: `2px solid ${colorPrimary}`,
                flexShrink: 0,
              }}
            />
            <div className={styles.userTextContainer}>
              <Text className={styles.userName}>
                {userName || "Пользователь"}
              </Text>
              <Text className={styles.userRoles}>
                {userRolesAuth?.join(", ") || "Роли не назначены"}
              </Text>
            </div>
          </Space>
          <Tooltip title="Выйти">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={onLogout} // используем переданный проп
              className={styles.logoutButton}
            />
          </Tooltip>
        </Space>
      ) : (
        <div className={styles.logoutCollapsedContainer}>
          <Tooltip title="Выйти" placement="right">
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={onLogout} // используем переданный проп
              className={styles.logoutButton}
            />
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default UserInfoSection;
