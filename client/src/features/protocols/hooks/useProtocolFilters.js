// src/features/protocols/hooks/useProtocolFilters.js
import { useState, useCallback } from 'react';

export const useProtocolFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'createdAt',
    direction: 'descending',
  });

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => {
      let direction = 'ascending';
      if (prev.key === key && prev.direction === 'ascending') {
        direction = 'descending';
      }
      return { key, direction };
    });
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sortConfig,
    handleSort,
  };
};
