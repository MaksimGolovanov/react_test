import { useState, useCallback, useMemo } from 'react';
import CardStore from '../store/CardStore';

export const useCardSelection = () => {
  const [selectedIds, setSelectedIds] = useState([]);

  const handleCheckboxChange = useCallback((id) => {
    // Если id - массив (от Ant Design), обрабатываем его
    if (Array.isArray(id)) {
      // Ant Design передает пустой массив или массив с одним элементом
      setSelectedIds(id.length === 0 ? [] : [id[id.length - 1]]);
    } else {
      // Старая логика для обратной совместимости
      setSelectedIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const getSelectedCardsInfo = useMemo(() => 
    CardStore.card?.filter((card) => selectedIds.includes(card.id)) || []
  , [CardStore.card, selectedIds]);

  return {
    selectedIds,
    setSelectedIds,
    handleCheckboxChange,
    clearSelection,
    getSelectedCardsInfo
  };
};