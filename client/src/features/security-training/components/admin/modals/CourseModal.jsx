// src/features/security-training/components/admin/modals/CourseModal.jsx
import React from 'react';
import { Modal, Steps, Form, Input, Select, Switch, Row, Col, Space, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;

const CourseModal = ({
  visible,
  editingCourse,
  lessons,
  questions,
  currentStep,
  onClose,
  onStepChange,
  onLessonsChange,
  onQuestionsChange
}) => {
  const [form] = Form.useForm();

  const steps = [
    {
      title: "Основная информация",
      content: (
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Название курса"
            rules={[{ required: true, message: "Введите название курса" }]}
          >
            <Input placeholder="Основы информационной безопасности" />
          </Form.Item>
          {/* ... остальные поля ... */}
        </Form>
      ),
    },
    {
      title: "Управление уроками",
      content: (
        <div>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h4>Уроки курса ({lessons.length})</h4>
              <Button icon={<PlusOutlined />}>Добавить урок</Button>
            </div>
            {/* ... список уроков ... */}
          </Space>
        </div>
      ),
    },
    {
      title: "Тестирование",
      content: (
        <div>
          {/* ... управление вопросами ... */}
        </div>
      ),
    },
  ];

  return (
    <Modal
      title={editingCourse ? "Редактирование курса" : "Создание нового курса"}
      open={visible}
      onCancel={onClose}
      width={800}
    >
      <Steps current={currentStep} style={{ marginBottom: '24px' }}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      
      <div style={{ minHeight: '400px' }}>
        {steps[currentStep].content}
      </div>
    </Modal>
  );
};

export default CourseModal;