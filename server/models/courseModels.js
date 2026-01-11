// server/models/courseModels.js
const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Модель курса
const Course = sequelize.define('course', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    short_description: { type: DataTypes.STRING(500) },
    level: { 
        type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
        defaultValue: 'beginner',
        allowNull: false 
    },
    duration: { type: DataTypes.STRING }, // e.g., "2 часа"
    duration_minutes: { type: DataTypes.INTEGER, defaultValue: 0 },
    icon: { type: DataTypes.STRING },
    cover_image: { type: DataTypes.STRING },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
    passing_score: { type: DataTypes.INTEGER, defaultValue: 70 },
    attempts_limit: { type: DataTypes.INTEGER, defaultValue: 3 },
    certification_available: { type: DataTypes.BOOLEAN, defaultValue: false },
    category: { 
        type: DataTypes.ENUM(
            'it', 
            'ot', 
            'pb', 
            'med', 

        ),
        defaultValue: 'it'
    },
    tags: { type: DataTypes.JSON } // Для хранения тегов ["базовый", "обязательный"]
}, {
    tableName: 'courses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['category'] },
        { fields: ['level'] },
        { fields: ['is_active'] }
    ]
});

// Модель урока
const Lesson = sequelize.define('lesson', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    course_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'courses',
            key: 'id'
        }
    },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT }, // HTML content
    content_type: { 
        type: DataTypes.ENUM('text', 'video', 'interactive', 'presentation'),
        defaultValue: 'text'
    },
    video_url: { type: DataTypes.STRING },
    presentation_url: { type: DataTypes.STRING },
    duration: { type: DataTypes.INTEGER, defaultValue: 0 }, // В минутах
    order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    additional_resources: { type: DataTypes.JSON } // [{type: 'file', url: '', name: ''}]
}, {
    tableName: 'lessons',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['course_id'] },
        { fields: ['order_index'] }
    ]
});

// Модель вопроса теста
const Question = sequelize.define('question', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    course_id: { 
        type: DataTypes.INTEGER, 
        allowNull: false,
        references: {
            model: 'courses',
            key: 'id'
        }
    },
    question_text: { type: DataTypes.TEXT, allowNull: false },
    question_type: { 
        type: DataTypes.ENUM('single', 'multiple', 'text'),
        defaultValue: 'single',
        allowNull: false 
    },
    options: { type: DataTypes.JSON }, // [{id: 'a', text: '...', correct: true}]
    correct_answer: { type: DataTypes.JSON }, // Для текстовых ответов
    explanation: { type: DataTypes.TEXT },
    points: { type: DataTypes.INTEGER, defaultValue: 1 },
    order_index: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
    tableName: 'questions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['course_id'] },
        { fields: ['question_type'] }
    ]
});

// Модель прогресса пользователя
const UserCourseProgress = sequelize.define('user_course_progress', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    completed_lessons: { type: DataTypes.JSON, defaultValue: [] }, // IDs уроков
    current_lesson_id: { type: DataTypes.INTEGER },
    last_accessed: { type: DataTypes.DATE },
    test_score: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    passed_test: { type: DataTypes.BOOLEAN, defaultValue: false },
    attempts_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    completed_at: { type: DataTypes.DATE },
    total_time_spent: { type: DataTypes.INTEGER, defaultValue: 0 } // В минутах
}, {
    tableName: 'user_course_progress',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['user_id', 'course_id'], unique: true },
        { fields: ['user_id'] },
        { fields: ['course_id'] },
        { fields: ['passed_test'] }
    ]
});

// Модель результата теста
const TestResult = sequelize.define('test_result', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    course_id: { type: DataTypes.INTEGER, allowNull: false },
    score: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    passed: { type: DataTypes.BOOLEAN, allowNull: false },
    answers: { type: DataTypes.JSON }, // Сохраненные ответы
    time_spent: { type: DataTypes.INTEGER, defaultValue: 0 }, // В секундах
    attempt_number: { type: DataTypes.INTEGER, defaultValue: 1 }
}, {
    tableName: 'test_results',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['user_id', 'course_id'] },
        { fields: ['user_id'] },
        { fields: ['course_id'] }
    ]
});

// Связи
Course.hasMany(Lesson, { foreignKey: 'course_id', as: 'lessons' });
Lesson.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Course.hasMany(Question, { foreignKey: 'course_id', as: 'questions' });
Question.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Course.hasMany(UserCourseProgress, { foreignKey: 'course_id', as: 'progresses' });
UserCourseProgress.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

Course.hasMany(TestResult, { foreignKey: 'course_id', as: 'testResults' });
TestResult.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

module.exports = {
    Course,
    Lesson,
    Question,
    UserCourseProgress,
    TestResult
};