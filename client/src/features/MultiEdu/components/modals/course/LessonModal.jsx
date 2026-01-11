// src/features/security-training/components/admin/modals/LessonModal.jsx

import { Modal, Form, Input, Select, Switch, Row, Col, InputNumber, Button } from 'antd';
import { SaveOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const LessonModal = ({
  visible,
  editingLesson,
  form,
  onClose,
  onSave,
  saving,
}) => {
  return (
    <Modal
      title={editingLesson ? "Редактирование урока" : "Создание урока"}
      open={visible}
      onCancel={onClose}
      width={700}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button 
          key="save" 
          type="primary" 
          onClick={onSave}
          loading={saving}
          icon={<SaveOutlined />}
        >
          Сохранить
        </Button>
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Название урока"
          rules={[{ required: true, message: "Введите название урока" }]}
        >
          <Input placeholder="Введение в информационную безопасность" />
        </Form.Item>

        <Form.Item
          name="content_type"
          label="Тип контента"
          rules={[{ required: true, message: "Выберите тип контента" }]}
        >
          <Select placeholder="Выберите тип контента">
            <Option value="text">Текстовый урок</Option>
            <Option value="video">Видеоурок</Option>
            <Option value="presentation">Презентация</Option>
            <Option value="interactive">Интерактивный урок</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="content"
          label="Содержание урока"
          rules={[{ required: true, message: "Введите содержание урока" }]}
        >
          <TextArea
            rows={8}
            placeholder="HTML или Markdown содержимое урока..."
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="video_url"
              label="URL видео (если применимо)"
            >
              <Input placeholder="https://youtube.com/..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="presentation_url"
              label="URL презентации (если применимо)"
            >
              <Input placeholder="https://docs.google.com/..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="duration"
              label="Длительность (минуты)"
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="15"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="order_index"
              label="Порядок в курсе"
            >
              <InputNumber
                min={0}
                style={{ width: '100%' }}
                placeholder="0"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="is_active"
          label="Активен"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LessonModal;