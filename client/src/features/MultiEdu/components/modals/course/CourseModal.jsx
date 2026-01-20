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

  useEffect(() => {
    if (visible && currentStep === 0) {
      initializeForm(editingCourse);
    }
  }, [visible, currentStep, editingCourse, initializeForm]);

  const handleSubmit = async () => {
    try {
      setSavingCourse(true);
      const values = await form.validateFields();

      let result;
      let updatedCourse;

      if (editingCourse && editingCourse.id) {
        result = await CourseService.updateCourse(editingCourse.id, values);
        
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
        result = await CourseService.createCourse(values);
        
        if (!result) {
          throw new Error('Сервер не вернул результат создания');
        }

        const createdCourse = result.data || result;
        
        if (!createdCourse) {
          throw new Error('Не удалось получить данные созданного курса');
        }

        const courseId = createdCourse.id || createdCourse._id || createdCourse.courseId || Date.now();

        updatedCourse = {
          ...values,
          id: courseId,
        };
        message.success('Курс успешно создан');
      }

      if (updatedCourse && typeof onCourseSaved === 'function') {
        onCourseSaved(updatedCourse);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || error.toString();
      message.error('Ошибка сохранения курса: ' + errorMessage);
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

  const renderFooterButtons = () => {
    const buttons = [];

    if (currentStep > 0) {
      buttons.push(
        <Button key="back" onClick={() => onStepChange(currentStep - 1)}>
          Назад
        </Button>
      );
    }

    buttons.push(
      <Button
        key="save"
        type="primary"
        onClick={handleSubmit}
        loading={savingCourse}
        icon={<SaveOutlined />}
        style={{ marginLeft: '8px' }}
      >
        {editingCourse ? 'Сохранить изменения' : 'Создать курс'}
      </Button>
    );

    if (currentStep < steps.length - 1) {
      buttons.push(
        <Button
          key="next"
          type="primary"
          onClick={() => onStepChange(currentStep + 1)}
          style={{ marginLeft: '8px' }}
        >
          Далее
        </Button>
      );
    }

    return buttons;
  };

  return (
    <>
      <Modal
        title={editingCourse ? 'Редактирование курса' : 'Создание нового курса'}
        open={visible}
        onCancel={onClose}
        width={1000}
        footer={renderFooterButtons()}
      >
        <Steps current={currentStep} style={{ marginBottom: '24px' }}>
          {steps.map((step) => (
            <Step key={step.key} title={step.title} />
          ))}
        </Steps>

        <div style={styles.contentContainer}>
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

const styles = {
  contentContainer: {
    minHeight: '500px',
    maxHeight: '900px',
    
  },
};

export default CourseModal;