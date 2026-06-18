import React from 'react';
import { Typography, Button, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useTheme } from '../../../../context/ThemeContext';
import styles from './LogoSection.module.css';

const { Text } = Typography;
const { useToken } = theme;

const LogoSection = ({ collapsed, toggleCollapsed }) => {
  const { token } = useToken();
  const { currentTheme } = useTheme();
  const siderTextColor = currentTheme?.siderTextColor || token.colorText;

  return (
    <div className={styles.logoSection}>
      <div className={collapsed ? styles.logoCollapsed : styles.logoExpanded}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleCollapsed}
          className={styles.collapseButton}
          style={{ color: siderTextColor }}
        />

        <div className={`${styles.logoTextWrapper} ${collapsed ? styles.logoTextWrapperCollapsed : styles.logoTextWrapperExpanded}`}>
          <Text className={styles.logoText} style={{ color: siderTextColor }}>
            ВУКТЫЛЬСКОЕ
          </Text>
          <Text
            className={styles.logoSubtext}
            style={{ color: token.colorPrimary }}
          >
            ЛПУМГ
          </Text>
        </div>
      </div>
    </div>
  );
};

export default LogoSection;