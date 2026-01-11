import { useCallback } from "react";
import { Modal, message } from "antd";
import { courses } from "../data/coursesData";

const useCourseActions = ({
    setEditingCourse,
    setLessons,
    setQuestions,
    setCurrentStep,
    setIsCourseModalVisible,
}) => {
    const handleEditCourse = useCallback((course) => {
        if (!course) return;

        setEditingCourse(course);
        setLessons(course.lessons || []);
        setQuestions(course.test?.questions || []);
        setCurrentStep(0);
        setIsCourseModalVisible(true);
    }, [setEditingCourse, setLessons, setQuestions, setCurrentStep, setIsCourseModalVisible]);

    const handleManageLessons = useCallback((course) => {
        if (!course) return;

        setEditingCourse(course);
        setLessons(course.lessons || []);
        setCurrentStep(1);
        setIsCourseModalVisible(true);
    }, [setEditingCourse, setLessons, setCurrentStep, setIsCourseModalVisible]);

    const handleManageTest = useCallback((course) => {
        if (!course) return;

        setEditingCourse(course);
        setQuestions(course.test?.questions || []);
        setCurrentStep(2);
        setIsCourseModalVisible(true);
    }, [setEditingCourse, setQuestions, setCurrentStep, setIsCourseModalVisible]);

    const handlePreviewCourse = useCallback((course) => {
        if (!course) return;

        Modal.info({
            title: course.title || "Курс",
            width: 800,
            content: (
                <div>
                    <p><strong>Описание:</strong> {course.description || "Нет описания"}</p>
                    <p><strong>Уровень:</strong> {course.level || "Не указан"}</p>
                    <p><strong>Продолжительность:</strong> {course.duration || "Не указана"}</p>
                    <p><strong>Уроки:</strong> {(course.lessons?.length || 0)}</p>
                    <p><strong>Тестовые вопросы:</strong> {(course.test?.questions?.length || 0)}</p>
                </div>
            ),
        });
    }, []);

    const handleDeleteCourse = useCallback((courseId) => {
        Modal.confirm({
            title: "Удалить курс?",
            content: "Все данные о прохождении этого курса также будут удалены.",
            okText: "Удалить",
            okType: "danger",
            cancelText: "Отмена",
            onOk: () => {
                message.success("Курс удален");
            },
        });
    }, []);

    return {
        handleEditCourse,
        handleManageLessons,
        handleManageTest,
        handlePreviewCourse,
        handleDeleteCourse,
    };
};

export default useCourseActions;