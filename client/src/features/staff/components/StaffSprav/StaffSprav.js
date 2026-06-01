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

      <div className={styles.spravContent}>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
          items={tabItems}
          className={styles.spravTabs}
        />
      </div>
    </div>
  )
}

export default StaffSprav