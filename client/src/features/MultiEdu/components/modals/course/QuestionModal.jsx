// src/features/security-training/components/admin/modals/QuestionModal.jsx

import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Row,
  Col,
  InputNumber,
  Divider,
  Card,
  Button,
  Tag,
  Radio,
  Checkbox,
} from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const QuestionModal = ({
  visible,
  editingQuestion,
  form,
  options,
  questionType,
  onClose,
  onSave,
  onAddOption,
  onUpdateOption,
  onRemoveOption,
  onQuestionTypeChange,
  saving,
}) => {
  return (
    <Modal
      title={editingQuestion ? 'Редактирование вопроса' : 'Создание вопроса'}
      open={visible}
      onCancel={onClose}
      onOk={onSave}
      width={700}
      okText="Сохранить"
      cancelText="Отмена"
      okButtonProps={{ loading: saving, icon: <SaveOutlined /> }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="question_text"
          label="Текст вопроса"
          rules={[{ required: true, message: 'Введите текст вопроса' }]}
        >
          <TextArea rows={3} placeholder="Что такое фишинг?" />
        </Form.Item>

        <Form.Item
          name="question_type"
          label="Тип вопроса"
          rules={[{ required: true, message: 'Выберите тип вопроса' }]}
        >
          <Select
            placeholder="Выберите тип вопроса"
            onChange={onQuestionTypeChange}
          >
            <Option value="single">Одиночный выбор</Option>
            <Option value="multiple">Множественный выбор</Option>
            <Option value="text">Текстовый ответ</Option>
          </Select>
        </Form.Item>

        {questionType !== 'text' && (
          <>
            <Divider orientation="left">Варианты ответа</Divider>
            {options.map((option, index) => (
              <Card
                key={option.id}
                size="small"
                style={{ marginBottom: 8 }}
                extra={
                  options.length > 1 && (
                    <Button
                      type="text"
                      danger
                      size="small"
                      onClick={() => onRemoveOption(index)}
                    >
                      Удалить
                    </Button>
                  )
                }
              >
                <Row gutter={8} align="middle">
                  <Col span={2}>
                    <Tag>{option.id.toUpperCase()}</Tag>
                  </Col>
                  <Col span={18}>
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        onUpdateOption(index, 'text', e.target.value)
                      }
                      placeholder="Текст варианта ответа"
                    />
                  </Col>
                  <Col span={4}>
                    {questionType === 'single' ? (
                      <Radio
                        checked={option.correct}
                        onChange={(e) => {
                          const newOptions = options.map((opt, i) => ({
                            ...opt,
                            correct: i === index ? e.target.checked : false,
                          }));
                          // Note: This should be handled by the parent via onUpdateOption
                        }}
                      >
                        Верный
                      </Radio>
                    ) : (
                      <Checkbox
                        checked={option.correct}
                        onChange={(e) =>
                          onUpdateOption(index, 'correct', e.target.checked)
                        }
                      >
                        Верный
                      </Checkbox>
                    )}
                  </Col>
                </Row>
              </Card>
            ))}

            <Button
              type="dashed"
              onClick={onAddOption}
              block
              icon={<PlusOutlined />}
            >
              Добавить вариант
            </Button>
          </>
        )}

        {questionType === 'text' && (
          <Form.Item
            name="correct_answer"
            label="Правильный ответ"
            rules={[{ required: true, message: 'Введите правильный ответ' }]}
          >
            <Input placeholder="Правильный ответ на вопрос" />
          </Form.Item>
        )}

        <Form.Item name="explanation" label="Объяснение (после ответа)">
          <TextArea rows={3} placeholder="Объяснение правильного ответа..." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="points" label="Баллы за вопрос">
              <InputNumber min={1} style={{ width: '100%' }} placeholder="1" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="order_index" label="Порядок в тесте">
              <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="is_active" label="Активен" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default QuestionModal;
