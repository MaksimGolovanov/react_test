// src/features/security-training/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Modal, message } from "antd";
import trainingStore from "../store/SecurityTrainingStore";
import { courses } from "../data/coursesData";
import { toJS } from "mobx";

// Импорт компонентов
import MainLayout from "../components/admin/MainLayout";
import DashboardContent from "../components/admin/DashboardContent";
import UsersContent from "../components/admin/UsersContent";
import AnalyticsContent from "../components/admin/AnalyticsContent";
import CoursesContent from "../components/admin/CoursesContent";
import CourseModal from "../components/admin/modals/CourseModal";

const AdminPage = observer(() => {
  const [selectedMenu, setSelectedMenu] = useState("dashboard");
  const [isCourseModalVisible, setIsCourseModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Store users:", trainingStore.users.length);
    setUsers(toJS(trainingStore.users) || []);
  }, [trainingStore.users]);

  // Статистика для дашборда
  const totalUsers = users.length;
  
  const totalCompletedCourses = Object.values(
    trainingStore.userProgress
  ).filter((progress) => progress.completed).length;
  const averageScore =
    Object.values(trainingStore.userProgress).reduce(
      (acc, progress) => acc + (progress.testScore || 0),
      0
    ) / totalUsers || 0;
  const activeCourses = courses.filter((c) => c.active).length;

  const dashboardStats = {
    totalUsers,
    totalCompletedCourses,
    averageScore,
    activeCourses,
  };

  // Моковые данные для аналитики
  const analytics = {
    totalActiveUsers: 150,
    newUsersThisMonth: 15,
    completionRate: 68,
    avgTimeToComplete: "2.5 часа",
    popularCourses: [
      { id: 1, name: "Основы информационной безопасности", completions: 120 },
      { id: 2, name: "Защита от фишинга", completions: 85 },
      { id: 3, name: "Парольная безопасность", completions: 73 },
    ],
    monthlyStats: [
      { month: "Янв", completions: 45, score: 82 },
      { month: "Фев", completions: 52, score: 85 },
      { month: "Мар", completions: 48, score: 79 },
      { month: "Апр", completions: 61, score: 88 },
    ],
  };

  // Обработчики
  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setLessons(course.lessons || []);
    setQuestions(course.test?.questions || []);
    setCurrentStep(0);
    setIsCourseModalVisible(true);
  };

  const handleManageLessons = (course) => {
    setEditingCourse(course);
    setLessons(course.lessons || []);
    setCurrentStep(1);
    setIsCourseModalVisible(true);
  };

  const handleManageTest = (course) => {
    setEditingCourse(course);
    setQuestions(course.test?.questions || []);
    setCurrentStep(2);
    setIsCourseModalVisible(true);
  };

  const handlePreviewCourse = (course) => {
    Modal.info({
      title: course.title,
      width: 800,
      content: (
        <div>
          <p>
            <strong>Описание:</strong> {course.description}
          </p>
          <p>
            <strong>Уровень:</strong> {course.level}
          </p>
          <p>
            <strong>Продолжительность:</strong> {course.duration}
          </p>
          <p>
            <strong>Уроки:</strong> {course.lessons?.length || 0}
          </p>
          <p>
            <strong>Тестовые вопросы:</strong>{" "}
            {course.test?.questions?.length || 0}
          </p>
        </div>
      ),
    });
  };

  const handleDeleteCourse = (courseId) => {
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
  };

  const handleAddCourse = () => {
    setEditingCourse(null);
    setLessons([]);
    setQuestions([]);
    setCurrentStep(0);
    setIsCourseModalVisible(true);
  };

  const handleMenuSelect = (key) => {
    setSelectedMenu(key);
  };

  // Рендер контента в зависимости от выбранного меню
  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return (
          <DashboardContent
            stats={dashboardStats}
            onNavigate={setSelectedMenu}
            analytics={analytics}
          />
        );
      case "courses":
        return (
          <CoursesContent
            courses={courses}
            onEditCourse={handleEditCourse}
            onPreviewCourse={handlePreviewCourse}
            onManageLessons={handleManageLessons}
            onManageTest={handleManageTest}
            onDeleteCourse={handleDeleteCourse}
          />
        );
      case "users":
        return <UsersContent users={users} loading={loading} />;
      case "analytics":
        return <AnalyticsContent analytics={analytics} />;
      default:
        return null;
    }
  };

  return (
    <>
      <MainLayout
        selectedMenu={selectedMenu}
        onMenuSelect={handleMenuSelect}
        onAddCourse={handleAddCourse}
        showAddCourseButton={selectedMenu === "courses"}
      >
        {renderContent()}
      </MainLayout>

      {/* Модальные окна */}
      <CourseModal
        visible={isCourseModalVisible}
        editingCourse={editingCourse}
        lessons={lessons}
        questions={questions}
        currentStep={currentStep}
        onClose={() => {
          setIsCourseModalVisible(false);
          setEditingCourse(null);
          setLessons([]);
          setQuestions([]);
          setCurrentStep(0);
        }}
        onStepChange={setCurrentStep}
        onLessonsChange={setLessons}
        onQuestionsChange={setQuestions}
      />
    </>
  );
});

export default AdminPage;
