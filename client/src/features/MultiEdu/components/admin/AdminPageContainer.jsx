import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import trainingStore from '../../store/SecurityTrainingStore';
import { message } from 'antd';
import MainLayout from './MainLayout';
import ContentRenderer from './ContentRenderer';
import CourseModal from '../modals/course/CourseModal';
import useDashboardStats from '../../hooks/useDashboardStats';
import useAnalyticsData from '../../hooks/useAnalyticsData';
import useCourseActions from '../../hooks/useCourseActions';

const AdminPageContainer = observer(({ selectedMenu, onMenuSelect }) => {
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const dashboardStats = useDashboardStats(users);
  const analytics = useAnalyticsData();

  useEffect(() => {
    const storeUsers = toJS(trainingStore.users);
    setUsers(Array.isArray(storeUsers) ? storeUsers : []);
  }, [trainingStore.users]);

  const handleCourseAction = useCourseActions({
    setEditingCourse,
    setLessons,
    setQuestions,
    setCurrentStep,
    setIsCourseModalVisible,
  });

  const handleMenuSelect = (key) => {
    onMenuSelect(key);
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setLessons([]);
    setQuestions([]);
    setCurrentStep(0);
    setIsCourseModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsCourseModalVisible(false);
    setEditingCourse(null);
    setLessons([]);
    setQuestions([]);
    setCurrentStep(0);
  };

  // ✅ Ключевое добавление: обработчик сохранения курса
  const handleCourseSaved = (updatedCourse) => {
    console.log('handleCourseSaved received:', updatedCourse);

    // ✅ Более строгая проверка
    if (!updatedCourse || typeof updatedCourse !== 'object') {
      console.error('handleCourseSaved received invalid data:', updatedCourse);
      message.error('Ошибка: получены некорректные данные курса');
      return;
    }

    // Если у курса нет ID, создаем временный
    if (!updatedCourse.id) {
      updatedCourse.id = `temp-${Date.now()}`;
      console.warn('Course has no ID, using temporary ID:', updatedCourse.id);
    }

    // Обновляем редактируемый курс
    setEditingCourse(updatedCourse);

    // Проверяем наличие методов в хранилище
    try {
      if (
        updatedCourse.id &&
        trainingStore.updateCourse &&
        typeof trainingStore.updateCourse === 'function'
      ) {
        trainingStore.updateCourse(updatedCourse);
      } else if (
        trainingStore.addCourse &&
        typeof trainingStore.addCourse === 'function'
      ) {
        trainingStore.addCourse(updatedCourse);
      }

      message.success(updatedCourse.id ? 'Курс обновлен' : 'Курс создан');
    } catch (storeError) {
      console.error('Error updating store:', storeError);
      // Показываем сообщение только если обновили локальное состояние
      message.success('Изменения сохранены локально');
    }
  };

  return (
    <>
      <MainLayout
        selectedMenu={selectedMenu}
        onMenuSelect={handleMenuSelect}
        onAddCourse={handleAddCourse}
        showAddCourseButton={selectedMenu === 'courses'}
      >
        <ContentRenderer
          selectedMenu={selectedMenu}
          dashboardStats={dashboardStats}
          analytics={analytics}
          users={users}
          loading={loading}
          onCourseAction={handleCourseAction}
        />
      </MainLayout>

      <CourseModal
        visible={isCourseModalVisible}
        editingCourse={editingCourse}
        lessons={lessons}
        questions={questions}
        currentStep={currentStep}
        onClose={handleCloseModal}
        onStepChange={setCurrentStep}
        onLessonsChange={setLessons}
        onQuestionsChange={setQuestions}
        onCourseSaved={handleCourseSaved} // ✅ Добавляем проп
      />
    </>
  );
});

export default AdminPageContainer;
