import { useMemo } from 'react';
import CardStore from '../store/CardStore';

export const useCardFilter = (searchTerm, showInWorkOnly, showNotInWorkOnly, sortConfig) => {
  const sortedItems = useMemo(() => {
    if (!CardStore.card) return [];

    const filtered = CardStore.card.filter(
      (card) => {
        const matchesSearch = searchTerm
          ? (card.ser_num?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             card.fio?.toLowerCase().includes(searchTerm.toLowerCase()))
          : true;
        
        const matchesInWork = showInWorkOnly 
          ? card.log?.toLowerCase() === 'да' 
          : true;
        
        const matchesNotInWork = showNotInWorkOnly
          ? card.log?.toLowerCase() === 'нет'
          : true;
        
        return matchesSearch && matchesInWork && matchesNotInWork;
      }
    );

    if (!sortConfig.key) return filtered;

    return [...filtered].sort((a, b) => {
      const valueA = a[sortConfig.key] ? a[sortConfig.key].toString() : '';
      const valueB = b[sortConfig.key] ? b[sortConfig.key].toString() : '';

      const comparison = valueA.localeCompare(valueB, 'ru', {
        numeric: true,
        sensitivity: 'base',
      });

      return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });
  }, [CardStore.card, searchTerm, showInWorkOnly, showNotInWorkOnly, sortConfig]);

  const fioSuggestions = useMemo(() => {
    if (!CardStore.staff) return [];
    return CardStore.staff
      .map((staff) => staff.fio)
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'ru'));
  }, [CardStore.staff]);

  const cardStatistics = useMemo(() => {
    if (!CardStore.card) return { total: 0, inWork: 0, notInWork: 0 };

    const cards = CardStore.card;
    const total = cards.length;
    const inWork = cards.filter((card) => card.log && card.log.toLowerCase().trim() === 'да').length;
    const notInWork = cards.filter((card) => card.log && card.log.toLowerCase().trim() === 'нет').length;

    return { total, inWork, notInWork };
  }, [CardStore.card]);

  return {
    sortedItems,
    fioSuggestions,
    cardStatistics
  };
};