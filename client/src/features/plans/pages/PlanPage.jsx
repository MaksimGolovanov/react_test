// src/features/plans/pages/PlanPage.jsx
import React, { useMemo, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Spin, Alert, theme } from 'antd';
import { usePlanData } from '../hooks/usePlanData';
import { usePlanFilters } from '../hooks/usePlanFilters';
import { usePlanForm } from '../hooks/usePlanForm';
import PlanHeader from '../ui/PlanHeader/PlanHeader';
import PlanTable from '../ui/PlanTable/PlanTable';
import PlanModal from '../ui/PlanModal/PlanModal';
import { downloadPlanDocx } from '../utils/PlanDocxGenerator';
import styles from './style.module.css';

const { useToken } = theme;

const PlanPage = observer(() => {
  const { token } = useToken();
  const { plans, loading, error, refetchPlans } = usePlanData();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, sortConfig, handleSort } = usePlanFilters();
  const {
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
  } = usePlanForm(refetchPlans);

  const filteredAndSortedData = useMemo(() => {
    let filtered = plans?.filter((plan) => {
      const matchSearch = plan.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === 'all' || plan.status === statusFilter;
      return matchSearch && matchStatus;
    }) || [];

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key.includes('date')) {
          const dateA = new Date(a[sortConfig.key]);
          const dateB = new Date(b[sortConfig.key]);
          return sortConfig.direction === 'ascending' ? dateA - dateB : dateB - dateA;
        }
        const valA = a[sortConfig.key]?.toString().toLowerCase() || '';
        const valB = b[sortConfig.key]?.toString().toLowerCase() || '';
        return sortConfig.direction === 'ascending' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      });
    }
    return filtered;
  }, [plans, searchTerm, statusFilter, sortConfig]);

  const handleEditPlan = useCallback(() => {
    if (selectedId) {
      handleEdit(selectedId, plans);
    }
  }, [selectedId, plans, handleEdit]);

  const handleDownloadDocx = useCallback(async () => {
    if (!selectedId) return;
    const planData = plans.find((p) => p.id === selectedId);
    if (!planData) return;
    await downloadPlanDocx(planData);
  }, [selectedId, plans]);

  if (error) return <Alert message="Ошибка загрузки" description={error.message} type="error" showIcon style={{ margin: 24 }} />;
  if (loading) return <Spin tip="Загрузка планов..." style={{ display: 'block', textAlign: 'center', margin: 50 }} />;

  return (
    <div className={styles.container}>
      <PlanHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onAddNew={handleAddNew}
        onEdit={handleEditPlan}
        onDelete={() => handleDelete(selectedId)}
        onDownload={handleDownloadDocx}
        selectedId={selectedId}
      />
      <div className={styles.tableCard} style={{ background: token.colorBgContainer, boxShadow: token.boxShadow }}>
        <div className={styles.userListScroll}>
          <PlanTable
            data={filteredAndSortedData}
            sortConfig={sortConfig}
            onSort={handleSort}
            selectedId={selectedId}
            onSelectionChange={handleCheckboxChange}
            formatDate={(date) => (date ? new Date(date).toLocaleDateString('ru-RU') : '-')}
          />
        </div>
      </div>
      <PlanModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        currentPlan={currentPlan}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  );
});

export default PlanPage;