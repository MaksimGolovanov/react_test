import React, { useState, useEffect, useCallback } from 'react';
import { Card, message } from 'antd';
import FloorPlanService from '../mocks/FloorPlanService.mock';
import PlacementService from '../mocks/PlacementService.mock';
//import FloorPlanService from '../services/FloorPlanService';
//import PlacementService from '../services/PlacementService';
import FloorPlanSelector from '../components/FloorPlanSelector';
import FloorPlanEditor from '../components/FloorPlanEditor';
import FloorPlanToolbar from '../components/FloorPlanToolbar';
import DevicePropertiesModal from '../components/DevicePropertiesModal';
import AssignUserModal from '../components/AssignUserModal';
import CreatePlanModal from '../components/CreatePlanModal';
import styles from '../components/style.module.css';

const FloorPlan = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [planImageUrl, setPlanImageUrl] = useState(null);
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [deviceModalVisible, setDeviceModalVisible] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createPlanVisible, setCreatePlanVisible] = useState(false);

  const handleAddPlan = () => setCreatePlanVisible(true);

  const handleCreatePlan = async (values, file) => {
    await FloorPlanService.create(values, file);
    const updatedPlans = await FloorPlanService.fetchAll();
    setPlans(updatedPlans);
    if (updatedPlans.length > 0) {
      setSelectedPlanId(updatedPlans[updatedPlans.length - 1].id);
    }
    message.success('План создан');
    setCreatePlanVisible(false);
  };
  const loadPlans = useCallback(async () => {
    try {
      const data = await FloorPlanService.fetchAll();
      setPlans(data);
      if (data.length > 0 && !selectedPlanId) setSelectedPlanId(data[0].id);
    } catch {
      message.error('Не удалось загрузить планы');
    }
  }, [selectedPlanId]);

  const loadPlanData = useCallback(async (planId) => {
    if (!planId) return;
    setLoading(true);
    try {
      const data = await FloorPlanService.fetchWithDevices(planId);
      setPlanImageUrl(data.plan.imageUrl);
      setDevices(
        data.placements.map((p) => ({
          id: p.id,
          device: p.device,
          x: p.x,
          y: p.y,
          rotation: p.rotation || 0,
          scale: p.scale || 1,
        }))
      );
      setSelectedDeviceId(null);
    } catch {
      message.error('Ошибка загрузки плана');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  useEffect(() => {
    if (selectedPlanId) loadPlanData(selectedPlanId);
  }, [selectedPlanId, loadPlanData]);

  const handleSelectPlan = (id) => setSelectedPlanId(id);

  const handleDeviceMove = (placementId, x, y) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === placementId ? { ...d, x, y } : d))
    );
  };

  const handleDeviceSelect = (id) => setSelectedDeviceId(id);

  const handleAddDevice = () => {
    setEditingDevice(null);
    setDeviceModalVisible(true);
  };

  const handleEditDevice = () => {
    const device = devices.find((d) => d.id === selectedDeviceId)?.device;
    if (device) {
      setEditingDevice(device);
      setDeviceModalVisible(true);
    }
  };

  const handleDeviceSave = async (newDevice) => {
    if (editingDevice) {
      setDevices((prev) =>
        prev.map((d) =>
          d.device.id === newDevice.id ? { ...d, device: newDevice } : d
        )
      );
    } else {
      try {
        const placement = await PlacementService.create({
          floorPlanId: selectedPlanId,
          deviceId: newDevice.id,
          x: 300,
          y: 200,
        });
        setDevices((prev) => [
          ...prev,
          {
            id: placement.id,
            device: newDevice,
            x: placement.x,
            y: placement.y,
          },
        ]);
        message.success('Устройство добавлено на план');
      } catch {
        message.error('Ошибка добавления на план');
      }
    }
    setDeviceModalVisible(false);
    setEditingDevice(null);
  };

  const handleDeleteDevice = async () => {
    if (!selectedDeviceId) return;
    const toDelete = devices.find((d) => d.id === selectedDeviceId);
    if (!toDelete) return;
    try {
      await PlacementService.delete(selectedDeviceId);
      setDevices((prev) => prev.filter((d) => d.id !== selectedDeviceId));
      setSelectedDeviceId(null);
      message.success('Устройство удалено с плана');
    } catch {
      message.error('Ошибка удаления');
    }
  };

  const handleSavePlan = async () => {
    setSaving(true);
    try {
      const placements = devices.map((d) => ({
        id: d.id,
        x: d.x,
        y: d.y,
        rotation: d.rotation || 0,
        scale: d.scale || 1,
      }));
      await PlacementService.updateBatch(placements);
      message.success('План сохранён');
    } catch {
      message.error('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const handleAssignUser = () => {
    const device = devices.find((d) => d.id === selectedDeviceId)?.device;
    if (device) setAssignModalVisible(true);
  };

  const handleAssigned = (deviceId, tabNumber) => {
    setDevices((prev) =>
      prev.map((d) =>
        d.device.id === deviceId
          ? { ...d, device: { ...d.device, assignedTo: tabNumber } }
          : d
      )
    );
  };

  const selectedDevice =
    devices.find((d) => d.id === selectedDeviceId)?.device || null;

  return (
    <div className={styles.container}>
      <Card className={styles.toolbar}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <FloorPlanSelector
            plans={plans}
            selectedId={selectedPlanId}
            onSelect={handleSelectPlan}
            onAdd={handleAddPlan}
          />
          <FloorPlanToolbar
            onAddDevice={handleAddDevice}
            onEditDevice={handleEditDevice}
            onDeleteDevice={handleDeleteDevice}
            onAssignUser={handleAssignUser}
            onSavePlan={handleSavePlan}
            saving={saving}
            hasSelectedDevice={!!selectedDeviceId}
          />
          <CreatePlanModal
            visible={createPlanVisible}
            onCancel={() => setCreatePlanVisible(false)}
            onSave={handleCreatePlan}
          />
        </div>
      </Card>

      <Card className={styles.editorCard} loading={loading}>
        <FloorPlanEditor
          imageUrl={planImageUrl}
          devices={devices}
          onDeviceMove={handleDeviceMove}
          onDeviceSelect={handleDeviceSelect}
          selectedDeviceId={selectedDeviceId}
          editable={true}
          
        />
      </Card>

      <DevicePropertiesModal
        visible={deviceModalVisible}
        onCancel={() => {
          setDeviceModalVisible(false);
          setEditingDevice(null);
        }}
        onSave={handleDeviceSave}
        device={editingDevice}
      />

      <AssignUserModal
        visible={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        device={selectedDevice}
        onAssigned={handleAssigned}
      />
    </div>
  );
};

export default FloorPlan;
