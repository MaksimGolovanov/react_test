// src/features/plans/hooks/usePlanFilters.js
import { useState, useCallback } from 'react';

export const usePlanFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({
    key: 'created_at',
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