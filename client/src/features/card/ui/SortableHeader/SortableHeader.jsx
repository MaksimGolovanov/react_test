import React from 'react';
import { SortAscendingOutlined, SortDescendingOutlined } from '@ant-design/icons';

const SortableHeader = ({ title, sortKey, currentSort, onSort, children }) => {
  const getSortIcon = () => {
    if (currentSort.key !== sortKey) return <SortAscendingOutlined />;
    return currentSort.direction === 'ascending' 
      ? <SortAscendingOutlined /> 
      : <SortDescendingOutlined />;
  };

  return (
    <span 
      onClick={() => onSort(sortKey)} 
      style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
    >
      {children || title} {getSortIcon()}
    </span>
  );
};

export default SortableHeader;