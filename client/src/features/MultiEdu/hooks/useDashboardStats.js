import { useMemo } from "react";
import trainingStore from "../store/SecurityTrainingStore";
import { courses } from "../data/coursesData";

const useDashboardStats = (users) => {
    return useMemo(() => {
        const totalUsers = users.length || 0;

        let userProgressData;
        try {
            userProgressData = trainingStore.userProgress || {};
        } catch (error) {
            console.error("Error getting userProgress:", error);
            userProgressData = {};
        }

        let progressValues = [];
        try {
            progressValues = Object.values(userProgressData);
        } catch (error) {
            console.error("Error getting values from userProgress:", error);
            progressValues = [];
        }

        const totalCompletedCourses = progressValues.filter(
            (progress) => progress && progress.completed
        ).length || 0;

        const totalScore = progressValues.reduce((acc, progress) => {
            if (progress && typeof progress.testScore === 'number') {
                return acc + progress.testScore;
            }
            return acc;
        }, 0);

        const averageScore = totalUsers > 0 ? totalScore / totalUsers : 0;

        const coursesList = Array.isArray(courses) ? courses : [];
        const activeCourses = coursesList.filter((c) => c && c.active).length;

        return {
            totalUsers,
            totalCompletedCourses,
            averageScore: parseFloat(averageScore.toFixed(2)),
            activeCourses,
        };
    }, [users]);
};

export default useDashboardStats;