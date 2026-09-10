// src/features/protocols/ui/GenerateCertificatesModal/GenerateCertificatesModal.jsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Layout,
  List,
  Checkbox,
  Button,
  Typography,
  message,
} from 'antd';
import { PDFViewer } from '@react-pdf/renderer';
import { observer } from 'mobx-react-lite';
import { saveAs } from 'file-saver';
import CertificateDocument from './CertificateDocument';
import { generateCertificatePDF } from '../../utils/CertificateGenerator';

const { Sider, Content } = Layout;
const { Text } = Typography;

const GenerateCertificatesModal = ({ visible, onClose, protocols }) => {
  const [selectedProtocolIds, setSelectedProtocolIds] = useState([]);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState({}); // { protocolId: [workerId, ...] }
  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);

  // При открытии ничего не выбираем
  useEffect(() => {
    if (visible) {
      setSelectedProtocolIds([]);
      setSelectedWorkerIds({});
      setPreviewData(null);
    }
  }, [visible]);

  // Обновляем предпросмотр при изменении выбора
  useEffect(() => {
    updatePreview(selectedProtocolIds, selectedWorkerIds);
  }, [selectedProtocolIds, selectedWorkerIds]);

  const updatePreview = (protocolIds, workerIds) => {
    const selected = [];
    protocolIds.forEach((pid) => {
      const protocol = protocols?.find((p) => p.id === pid);
      if (protocol) {
        const workers = protocol.workers.filter((w) =>
          workerIds[pid]?.includes(w.id || w.fullName + pid)
        );
        if (workers.length > 0) {
          selected.push({ protocol, workers });
        }
      }
    });
    setPreviewData(selected.length > 0 ? selected : null);
  };

  const handleSelectProtocol = (protocolId, checked) => {
    const newSelected = checked
      ? [...selectedProtocolIds, protocolId]
      : selectedProtocolIds.filter((id) => id !== protocolId);
    setSelectedProtocolIds(newSelected);

    if (!checked) {
      const newWorkers = { ...selectedWorkerIds };
      delete newWorkers[protocolId];
      setSelectedWorkerIds(newWorkers);
    } else {
      if (!selectedWorkerIds[protocolId]) {
        const protocol = protocols?.find((p) => p.id === protocolId);
        if (protocol) {
          setSelectedWorkerIds((prev) => ({
            ...prev,
            [protocolId]: protocol.workers.map((w) => w.id || w.fullName + protocolId),
          }));
        }
      }
    }
  };

  const handleSelectAllProtocols = (checked) => {
    if (checked) {
      const allIds = protocols?.map((p) => p.id) || [];
      setSelectedProtocolIds(allIds);
      const allWorkers = {};
      protocols?.forEach((p) => {
        allWorkers[p.id] = p.workers.map((w) => w.id || w.fullName + p.id);
      });
      setSelectedWorkerIds(allWorkers);
    } else {
      setSelectedProtocolIds([]);
      setSelectedWorkerIds({});
    }
  };

  const handleSelectWorker = (protocolId, workerId, checked) => {
    const current = selectedWorkerIds[protocolId] || [];
    const newWorkerIds = checked
      ? [...current, workerId]
      : current.filter((id) => id !== workerId);
    setSelectedWorkerIds((prev) => ({
      ...prev,
      [protocolId]: newWorkerIds,
    }));
  };

  const handleSelectAllWorkers = (protocolId, checked) => {
    const protocol = protocols?.find((p) => p.id === protocolId);
    if (!protocol) return;
    const allWorkerIds = protocol.workers.map((w) => w.id || w.fullName + protocolId);
    setSelectedWorkerIds((prev) => ({
      ...prev,
      [protocolId]: checked ? allWorkerIds : [],
    }));
  };

  const handleGenerate = async () => {
    const selected = [];
    selectedProtocolIds.forEach((pid) => {
      const protocol = protocols?.find((p) => p.id === pid);
      if (protocol) {
        const workerIds = selectedWorkerIds[pid] || [];
        const workers = protocol.workers.filter((w) =>
          workerIds.includes(w.id || w.fullName + pid)
        );
        if (workers.length > 0) {
          selected.push({ protocol, workers });
        }
      }
    });

    if (selected.length === 0) {
      message.warning('Выберите хотя бы одного работника');
      return;
    }

    setLoading(true);
    try {
      for (const item of selected) {
        const blob = await generateCertificatePDF(item.protocol, item.workers);
        saveAs(blob, `Удостоверения_${item.protocol.number || 'без_номера'}.pdf`);
      }
      message.success('PDF созданы');
      onClose();
    } catch (error) {
      console.error('Ошибка генерации:', error);
      message.error('Ошибка при создании PDF');
    } finally {
      setLoading(false);
    }
  };

  const renderProtocolList = () => {
    if (!protocols) return null;
    return protocols.map((protocol) => {
      const isChecked = selectedProtocolIds.includes(protocol.id);
      const workerIds = selectedWorkerIds[protocol.id] || [];
      const allWorkerIds = protocol.workers.map((w) => w.id || w.fullName + protocol.id);
      const allChecked = allWorkerIds.length > 0 && allWorkerIds.every((id) => workerIds.includes(id));
      const indeterminate = workerIds.length > 0 && workerIds.length < allWorkerIds.length;

      return (
        <div key={protocol.id} style={{ marginBottom: 12, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
          <Checkbox
            checked={isChecked}
            onChange={(e) => handleSelectProtocol(protocol.id, e.target.checked)}
          >
            <Text strong>От {protocol.date || '—'} № {protocol.number}</Text>
            {' – '}
            <Text type="secondary">{protocol.organization}</Text>
          </Checkbox>
          {isChecked && (
            <div style={{ paddingLeft: 24, marginTop: 8 }}>
              <Checkbox
                checked={allChecked}
                indeterminate={indeterminate}
                onChange={(e) => handleSelectAllWorkers(protocol.id, e.target.checked)}
              >
                Выбрать всех ({protocol.workers.length})
              </Checkbox>
              <List
                size="small"
                dataSource={protocol.workers}
                renderItem={(worker) => {
                  const key = worker.id || worker.fullName + protocol.id;
                  return (
                    <List.Item style={{ padding: '4px 0' }}>
                      <Checkbox
                        checked={workerIds.includes(key)}
                        onChange={(e) => handleSelectWorker(protocol.id, key, e.target.checked)}
                      >
                        {worker.fullName} ({worker.profession})
                      </Checkbox>
                    </List.Item>
                  );
                }}
              />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <Modal
      title="Создание удостоверений"
      open={visible}
      onCancel={onClose}
      width="90%"
      style={{ top: 20 }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button
          key="generate"
          type="primary"
          loading={loading}
          onClick={handleGenerate}
        >
          Сгенерировать PDF
        </Button>,
      ]}
    >
      <Layout style={{ height: '75vh', background: '#fff' }}>
        <Sider
          width={400}
          style={{ background: '#fafafa', padding: 16, overflowY: 'auto' }}
        >
          <div style={{ marginBottom: 16 }}>
            <Checkbox
              checked={selectedProtocolIds.length === protocols?.length}
              indeterminate={
                selectedProtocolIds.length > 0 &&
                selectedProtocolIds.length < (protocols?.length || 0)
              }
              onChange={(e) => handleSelectAllProtocols(e.target.checked)}
            >
              Выбрать все протоколы ({protocols?.length || 0})
            </Checkbox>
          </div>
          {renderProtocolList()}
        </Sider>
        <Content style={{ padding: 16, background: '#fff' }}>
          {previewData && previewData.length > 0 ? (
            <PDFViewer
              style={{ width: '100%', height: '100%', border: 'none' }}
            >
              <CertificateDocument data={previewData} />
            </PDFViewer>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <Text type="secondary">Выберите протоколы и работников для предпросмотра</Text>
            </div>
          )}
        </Content>
      </Layout>
    </Modal>
  );
};

export default observer(GenerateCertificatesModal);