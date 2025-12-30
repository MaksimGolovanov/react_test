import { useCallback } from 'react';
import { message } from 'antd';
import CardStore from '../store/CardStore';

export const useCardActions = () => {
  const handleDeleteCards = useCallback(async (selectedIds) => {
    if (selectedIds.length === 0) return false;
    
    try {
      const deletePromises = selectedIds.map(id => CardStore.deleteCard(id));
      await Promise.all(deletePromises);
      message.success('Карты успешно удалены');
      return true;
    } catch (error) {
      console.error('Ошибка при удалении:', error);
      message.error('Ошибка при удалении карт');
      return false;
    }
  }, []);

  const handleSaveCard = useCallback(async (values, currentCard) => {
    try {
      if (currentCard) {
        await CardStore.updateCard(currentCard.id, values);
        message.success('Карта успешно обновлена');
      } else {
        await CardStore.createCard(values);
        message.success('Карта успешно создана');
      }
      return true;
    } catch (error) {
      console.error('Ошибка при сохранении:', error);
      message.error('Ошибка при сохранении карты');
      return false;
    }
  }, []);

  return {
    handleDeleteCards,
    handleSaveCard
  };
};