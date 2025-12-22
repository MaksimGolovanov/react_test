import React from 'react'
import { Space, Typography, Button } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import styles from './LogoSection.module.css'

const { Text } = Typography

const LogoSection = ({ collapsed, toggleCollapsed }) => {
     return (
          <div className={styles.logoSection}>
               <Space
                    align="center"
                    size="middle"
                    className={collapsed ? styles.logoCollapsed : styles.logoExpanded}
               >
                    {!collapsed && (
                         <div className={styles.logoContainer}>
                              <Button
                                   type="text"
                                   icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                   onClick={toggleCollapsed}
                                   className={styles.collapseButton}
                              />
                              <div>
                                   <Text className={styles.logoText}>ВУКТЫЛЬСКОЕ</Text>
                                   <Text className={styles.logoSubtext}>ЛПУМГ</Text>
                              </div>
                         </div>
                    )}
                    {collapsed && (
                         <Button
                              type="text"
                              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                              onClick={toggleCollapsed}
                              className={styles.collapseButton}
                         />
                    )}
               </Space>
          </div>
     )
}

export default LogoSection