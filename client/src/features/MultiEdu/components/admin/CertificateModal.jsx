// src/features/security-training/components/CertificateModal.jsx
import React from 'react';
import { Modal, Typography, Button, Space, Card } from 'antd';
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import './CertificateModal.css';

const { Title, Text, Paragraph } = Typography;

const CertificateModal = ({ visible, onClose, course, score }) => {
  const certificateData = {
    courseName: course?.title,
    userName: 'Иван Иванов',
    date: new Date().toLocaleDateString('ru-RU'),
    score: score,
    certificateId: `CERT-${Date.now()}`,
    issuer: 'Компания ООО "Безопасность"'
  };

  const handlePrint = () => window.print();
  const handleDownload = () => alert('Сертификат скачан');

  return (
    <Modal
      title="Сертификат об окончании курса"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>Закрыть</Button>,
        <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>Печать</Button>,
        <Button key="download" type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>Скачать PDF</Button>
      ]}
      width={800}
      className="certificate-modal"
    >
      <Card className="certificate-card">
        <Title level={2} className="certificate-title">Сертификат</Title>
        <Paragraph className="certificate-text">Настоящим удостоверяется, что</Paragraph>
        <Title level={3} className="certificate-name">{certificateData.userName}</Title>
        <Paragraph className="certificate-text">успешно завершил(а) курс</Paragraph>
        <Title level={4} className="certificate-course">"{certificateData.courseName}"</Title>
        <Paragraph className="certificate-text">с результатом {certificateData.score}%</Paragraph>
        <div className="certificate-footer">
          <div className="certificate-date">
            <Paragraph strong>Дата выдачи:</Paragraph>
            <Paragraph>{certificateData.date}</Paragraph>
          </div>
          <div className="certificate-id">
            <Paragraph strong>Номер сертификата:</Paragraph>
            <Paragraph>{certificateData.certificateId}</Paragraph>
          </div>
        </div>
        <div className="certificate-issuer">
          <Paragraph>{certificateData.issuer}</Paragraph>
        </div>
      </Card>
      <div className="certificate-note">
        <Text type="secondary">Данный сертификат подтверждает успешное завершение курса обучения.</Text>
      </div>
    </Modal>
  );
};

export default CertificateModal;