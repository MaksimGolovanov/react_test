// src/features/security-training/components/CertificateModal.jsx
import React from 'react';
import { Modal, Typography, Button, Space, Image } from 'antd';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const CertificateModal = ({ visible, onClose, course, score }) => {
  const certificateData = {
    courseName: course?.title,
    userName: 'Иван Иванов', // В реальном приложении извлекать из userStore
    date: new Date().toLocaleDateString('ru-RU'),
    score: score,
    certificateId: `CERT-${Date.now()}`,
    issuer: 'Компания ООО "Безопасность"'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Реализация скачивания сертификата
    alert('Сертификат скачан');
  };

  return (
    <Modal
      title="Сертификат об окончании курса"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Закрыть
        </Button>,
        <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>
          Печать
        </Button>,
        <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
          Скачать PDF
        </Button>
      ]}
      width={800}
    >
      <div style={{ 
        border: '3px solid #1890ff',
        padding: '40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <Title level={2} style={{ color: '#1890ff', marginBottom: '20px' }}>
          Сертификат
        </Title>
        
        <Paragraph style={{ fontSize: '18px', marginBottom: '30px' }}>
          Настоящим удостоверяется, что
        </Paragraph>
        
        <Title level={3} style={{ marginBottom: '30px' }}>
          {certificateData.userName}
        </Title>
        
        <Paragraph style={{ fontSize: '16px', marginBottom: '30px' }}>
          успешно завершил(а) курс
        </Paragraph>
        
        <Title level={4} style={{ color: '#1890ff', marginBottom: '30px' }}>
          "{certificateData.courseName}"
        </Title>
        
        <Paragraph style={{ fontSize: '16px', marginBottom: '30px' }}>
          с результатом {certificateData.score}%
        </Paragraph>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
          <div style={{ textAlign: 'left' }}>
            <Paragraph strong>Дата выдачи:</Paragraph>
            <Paragraph>{certificateData.date}</Paragraph>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <Paragraph strong>Номер сертификата:</Paragraph>
            <Paragraph>{certificateData.certificateId}</Paragraph>
          </div>
        </div>
        
        <div style={{ marginTop: '40px', borderTop: '1px solid #1890ff', paddingTop: '20px' }}>
          <Paragraph>{certificateData.issuer}</Paragraph>
        </div>
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Text type="secondary">
          Данный сертификат подтверждает успешное завершение курса обучения.
        </Text>
      </div>
    </Modal>
  );
};

export default CertificateModal;