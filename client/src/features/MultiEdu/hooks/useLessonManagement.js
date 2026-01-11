// src/features/security-training/components/hooks/useLessonManagement.js
import { useState, useCallback } from 'react';
import { Form, Modal, message } from 'antd';
import CourseService from '../api/CourseService';

const useLessonManagement = ({ editingCourse, lessons, onLessonsChange }) => {
  const [lessonForm] = Form.useForm();
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonModalVisible, setLessonModalVisible] = useState(false);
  const [savingLesson, setSavingLesson] = useState(false);

  const handleAddLesson = useCallback(() => {
    setEditingLesson(null);
    lessonForm.resetFields();
    setLessonModalVisible(true);
  }, [lessonForm]);

  const handleEditLesson = useCallback(
    (lesson) => {
      if (!lesson) {
        console.error('Lesson is null or undefined');
        return;
      }

      console.log('Editing lesson:', lesson);
      setEditingLesson(lesson);

      lessonForm.setFieldsValue({
        title: lesson.title || '',
        content: lesson.content || '',
        content_type: lesson.content_type || 'text',
        video_url: lesson.video_url || '',
        presentation_url: lesson.presentation_url || '',
        duration: lesson.duration || 0,
        order_index: lesson.order_index || 0,
        is_active: lesson.is_active !== undefined ? lesson.is_active : true,
        additional_resources: lesson.additional_resources || [],
      });

      setLessonModalVisible(true);
    },
    [lessonForm]
  );

  const handleDeleteLesson = useCallback(
    async (lessonId) => {
      try {
        if (!editingCourse || !editingCourse.id) {
          message.error('Курс не выбран');
          return;
        }

        Modal.confirm({
          title: 'Удалить урок?',
          content:
            'Это действие нельзя отменить. Все данные урока будут удалены.',
          okText: 'Удалить',
          okType: 'danger',
          cancelText: 'Отмена',
          onOk: async () => {
            try {
              await CourseService.deleteLesson(editingCourse.id, lessonId);
              message.success('Урок успешно удален');

              // Обновляем список уроков
              const updatedLessons = await CourseService.getCourseLessons(
                editingCourse.id
              );
              if (onLessonsChange) {
                onLessonsChange(updatedLessons);
              }
            } catch (error) {
              console.error('Error deleting lesson:', error);
              message.error('Ошибка при удалении урока');
            }
          },
        });
      } catch (error) {
        console.error('Error in delete confirmation:', error);
        message.error('Ошибка при подтверждении удаления');
      }
    },
    [editingCourse, onLessonsChange]
  );

  const handleSaveLesson = useCallback(async () => {
    try {
      setSavingLesson(true);
      const values = await lessonForm.validateFields();

      console.log('Saving lesson - editingCourse:', editingCourse);
      console.log('Lesson values:', values);

      // Проверяем, есть ли курс
      if (!editingCourse || !editingCourse.id) {
        message.warning('Сначала сохраните курс на первом шаге');
        return false;
      }

      // Сохраняем урок
      let result;
      if (editingLesson && editingLesson.id) {
        result = await CourseService.updateLesson(
          editingCourse.id,
          editingLesson.id,
          values
        );
        message.success('Урок успешно обновлен');
      } else {
        result = await CourseService.createLesson(editingCourse.id, values);
        message.success('Урок успешно создан');
      }

      console.log('Lesson saved:', result);

      // Закрываем модальное окно урока
      setLessonModalVisible(false);
      setEditingLesson(null);
      lessonForm.resetFields();

      // Обновляем список уроков
      if (editingCourse?.id) {
        const updatedLessons = await CourseService.getCourseLessons(
          editingCourse.id
        );
        if (onLessonsChange) {
          onLessonsChange(updatedLessons);
        }
      }

      return true;
    } catch (error) {
      console.error('Error saving lesson:', error);
      message.error(
        'Ошибка сохранения урока: ' +
          (error.response?.data?.message || error.message)
      );
      return false;
    } finally {
      setSavingLesson(false);
    }
  }, [lessonForm, editingCourse, editingLesson, onLessonsChange]);

  const handleCloseLessonModal = useCallback(() => {
    setLessonModalVisible(false);
    setEditingLesson(null);
    lessonForm.resetFields();
  }, [lessonForm]);

  return {
    lessonForm,
    editingLesson,
    lessonModalVisible,
    savingLesson,
    handleAddLesson,
    handleEditLesson,
    handleDeleteLesson,
    handleSaveLesson,
    handleCloseLessonModal,
  };
};

export default useLessonManagement;
