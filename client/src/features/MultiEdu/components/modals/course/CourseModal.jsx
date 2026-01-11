// src/features/security-training/components/admin/modals/CourseModal.jsx
import { useState, useEffect } from 'react';
import { Modal, Steps, Button, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import CourseService from '../../../api/CourseService';

import BasicInfoStep from './steps/BasicInfoStep';
import LessonsStep from './steps/LessonsStep';
import QuestionsStep from './steps/QuestionsStep';
import LessonModal from './LessonModal';
import QuestionModal from './QuestionModal';
import useCourseForm from '../../../hooks/useCourseForm';
import useLessonManagement from '../../../hooks/useLessonManagement';
import useQuestionManagement from '../../../hooks/useQuestionManagement';

const { Step } = Steps;

const CourseModal = ({
  visible,
  editingCourse,
  lessons,
  questions,
  currentStep,
  onClose,
  onStepChange,
  onLessonsChange,
  onQuestionsChange,
  onCourseSaved,
}) => {
  const [savingCourse, setSavingCourse] = useState(false);

  // Хуки для управления состоянием
  const { form, initializeForm } = useCourseForm();
  const {
    lessonForm,
    editingLesson,
    lessonModalVisible,
    savingLesson,
    handleAddLesson,
    handleEditLesson,
    handleDeleteLesson,
    handleSaveLesson,
    handleCloseLessonModal,
  } = useLessonManagement({
    editingCourse,
    lessons,
    onLessonsChange,
  });

  const {
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
  } = useQuestionManagement({
    editingCourse,
    questions,
    onQuestionsChange,
  });

  // Инициализация формы
  useEffect(() => {
    if (visible && currentStep === 0) {
      initializeForm(editingCourse);
    }
  }, [visible, currentStep, editingCourse, initializeForm]);

  // Обработка сохранения курса
  const handleSubmit = async () => {
    try {
      setSavingCourse(true);
      const values = await form.validateFields();

      console.log('Submitting course:', values);
      console.log('Editing course:', editingCourse);

      let result;
      let updatedCourse;

      if (editingCourse && editingCourse.id) {
        // Редактируем существующий курс
        result = await CourseService.updateCourse(editingCourse.id, values);
        console.log('Update result:', result);

        // Проверяем, что result существует
        if (!result) {
          throw new Error('Сервер не вернул результат обновления');
        }

        updatedCourse = {
          ...editingCourse,
          ...values,
          id: editingCourse.id,
        };
        message.success('Курс успешно обновлен');
      } else {
        // Создаем новый курс
        result = await CourseService.createCourse(values);
        console.log('Create result:', result);

        if (!result) {
          throw new Error('Сервер не вернул результат создания');
        }

        // Пробуем разные варианты извлечения данных
        const createdCourse = result.data || result;
        console.log('Created course:', createdCourse);

        if (!createdCourse) {
          throw new Error('Не удалось получить данные созданного курса');
        }

        // Получаем ID разными способами
        const courseId =
          createdCourse.id ||
          createdCourse._id ||
          createdCourse.courseId ||
          Date.now();

        updatedCourse = {
          ...values,
          id: courseId,
        };
        message.success('Курс успешно создан');
      }

      console.log('Updated course to send:', updatedCourse);

      // ✅ Проверяем, что updatedCourse определен
      if (updatedCourse && typeof onCourseSaved === 'function') {
        onCourseSaved(updatedCourse);
      } else {
        console.error(
          'Updated course is undefined or onCourseSaved is not a function',
          {
            updatedCourse,
            onCourseSaved: typeof onCourseSaved,
          }
        );
      }

      // Не закрываем модальное окно
    } catch (error) {
      console.error('Error submitting course:', error);
      message.error(
        'Ошибка сохранения курса: ' +
          (error.response?.data?.message || error.message || error.toString())
      );
      // Не выбрасываем ошибку, чтобы не ломать интерфейс
    } finally {
      setSavingCourse(false);
    }
  };

  const steps = [
    {
      title: 'Основная информация',
      key: 'basic-info',
    },
    {
      title: 'Управление уроками',
      key: 'lessons',
    },
    {
      title: 'Тестирование',
      key: 'questions',
    },
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep form={form} />;
      case 1:
        return (
          <LessonsStep
            lessons={lessons}
            onAddLesson={handleAddLesson}
            onEditLesson={handleEditLesson}
            onDeleteLesson={handleDeleteLesson}
          />
        );
      case 2:
        return (
          <QuestionsStep
            questions={questions}
            onAddQuestion={handleAddQuestion}
            onEditQuestion={handleEditQuestion}
            onDeleteQuestion={handleDeleteQuestion}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        title={editingCourse ? 'Редактирование курса' : 'Создание нового курса'}
        open={visible}
        onCancel={onClose}
        width={900}
        footer={[
          currentStep > 0 && (
            <Button key="back" onClick={() => onStepChange(currentStep - 1)}>
              Назад
            </Button>
          ),
          <Button
            key="save"
            type="primary"
            onClick={handleSubmit}
            loading={savingCourse}
            icon={<SaveOutlined />}
            style={{ marginLeft: '8px' }}
          >
            {editingCourse ? 'Сохранить изменения' : 'Создать курс'}
          </Button>,
          currentStep < steps.length - 1 && (
            <Button
              key="next"
              type="primary"
              onClick={() => onStepChange(currentStep + 1)}
              style={{ marginLeft: '8px' }}
            >
              Далее
            </Button>
          ),
        ]}
      >
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          {steps.map((step) => (
            <Step key={step.key} title={step.title} />
          ))}
        </Steps>

        <div
          style={{ minHeight: '500px', maxHeight: '600px', overflowY: 'auto' }}
        >
          {renderStepContent()}
        </div>
      </Modal>

      <LessonModal
        visible={lessonModalVisible}
        editingLesson={editingLesson}
        form={lessonForm}
        onClose={handleCloseLessonModal}
        onSave={handleSaveLesson}
        saving={savingLesson}
      />

      <QuestionModal
        visible={questionModalVisible}
        editingQuestion={editingQuestion}
        form={questionForm}
        options={options}
        questionType={questionType}
        onClose={handleCloseQuestionModal}
        onSave={handleSaveQuestion}
        onAddOption={handleAddOption}
        onUpdateOption={handleUpdateOption}
        onRemoveOption={handleRemoveOption}
        onQuestionTypeChange={setQuestionType}
        saving={savingQuestion}
      />
    </>
  );
};

export default CourseModal;
