import React, { useState } from 'react'
import { Tabs, Button, Space } from 'antd'
import { ArrowLeftOutlined, BankOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import StaffSpravDepartments from '../StaffSprav/StaffSpravDepartments'
import StaffSpravDolgnost from '../StaffSprav/StaffSpravDolgnost'
import styles from './style.module.css'

function StaffSprav() {
     const navigate = useNavigate()
     const [activeKey, setActiveKey] = useState('departments')

     const tabItems = [
          {
               key: 'departments',
               label: (
                    <Space>
                         <BankOutlined />
                         <span>Отделы</span>
                    </Space>
               ),
               children: <StaffSpravDepartments />,
          },
          {
               key: 'positions',
               label: (
                    <Space>
                         <UserOutlined />
                         <span>Должности</span>
                    </Space>
               ),
               children: <StaffSpravDolgnost />,
          },
     ]

     return (
          <div className={styles.spravContainer}> 
               {/* Кнопка назад */}
               <div className={styles.spravHeader}>
                    <Button
                         onClick={() => navigate('/staff')}
                         icon={<ArrowLeftOutlined />}
                         type="primary"
                         className={styles.backButton}
                    >
                         Назад к сотрудникам
                    </Button>
               </div>

               {/* Контент */}
               <div className={styles.spravContent}>
                    <Tabs
                         activeKey={activeKey}
                         onChange={setActiveKey}
                         items={tabItems}
                         style={{
                              backgroundColor: '#fff',
                              borderRadius: 8,
                              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              flex: 1,
                              minHeight: 0,
                         }}
                         tabBarStyle={{
                              backgroundColor: '#fafafa',
                              padding: '0 16px',
                              margin: 0,
                              borderRadius: '8px 8px 0 0',
                              height: 56,
                         }}
                         tabBarGutter={16}
                         size="large"
                         tabPosition="top"
                         animated={{
                              inkBar: true,
                              tabPane: true,
                         }}
                    />
               </div>
          </div>
     )
}

export default StaffSprav
