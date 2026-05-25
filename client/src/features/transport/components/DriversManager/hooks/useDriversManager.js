import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { useRootStore } from '../../../hooks/useStores';

export const useDriversManager = () => {
  const { transportStore } = useRootStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Загрузка данных при монтировании
  useEffect(() => {
    if (transportStore.drivers.length === 0) {
      transportStore.fetchDrivers();
    }
  }, [transportStore]);

  // Фильтрация водителей
  const filteredDrivers = useMemo(() => {
    let result = [...transportStore.drivers];
    if (searchText) {
      const lower = searchText.toLowerCase();
      result = result.filter(
        (d) =>
          d.fio?.toLowerCase().includes(lower) ||
          d.post?.toLowerCase().includes(lower) ||
          d.department?.toLowerCase().includes(lower)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((d) => d.is_active === statusFilter);
    }
    return result;
  }, [transportStore.drivers, searchText, statusFilter]);

  const openAddModal = () => {
    setEditingDriver(null);
    setModalVisible(true);
  };

  const openEditModal = (driver) => {
    setEditingDriver(driver);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingDriver(null);
  };

  const saveDriver = async (values) => {
    try {
      const payload = {
        fio: values.fio,
        post: values.post,
        department: values.department,
        is_active: values.is_active,
        date_from: values.date_from ? values.date_from.format('YYYY-MM-DD') : null,
        date_to: values.date_to ? values.date_to.format('YYYY-MM-DD') : null,
      };

      if (editingDriver) {
        await transportStore.updateDriver(editingDriver.id, payload);
        message.success('Водитель обновлён');
      } else {
        await transportStore.createDriver(payload);
        message.success('Водитель добавлен');
      }
      closeModal();
      await transportStore.fetchDrivers();
    } catch (error) {
      message.error('Ошибка при сохранении');
      console.error(error);
    }
  };

  const deleteDriver = async (id) => {
    try {
      await transportStore.deleteDriver(id);
      message.success('Водитель удалён');
      await transportStore.fetchDrivers();
    } catch (error) {
      message.error('Ошибка при удалении');
    }
  };

  return {
    drivers: filteredDrivers,
    loading: transportStore.driversLoading,
    modalVisible,
    editingDriver,
    searchText,
    statusFilter,
    openAddModal,
    openEditModal,
    closeModal,
    saveDriver,
    deleteDriver,
    setSearchText,
    setStatusFilter,
  };
};