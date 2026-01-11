const useAnalyticsData = () => {
    return {
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
};

export default useAnalyticsData;