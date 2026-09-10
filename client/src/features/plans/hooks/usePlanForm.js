// src/features/plans/hooks/usePlanForm.js
import { useState, useCallback } from 'react';
import PlanStore from '../store/PlanStore';

export const usePlanForm = (onPlanUpdated) => {
  const [showModal, setShowModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    filial: '',
    location: '',
    goal: '',
    responsibleFireWorks: '',
    responsiblePrepFireWorks: '',
    responsibleComm: '',
    gasSupply: 'Не прекращается',
    startDate: null,
    endDate: null,
    totalHours: '',
    stages: [{ 
      title: '', 
      items: [{ 
        text: '', 
        subitems: [''] 
      }] 
    }],
    posts: [{ number: '', responsible: '', brigade: [''], equipment: [''] }],
    materials: [{ standard: '', unit: '', quantity: 0 }],
    technologicalSequence: [{ stepNumber: 1, description: '', responsible: '', startTime: '', endTime: '', totalTime: '', note: '' }],
    appendices: [''],
    safety: {
      hazardFactors: [''],
      measures: '',
      thirdPartyAdmission: ''
    },
    communication: {
      posts: [{ name: '', number: '', responsible: '' }]
    }
  });

  const handleCheckboxChange = useCallback((id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const handleAddNew = useCallback(() => {
    setCurrentPlan(null);
    setFormData({
      title: '',
      filial: '',
      location: '',
      goal: '',
      responsibleFireWorks: '',
      responsiblePrepFireWorks: '',
      responsibleComm: '',
      gasSupply: 'Не прекращается',
      startDate: null,
      endDate: null,
      totalHours: '',
      stages: [{ 
        title: '', 
        items: [{ 
          text: '', 
          subitems: [''] 
        }] 
      }],
      posts: [{ number: '', responsible: '', brigade: [''], equipment: [''] }],
      materials: [{ standard: '', unit: '', quantity: 0 }],
      technologicalSequence: [{ stepNumber: 1, description: '', responsible: '', startTime: '', endTime: '', totalTime: '', note: '' }],
      appendices: [''],
      safety: {
        hazardFactors: [''],
        measures: '',
        thirdPartyAdmission: ''
      },
      communication: {
        posts: [{ name: '', number: '', responsible: '' }]
      }
    });
    setShowModal(true);
  }, []);

  const handleEdit = useCallback((id, plansData) => {
    const plan = plansData.find((p) => p.id === id);
    if (!plan) return;
    setCurrentPlan(plan);
    const safePlan = {
      ...plan,
      startDate: plan.startDate ? plan.startDate.split('T')[0] : null,
      endDate: plan.endDate ? plan.endDate.split('T')[0] : null,
      safety: plan.safety || { hazardFactors: [''], measures: '', thirdPartyAdmission: '' },
      communication: plan.communication || { posts: [{ name: '', number: '', responsible: '' }] },
      totalHours: plan.totalHours || '',
      stages: (plan.stages || []).map(stage => ({
        ...stage,
        items: (stage.items || []).map(item => ({
          text: typeof item === 'string' ? item : item.text || '',
          subitems: Array.isArray(item.subitems) ? item.subitems : ['']
        }))
      }))
    };
    setFormData(safePlan);
    setShowModal(true);
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!id) return;
    if (window.confirm('Вы уверены, что хотите удалить этот план?')) {
      try {
        await PlanStore.deletePlan(id);
        setSelectedId(null);
        onPlanUpdated();
      } catch (error) {
        console.error('Ошибка удаления:', error);
        alert('Не удалось удалить план.');
      }
    }
  }, [onPlanUpdated]);

  const handleSubmit = useCallback(
    async (submitData, currentPlan) => {
      try {
        if (currentPlan) {
          await PlanStore.updatePlan(currentPlan.id, submitData);
        } else {
          await PlanStore.createPlan(submitData);
        }
        setShowModal(false);
        setSelectedId(null);
        onPlanUpdated();
      } catch (error) {
        console.error('Ошибка при сохранении Плана:', error);
        throw error;
      }
    },
    [onPlanUpdated]
  );

  return {
    showModal,
    currentPlan,
    selectedId,
    formData,
    setShowModal,
    setFormData,
    handleCheckboxChange,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSubmit,
  };
};