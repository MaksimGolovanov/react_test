// src/features/security-training/components/hooks/useQuestionManagement.js
import { useState, useCallback } from 'react';
import { Form, message } from 'antd';
import CourseService from '../api/CourseService';

const useQuestionManagement = ({
  editingCourse,
  questions,
  onQuestionsChange,
}) => {
  const [questionForm] = Form.useForm();
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionModalVisible, setQuestionModalVisible] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [options, setOptions] = useState([
    { id: 'a', text: '', correct: false },
  ]);
  const [questionType, setQuestionType] = useState('single');

  const handleAddQuestion = useCallback(() => {
    setEditingQuestion(null);
    setOptions([{ id: 'a', text: '', correct: false }]);
    setQuestionType('single');
    questionForm.resetFields();
    setQuestionModalVisible(true);
  }, [questionForm]);

  const handleEditQuestion = useCallback(
    (question) => {
      setEditingQuestion(question);
      setOptions(question.options || [{ id: 'a', text: '', correct: false }]);
      setQuestionType(question.question_type);
      questionForm.setFieldsValue({
        question_text: question.question_text,
        question_type: question.question_type,
        explanation: question.explanation,
        points: question.points,
        order_index: question.order_index,
        is_active: question.is_active,
        correct_answer: question.correct_answer,
      });
      setQuestionModalVisible(true);
    },
    [questionForm]
  );

  const handleDeleteQuestion = useCallback(
    async (questionId) => {
      try {
        if (editingCourse) {
          await CourseService.deleteQuestion(editingCourse.id, questionId);
          message.success('Вопрос удален');
          if (editingCourse?.id) {
            const updatedQuestions = await CourseService.getCourseQuestions(
              editingCourse.id
            );
            if (onQuestionsChange) {
              onQuestionsChange(updatedQuestions);
            }
          }
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        message.error('Ошибка удаления вопроса');
      }
    },
    [editingCourse, onQuestionsChange]
  );

  const handleSaveQuestion = useCallback(async () => {
    try {
      setSavingQuestion(true);
      const values = await questionForm.validateFields();

      if (questionType !== 'text') {
        // Валидация options
        if (options.some((opt) => !opt.text.trim())) {
          message.error('Все варианты ответа должны быть заполнены');
          return;
        }

        const correctOptions = options.filter((opt) => opt.correct);
        if (questionType === 'single' && correctOptions.length !== 1) {
          message.error('Должен быть выбран ровно один правильный ответ');
          return;
        }

        if (questionType === 'multiple' && correctOptions.length < 1) {
          message.error('Должен быть выбран хотя бы один правильный ответ');
          return;
        }

        values.options = options;
      }

      if (editingCourse) {
        if (editingQuestion) {
          await CourseService.updateQuestion(
            editingCourse.id,
            editingQuestion.id,
            values
          );
          message.success('Вопрос обновлен');
        } else {
          await CourseService.createQuestion(editingCourse.id, values);
          message.success('Вопрос создан');
        }

        if (editingCourse?.id) {
          const updatedQuestions = await CourseService.getCourseQuestions(
            editingCourse.id
          );
          if (onQuestionsChange) {
            onQuestionsChange(updatedQuestions);
          }
        }

        setQuestionModalVisible(false);
      }
    } catch (error) {
      console.error('Error saving question:', error);
      message.error('Ошибка сохранения вопроса');
    } finally {
      setSavingQuestion(false);
    }
  }, [
    questionForm,
    questionType,
    options,
    editingCourse,
    editingQuestion,
    onQuestionsChange,
  ]);

  const handleAddOption = useCallback(() => {
    const nextId = String.fromCharCode(97 + options.length);
    setOptions([...options, { id: nextId, text: '', correct: false }]);
  }, [options]);

  const handleUpdateOption = useCallback(
    (index, field, value) => {
      const newOptions = [...options];
      newOptions[index][field] = value;
      setOptions(newOptions);
    },
    [options]
  );

  const handleRemoveOption = useCallback(
    (index) => {
      if (options.length > 1) {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
      }
    },
    [options]
  );

  const handleCloseQuestionModal = useCallback(() => {
    setQuestionModalVisible(false);
    setEditingQuestion(null);
    questionForm.resetFields();
    setOptions([{ id: 'a', text: '', correct: false }]);
    setQuestionType('single');
  }, [questionForm]);

  return {
    questionForm,
    editingQuestion,
    questionModalVisible,
    savingQuestion,
    options,
    questionType,
    handleAddQuestion,
    handleEditQuestion,
    handleDeleteQuestion,
    handleSaveQuestion,
    handleCloseQuestionModal,
    handleAddOption,
    handleUpdateOption,
    handleRemoveOption,
    setQuestionType,
  };
};

export default useQuestionManagement;
