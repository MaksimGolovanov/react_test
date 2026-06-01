import React from 'react';
import { Space, Divider } from 'antd';
import styles from './StatisticsBar.module.css';

const StatisticsBar = ({ statistics, selectedDate }) => {
  return (
    <Space size="middle" wrap>
      <div>
        <span className={styles.statLabel}>Дата:</span>
        <span className={styles.statValue}>{selectedDate?.format('DD.MM.YYYY')}</span>
      </div>
      <Divider type="vertical" className={styles.divider} />
      <div>
        <span className={styles.statLabel}>Всего:</span>
        <span className={styles.statNumber}>{statistics.total}</span>
      </div>
      <Divider type="vertical" className={styles.divider} />
      <div>
        <span className={styles.statLabel}>Исправны:</span>
        <span className={`${styles.statNumber} ${styles.statAvailable}`}>{statistics.available}</span>
      </div>
      <Divider type="vertical" className={styles.divider} />
      <div>
        <span className={styles.statLabel}>Забронировано:</span>
        <span className={`${styles.statNumber} ${styles.statBooked}`}>{statistics.booked}</span>
      </div>
      <Divider type="vertical" className={styles.divider} />
      <div>
        <span className={styles.statLabel}>Неисправны:</span>
        <span className={`${styles.statNumber} ${styles.statUnavailable}`}>{statistics.unavailable}</span>
      </div>
    </Space>
  );
};

export default StatisticsBar;