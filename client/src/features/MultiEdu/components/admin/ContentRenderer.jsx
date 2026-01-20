import React from "react";
import DashboardContent from "./DashboardContent";
import UsersContent from "./UsersContent";
import DocumentsContent from "./DocumentsContent";
import CoursesContent from "./CoursesContent";
import ErrorBoundary from "./ErrorBoundary";
import { courses } from "../../data/coursesData";

const ContentRenderer = ({
  selectedMenu,
  dashboardStats,
  analytics,
  users,
  loading,
  onCourseAction,
}) => {
  const renderContent = () => {
    switch (selectedMenu) {
      case "dashboard":
        return (
          <DashboardContent
            stats={dashboardStats}
            onNavigate={() => {}}
            analytics={analytics}
          />
        );
      case "courses":
        return (
          <CoursesContent
            courses={courses}
            onEditCourse={onCourseAction.handleEditCourse}
            onPreviewCourse={onCourseAction.handlePreviewCourse}
            onManageLessons={onCourseAction.handleManageLessons}
            onManageTest={onCourseAction.handleManageTest}
            onDeleteCourse={onCourseAction.handleDeleteCourse}
          />
        );
      case "users":
        return <UsersContent users={users} loading={loading} />;
      case "documents":
        return <DocumentsContent analytics={analytics} />;
      default:
        return (
          <DashboardContent
            stats={dashboardStats}
            onNavigate={() => {}}
            analytics={analytics}
          />
        );
    }
  };

  return <ErrorBoundary>{renderContent()}</ErrorBoundary>;
};

export default ContentRenderer;