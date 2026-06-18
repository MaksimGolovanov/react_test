import React from 'react';
import { Button, Typography, Space, theme } from 'antd';

const { useToken } = theme;
const { Text } = Typography;

const SearchNavigation = ({ currentIndex, totalResults, onPrev, onNext }) => {
  const { token } = useToken();

  const containerStyles = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  };

  const navButtonStyles = {
    minWidth: 32,
    padding: '4px 8px',
  };

  const counterStyles = {
    fontSize: 12,
    minWidth: 50,
    textAlign: 'center',
    margin: '0 4px',
    color: token.colorTextSecondary,
  };

  return (
    <div style={containerStyles}>
      <Button
        size="small"
        onClick={onPrev}
        disabled={totalResults === 0}
        style={navButtonStyles}
      >
        ←
      </Button>
      <Text style={counterStyles}>
        {currentIndex + 1} / {totalResults}
      </Text>
      <Button
        size="small"
        onClick={onNext}
        disabled={totalResults === 0}
        style={navButtonStyles}
      >
        →
      </Button>
    </div>
  );
};

export default SearchNavigation;