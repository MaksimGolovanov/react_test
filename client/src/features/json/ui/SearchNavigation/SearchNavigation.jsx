import React from 'react';
import { Button, Typography, Space } from 'antd';
import styles from '../../pages/JsonViewer.module.css';

const { Text } = Typography;

const SearchNavigation = ({ currentIndex, totalResults, onPrev, onNext }) => {
  return (
    <div className={styles.searchNavigation}>
      <Button
        size="small"
        onClick={onPrev}
        disabled={totalResults === 0}
        className={styles.navButton}
      >
        ←
      </Button>
      <Text type="secondary" className={styles.searchCounter}>
        {currentIndex + 1} / {totalResults}
      </Text>
      <Button
        size="small"
        onClick={onNext}
        disabled={totalResults === 0}
        className={styles.navButton}
      >
        →
      </Button>
    </div>
  );
};

export default SearchNavigation;