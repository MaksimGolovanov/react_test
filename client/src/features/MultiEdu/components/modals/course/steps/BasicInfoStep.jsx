// src/features/security-training/components/admin/modals/steps/BasicInfoStep.jsx

import { Form, Input, Select, Switch, Row, Col, InputNumber } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const BasicInfoStep = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="title"
            label="Название курса"
            rules={[{ required: true, message: 'Введите название курса' }]}
          >
            <Input placeholder="Основы информационной безопасности" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="level"
            label="Уровень сложности"
            rules={[{ required: true, message: 'Выберите уровень' }]}
          >
            <Select placeholder="Выберите уровень">
              <Option value="beginner">Начальный</Option>
              <Option value="intermediate">Средний</Option>
              <Option value="advanced">Продвинутый</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="short_description"
        label="Краткое описание (до 500 символов)"
      >
        <TextArea
          rows={3}
          placeholder="Краткое описание курса для карточки..."
          maxLength={500}
          showCount
        />
      </Form.Item>

      <Form.Item name="description" label="Полное описание">
        <TextArea rows={6} placeholder="Полное описание курса..." />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="category"
            label="Категория"
            rules={[{ required: true, message: 'Выберите категорию' }]}
          >
            <Select placeholder="Выберите категорию">
              <Option value="it">Информационная безопасность</Option>
              <Option value="ot">Охрана труда</Option>
              <Option value="pb">Пожарная безопасность</Option>
              <Option value="med">Первая помощь</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="tags" label="Теги">
            <Select
              mode="tags"
              placeholder="Добавьте теги..."
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="duration" label="Продолжительность (текст)">
            <Input placeholder="2 часа" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="duration_minutes" label="Продолжительность (минуты)">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="120" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="order_index" label="Порядок отображения">
            <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="passing_score" label="Проходной балл (%)">
            <InputNumber
              min={0}
              max={100}
              style={{ width: '100%' }}
              placeholder="70"
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="attempts_limit" label="Лимит попыток">
            <InputNumber min={1} style={{ width: '100%' }} placeholder="3" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            name="certification_available"
            label="Сертификация"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="is_active" label="Активен" valuePropName="checked">
        <Switch />
      </Form.Item>
    </Form>
  );
};

export default BasicInfoStep;
