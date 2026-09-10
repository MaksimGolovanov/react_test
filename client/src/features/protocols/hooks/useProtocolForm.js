// src/features/protocols/hooks/useProtocolForm.js
import { useState, useCallback } from 'react';
import ProtocolStore from '../store/ProtocolStore';

const initialFormData = {
  number: '',
  date: null,
  organization: '',
  trainingCenter: '',
  programName: '',
  programDuration: 64,
  programSections: [],
  commission: {
    chairman: { name: '', position: '' },
    deputy: { name: '', position: '' },
    members: [{ name: '', position: '' }],
    representatives: [{ name: '', position: '', role: '' }],
  },
  workers: [
    {
      fullName: '',
      profession: '',
      workplace: '',
      result: 'удовлетворительно',
      certificateNumber: '',
      checkReason: '',
      registryNumber: '',
      signed: false,
    },
  ],
};

export const useProtocolForm = (onProtocolUpdated) => {
  const [showModal, setShowModal] = useState(false);
  const [currentProtocol, setCurrentProtocol] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const handleAddNew = useCallback(() => {
    setCurrentProtocol(null);
    setFormData(initialFormData);
    setShowModal(true);
  }, []);

  const handleEdit = useCallback((id, protocolsData) => {
    const protocol = protocolsData.find((p) => p.id === id);
    if (!protocol) return;
    setCurrentProtocol(protocol);
    setFormData(protocol);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(
    async (id) => {
      if (!id) return;
      if (window.confirm('Удалить протокол?')) {
        await ProtocolStore.deleteProtocol(id);
        setSelectedId(null);
        onProtocolUpdated();
      }
    },
    [onProtocolUpdated]
  );

  const handleSubmit = useCallback(
    async (submitData) => {
      try {
        if (currentProtocol) {
          await ProtocolStore.updateProtocol(currentProtocol.id, submitData);
        } else {
          await ProtocolStore.createProtocol(submitData);
        }
        setShowModal(false);
        setSelectedId(null);
        onProtocolUpdated();
      } catch (error) {
        console.error('Ошибка сохранения протокола:', error);
        throw error;
      }
    },
    [currentProtocol, onProtocolUpdated]
  );

  return {
    showModal,
    currentProtocol,
    selectedId,
    formData,
    setShowModal,
    setFormData,
    setSelectedId, // <-- добавлено для работы с выбором записи в таблице
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSubmit,
  };
};