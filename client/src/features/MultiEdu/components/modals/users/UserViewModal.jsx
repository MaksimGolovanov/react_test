// src/features/security-training/components/admin/UserViewModal.jsx

import { Modal, Row, Col, Statistic, Typography, Tag } from 'antd';
import {
  BookOutlined,
  StarOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Text } = Typography;

const UserViewModal = ({ user, visible, onCancel }) => {
  if (!user) return null;

  return (
    <Modal
      title={`Подробная информация: ${user.login}`}
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={null}
    >
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Statistic
            title="Пройдено курсов"
            value={user.completed_courses}
            prefix={<BookOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Средний балл"
            value={user.average_score}
            precision={2}
            suffix="%"
            prefix={<StarOutlined />}
          />
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Statistic
            title="Время обучения"
            value={user.total_training_time}
            suffix="мин."
            prefix={<ClockCircleOutlined />}
          />
        </Col>
        <Col span={12}>
          <Statistic
            title="Табельный номер"
            value={user.tabNumber}
            prefix={<TeamOutlined />}
          />
        </Col>
      </Row>
      <div style={{ marginTop: 16 }}>
        <Text strong>Роли:</Text>
        <div style={{ marginTop: 8 }}>
          {user.roles?.map((role, index) => (
            <Tag
              key={index}
              color={role === 'ST-ADMIN' ? 'red' : role === 'ST' ? 'blue' : 'green'}
              style={{ marginBottom: 4 }}
            >
              {role}
            </Tag>
          ))}
        </div>
      </div>
      {user.description && (
        <div style={{ marginTop: 16 }}>
          <Text strong>Описание:</Text>
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">{user.description}</Text>
          </div>
        </div>
      )}
      {user.last_course_completed && (
        <div style={{ marginTop: 16 }}>
          <Text strong>Последний пройденный курс:</Text>
          <div style={{ marginTop: 8 }}>
            <Text>{moment(user.last_course_completed).format('DD.MM.YYYY HH:mm')}</Text>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default UserViewModal;