import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './VehicleSearch.module.css';

export const VehicleSearch = ({ value, onChange }) => {
  return (
    <Input
      placeholder="Поиск по модели, госномеру, состоянию, типу ТС или принадлежности..."
      prefix={<SearchOutlined />}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={styles.searchInput}
      size="middle"
    />
  );
};