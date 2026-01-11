// src/features/security-training/components/hooks/useCourseForm.js
import { useState, useCallback } from 'react';
import { Form } from 'antd';

const useCourseForm = () => {
  const [form] = Form.useForm();

  const initializeForm = useCallback(
    (editingCourse) => {
      if (editingCourse) {
        form.setFieldsValue({
          title: editingCourse.title || '',
          description: editingCourse.description || '',
          short_description: editingCourse.short_description || '',
          level: editingCourse.level || 'beginner',
          category: editingCourse.category || 'basics',
          duration: editingCourse.duration || '',
          duration_minutes: editingCourse.duration_minutes || 0,
          passing_score: editingCourse.passing_score || 70,
          attempts_limit: editingCourse.attempts_limit || 3,
          certification_available:
            editingCourse.certification_available || false,
          is_active:
            editingCourse.is_active !== undefined
              ? editingCourse.is_active
              : true,
          order_index: editingCourse.order_index || 0,
          tags: editingCourse.tags || [],
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          level: 'beginner',
          category: 'basics',
          passing_score: 70,
          attempts_limit: 3,
          certification_available: false,
          is_active: true,
          order_index: 0,
          tags: [],
        });
      }
    },
    [form]
  );

  return {
    form,
    initializeForm,
  };
};

export default useCourseForm;
