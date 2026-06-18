// components/StaffSprav/StaffSprav.js – обновлённый
import React, { useState } from 'react';
import { Tabs, Button, Space } from 'antd';
import { ArrowLeftOutlined, BankOutlined, UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import StaffSpravDepartments from './StaffSpravDepartments';
import StaffSpravDolgnost from './StaffSpravDolgnost';
import StaffSpravConfidential from './StaffSpravConfidential';
import StaffSpravPositionAccess from './StaffSpravPositionAccess';
import styles from './style.module.css';

function StaffSprav() {
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('departments');

  const tabItems = [
    { key: 'departments', label: <Space><BankOutlined />Отделы</Space>, children: <StaffSpravDepartments /> },
    { key: 'positions', label: <Space><UserOutlined />Должности</Space>, children: <StaffSpravDolgnost /> },
    { key: 'confidential', label: <Space><LockOutlined />КТ</Space>, children: <StaffSpravConfidential /> },
    { key: 'positionAccess', label: <Space><SafetyOutlined />Доступ к КТ</Space>, children: <StaffSpravPositionAccess /> },
  ];

  return (
    <div className={styles.spravContainer}>
      <div className={styles.spravHeader}>
        <Button onClick={() => navigate('/staff')} icon={<ArrowLeftOutlined />} type="primary">Назад к сотрудникам</Button>
      </div>
      <div className={styles.spravContent}>
        <Tabs activeKey={activeKey} onChange={setActiveKey} items={tabItems} className={styles.spravTabs} />
      </div>
    </div>
  );
}

export default StaffSprav;