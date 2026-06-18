import React from 'react';
import { Modal, Descriptions, Tag, Typography, theme } from 'antd';
import { observer } from 'mobx-react-lite';
import MovementHistoryTable from '../components/MovementHistoryTable';

const { Title } = Typography;
const { useToken } = theme;

const ConsumableDetails = observer(({ visible, onClose, item }) => {
  const { token } = useToken();
  if (!item) return null;

  return (
    <Modal title="Детали картриджа" open={visible} onCancel={onClose} footer={null} width={800} centered>
      <Descriptions bordered column={2} size="small" style={{ backgroundColor: token.colorBgContainer }}>
        <Descriptions.Item label="Модель">{item.model}</Descriptions.Item>
        <Descriptions.Item label="Название">{item.name || '—'}</Descriptions.Item>
        <Descriptions.Item label="Локация"><Tag color={token.colorPrimary}>{item.location}</Tag></Descriptions.Item>
        <Descriptions.Item label="Количество"><span style={{ fontWeight: 'bold', color: item.quantity <= (item.minQuantity || 0) ? token.colorError : token.colorText }}>{item.quantity}</span></Descriptions.Item>
        <Descriptions.Item label="Мин. количество">{item.minQuantity || '—'}</Descriptions.Item>
        <Descriptions.Item label="Статус">{item.quantity <= (item.minQuantity || 0) ? <Tag color="error">Мало</Tag> : <Tag color="success">Достаточно</Tag>}</Descriptions.Item>
      </Descriptions>
      <Title level={5} style={{ marginTop: 24, color: token.colorText }}>История движений</Title>
      <MovementHistoryTable movements={item.movements || []} />
    </Modal>
  );
});

export default ConsumableDetails;