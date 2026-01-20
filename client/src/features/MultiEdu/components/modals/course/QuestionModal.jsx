import React from 'react';
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
import { PlusOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';

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
  const handleRadioChange = (index) => {
    const updatedOptions = options.map((option, i) => ({
      ...option,
      correct: i === index,
    }));
    
    updatedOptions.forEach((option, i) => {
      onUpdateOption(i, 'correct', option.correct);
    });
  };

  const handleCheckboxChange = (index, checked) => {
    onUpdateOption(index, 'correct', checked);
  };

  const correctOptionIndex = options.findIndex(option => option.correct);

  return (
    <Modal
      title={editingQuestion ? 'Редактирование вопроса' : 'Создание вопроса'}
      open={visible}
      onCancel={onClose}
      onOk={onSave}
      width={650}
      okText="Сохранить"
      cancelText="Отмена"
      okButtonProps={{ loading: saving, icon: <SaveOutlined /> }}
    >
      <Form form={form} layout="vertical" size="small">
        <QuestionText />
        
        <QuestionMeta 
          questionType={questionType}
          onQuestionTypeChange={onQuestionTypeChange}
        />

        {questionType !== 'text' && (
          <AnswerOptions
            questionType={questionType}
            options={options}
            correctOptionIndex={correctOptionIndex}
            onRadioChange={handleRadioChange}
            onCheckboxChange={handleCheckboxChange}
            onUpdateOption={onUpdateOption}
            onRemoveOption={onRemoveOption}
            onAddOption={onAddOption}
          />
        )}

        {questionType === 'text' && <CorrectAnswerInput />}

        <ExplanationInput />
        <ActiveSwitch />
      </Form>
    </Modal>
  );
};

const QuestionText = () => (
  <Form.Item
    name="question_text"
    label="Текст вопроса"
    rules={[{ required: true, message: 'Введите текст вопроса' }]}
  >
    <TextArea 
      rows={2} 
      placeholder="Что такое фишинг?" 
      style={styles.textArea}
    />
  </Form.Item>
);

const QuestionMeta = ({ questionType, onQuestionTypeChange }) => (
  <Row gutter={16}>
    <Col span={12}>
      <Form.Item
        name="question_type"
        label="Тип вопроса"
        rules={[{ required: true, message: 'Выберите тип' }]}
      >
        <Select 
          placeholder="Тип вопроса" 
          onChange={onQuestionTypeChange}
          style={styles.select}
        >
          <Option value="single">Один вариант</Option>
          <Option value="multiple">Несколько вариантов</Option>
          <Option value="text">Текстовый ответ</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col span={6}>
      <Form.Item name="points" label="Баллы">
        <InputNumber 
          min={1} 
          placeholder="1" 
          style={styles.inputNumber}
        />
      </Form.Item>
    </Col>
    <Col span={6}>
      <Form.Item name="order_index" label="Порядок">
        <InputNumber 
          min={0} 
          placeholder="0" 
          style={styles.inputNumber}
        />
      </Form.Item>
    </Col>
  </Row>
);

const AnswerOptions = ({
  questionType,
  options,
  correctOptionIndex,
  onRadioChange,
  onCheckboxChange,
  onUpdateOption,
  onRemoveOption,
  onAddOption,
}) => (
  <>
    <Divider orientation="left" style={styles.divider}>
      Варианты ответа
    </Divider>
    
    {questionType === 'single' ? (
      <Radio.Group
        value={correctOptionIndex}
        onChange={(e) => onRadioChange(e.target.value)}
        style={styles.radioGroup}
      >
        {options.map((option, index) => (
          <OptionCard
            key={option.id}
            option={option}
            index={index}
            questionType={questionType}
            onUpdateOption={onUpdateOption}
            onRemoveOption={onRemoveOption}
            optionsCount={options.length}
          >
            <Radio value={index} style={styles.radio}>Верно</Radio>
          </OptionCard>
        ))}
      </Radio.Group>
    ) : (
      options.map((option, index) => (
        <OptionCard
          key={option.id}
          option={option}
          index={index}
          questionType={questionType}
          onUpdateOption={onUpdateOption}
          onRemoveOption={onRemoveOption}
          optionsCount={options.length}
        >
          <Checkbox
            checked={option.correct}
            onChange={(e) => onCheckboxChange(index, e.target.checked)}
            style={styles.checkbox}
          >
            Верно
          </Checkbox>
        </OptionCard>
      ))
    )}

    <Button
      type="dashed"
      onClick={onAddOption}
      block
      size="small"
      icon={<PlusOutlined />}
      style={styles.addButton}
    >
      Добавить вариант
    </Button>
  </>
);

const OptionCard = ({
  option,
  index,
  questionType,
  onUpdateOption,
  onRemoveOption,
  optionsCount,
  children,
}) => (
  <Card
    size="small"
    style={styles.optionCard}
    bodyStyle={styles.optionCardBody}
    extra={
      optionsCount > 1 && (
        <Button
          type="text"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => onRemoveOption(index)}
          style={styles.deleteButton}
        />
      )
    }
  >
    <Row gutter={8} align="middle">
      <Col flex="40px">
        <Tag style={styles.optionTag}>{option.id.toUpperCase()}</Tag>
      </Col>
      <Col flex="auto">
        <Input
          size="small"
          value={option.text}
          onChange={(e) => onUpdateOption(index, 'text', e.target.value)}
          placeholder="Текст варианта"
          bordered={false}
          style={styles.optionInput}
        />
      </Col>
      <Col flex="60px" style={styles.optionCorrectCol}>
        {children}
      </Col>
    </Row>
  </Card>
);

const CorrectAnswerInput = () => (
  <Form.Item
    name="correct_answer"
    label="Правильный ответ"
    rules={[{ required: true, message: 'Введите ответ' }]}
  >
    <Input 
      placeholder="Правильный ответ" 
      style={styles.input}
    />
  </Form.Item>
);

const ExplanationInput = () => (
  <Form.Item
    name="explanation"
    label="Объяснение"
    style={styles.explanationItem}
  >
    <TextArea 
      rows={2} 
      placeholder="Объяснение правильного ответа..." 
      style={styles.textArea}
    />
  </Form.Item>
);

const ActiveSwitch = () => (
  <Form.Item 
    name="is_active" 
    label="Активен" 
    valuePropName="checked"
  >
    <Switch size="small" />
  </Form.Item>
);

const styles = {
  textArea: {
    fontSize: '14px',
  },
  select: {
    width: '100%',
  },
  inputNumber: {
    width: '100%',
  },
  input: {
    fontSize: '14px',
  },
  divider: {
    margin: '12px 0',
    fontSize: '14px',
    color: '#666',
  },
  radioGroup: {
    width: '100%',
  },
  optionCard: {
    marginBottom: '8px',
    border: '1px solid #f0f0f0',
    borderRadius: '6px',
  },
  optionCardBody: {
    padding: 0,
  },
  deleteButton: {
    fontSize: '12px',
  },
  optionTag: {
    margin: 0,
    fontWeight: 500,
    background: '#f5f5f5',
  },
  optionInput: {
    fontSize: '13px',
  },
  optionCorrectCol: {
    textAlign: 'right',
    paddingRight: '4px',
  },
  radio: {
    fontSize: '13px',
  },
  checkbox: {
    fontSize: '13px',
  },
  addButton: {
    marginTop: '8px',
    borderStyle: 'dashed',
    borderColor: '#d9d9d9',
  },
  explanationItem: {
    marginBottom: '12px',
  },
};

export default QuestionModal;