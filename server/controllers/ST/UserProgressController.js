// server/controllers/UserProgressController.js
const { UserCourseProgress, TestResult, Course, Question,  } = require('../../models/courseModels');
const {STUser} = require('../../models/STModels')
const ApiError = require('../../error/ApiError');

class UserProgressController {
    // Получение прогресса пользователя по курсу
    async getUserProgress(req, res) {
        try {
            const { userId, courseId } = req.params;

            console.log(`Getting progress for user ${userId}, course ${courseId}`);

            // Ищем прогресс пользователя
            const progress = await UserCourseProgress.findOne({
                where: {
                    user_id: userId,
                    course_id: courseId
                },
                include: [
                    {
                        model: Course,
                        as: 'course',
                        attributes: ['id', 'title', 'duration', 'category', 'level']
                    }
                ]
            });

            // Если прогресс не найден, создаем запись по умолчанию
            if (!progress) {
                console.log('Progress not found, returning default');
                return res.json({
                    completed_lessons: [],
                    test_score: 0,
                    passed_test: false,
                    total_time_spent: 0,
                    course: {
                        id: courseId,
                        title: 'Unknown Course'
                    }
                });
            }

            // Форматируем ответ
            const formattedProgress = {
                id: progress.id,
                user_id: progress.user_id,
                course_id: progress.course_id,
                completed_lessons: progress.completed_lessons || [],
                current_lesson_id: progress.current_lesson_id,
                last_accessed: progress.last_accessed,
                test_score: parseFloat(progress.test_score) || 0,
                passed_test: progress.passed_test || false,
                attempts_count: progress.attempts_count || 0,
                completed_at: progress.completed_at,
                total_time_spent: progress.total_time_spent || 0,
                course: progress.course
            };

            console.log('Found progress:', formattedProgress);
            return res.json(formattedProgress);

        } catch (error) {
            console.error('Error getting user progress:', error);
            return res.status(500).json({ 
                message: 'Ошибка при получении прогресса пользователя', 
                error: error.message 
            });
        }
    }

    // Обновление прогресса пользователя
    async updateUserProgress(req, res) {
        try {
            const { userId, courseId } = req.params;
            const progressData = req.body;

            console.log(`Updating progress for user ${userId}, course ${courseId}:`, progressData);

            // Ищем существующий прогресс
            let progress = await UserCourseProgress.findOne({
                where: {
                    user_id: userId,
                    course_id: courseId
                }
            });

            // Если прогресс не найден, создаем новую запись
            if (!progress) {
                console.log('Creating new progress record');
                progress = await UserCourseProgress.create({
                    user_id: userId,
                    course_id: courseId,
                    ...progressData,
                    last_accessed: new Date()
                });
            } else {
                // Обновляем существующую запись
                await progress.update({
                    ...progressData,
                    last_accessed: new Date()
                });
            }

            // Обновляем общую статистику в STUser если тест пройден
            if (progressData.passed_test) {
                await this.updateSTUserStats(userId, courseId, progressData);
            }

            return res.json(progress);
        } catch (error) {
            console.error('Error updating user progress:', error);
            return res.status(500).json({ 
                message: 'Ошибка при обновлении прогресса пользователя', 
                error: error.message 
            });
        }
    }

    // Метод для обновления статистики ST пользователя
    async updateSTUserStats(userId, courseId, progressData) {
        try {
            console.log(`Updating ST user stats for user ${userId}, course ${courseId}`);

            // Ищем ST пользователя по user_id или tabNumber
            let stUser = await STUser.findOne({
                where: { 
                    user_id: userId 
                }
            });

            // Если STUser не найден, создаем
            if (!stUser) {
                console.log('Creating new ST user record');
                stUser = await STUser.create({
                    user_id: userId,
                    completed_courses: 0,
                    average_score: 0,
                    total_training_time: 0,
                    last_course_completed: null
                });
            }

            // Получаем все пройденные курсы для этого пользователя
            const completedCourses = await UserCourseProgress.findAll({
                where: {
                    user_id: userId,
                    passed_test: true
                }
            });

            // Обновляем статистику
            const completedCount = completedCourses.length;
            const totalScore = completedCourses.reduce((sum, course) => 
                sum + (parseFloat(course.test_score) || 0), 0
            );
            const averageScore = completedCount > 0 ? (totalScore / completedCount) : 0;

            // Обновляем время обучения
            const currentTotalTime = stUser.total_training_time || 0;
            const newTimeSpent = progressData.total_time_spent || 0;

            await stUser.update({
                completed_courses: completedCount,
                average_score: averageScore,
                total_training_time: currentTotalTime + newTimeSpent,
                last_course_completed: progressData.completed_at || new Date()
            });

            console.log('ST user stats updated:', {
                userId,
                completedCount,
                averageScore,
                total_training_time: currentTotalTime + newTimeSpent
            });

            return stUser;
        } catch (error) {
            console.error('Error updating ST user stats:', error);
            throw error;
        }
    }

    // Завершение урока
    async completeLesson(req, res, next) {
        try {
            const { userId, courseId, lessonId } = req.params;
            const { time_spent = 0 } = req.body;

            console.log(`Completing lesson ${lessonId} for user ${userId}, course ${courseId}`);

            let progress = await UserCourseProgress.findOne({
                where: { user_id: userId, course_id: courseId }
            });

            if (!progress) {
                console.log('Creating new progress record for lesson completion');
                progress = await UserCourseProgress.create({
                    user_id: userId,
                    course_id: courseId,
                    completed_lessons: [],
                    current_lesson_id: null,
                    test_score: 0,
                    passed_test: false,
                    attempts_count: 0,
                    total_time_spent: 0,
                    last_accessed: new Date()
                });
            }

            // Добавляем урок в завершенные
            const completedLessons = progress.completed_lessons || [];
            const lessonIdNum = parseInt(lessonId);
            
            if (!completedLessons.includes(lessonIdNum)) {
                completedLessons.push(lessonIdNum);

                await progress.update({
                    completed_lessons: completedLessons,
                    current_lesson_id: lessonIdNum,
                    last_accessed: new Date(),
                    total_time_spent: (progress.total_time_spent || 0) + parseInt(time_spent)
                });

                console.log(`Lesson ${lessonId} marked as completed for user ${userId}`);
            } else {
                console.log(`Lesson ${lessonId} already completed for user ${userId}`);
            }

            return res.json({
                success: true,
                message: 'Урок завершен',
                progress: progress
            });
        } catch (error) {
            console.error('Error completing lesson:', error);
            return next(ApiError.internal('Ошибка при завершении урока'));
        }
    }

    // Отправка результатов теста - УПРОЩЕННАЯ ВЕРСИЯ
    async submitTestResult(req, res, next) {
        try {
            const { userId, courseId } = req.params;
            const { answers, score, time_spent = 0, passed } = req.body;

            console.log('=== SUBMIT TEST RESULT ===');
            console.log('Received test submission:', {
                userId,
                courseId,
                score,
                time_spent,
                passed
            });

            if (!answers || score === undefined) {
                return next(ApiError.badRequest('Отсутствуют обязательные данные: answers и score'));
            }

            // Получаем курс для проверки проходного балла
            const course = await Course.findByPk(courseId);
            if (!course) {
                return next(ApiError.notFound('Курс не найден'));
            }

            // Проверяем, действительно ли пользователь сдал тест
            const calculatedPassed = passed !== undefined ? passed : score >= course.passing_score;

            // Сохраняем результат теста
            const testResult = await TestResult.create({
                user_id: userId,
                course_id: courseId,
                score: parseFloat(score),
                passed: calculatedPassed,
                answers: answers,
                time_spent: parseInt(time_spent) || 0,
                attempt_number: await TestResult.count({
                    where: { user_id: userId, course_id: courseId }
                }) + 1
            });

            console.log('Test result saved to database:', testResult.id);

            // Обновляем прогресс пользователя
            let progress = await UserCourseProgress.findOne({
                where: { user_id: userId, course_id: courseId }
            });

            if (!progress) {
                console.log('Creating new progress record for test result');
                progress = await UserCourseProgress.create({
                    user_id: userId,
                    course_id: courseId,
                    completed_lessons: [],
                    test_score: 0,
                    passed_test: false,
                    attempts_count: 0,
                    total_time_spent: 0,
                    last_accessed: new Date()
                });
            }

            // Обновляем данные прогресса
            const updateData = {
                test_score: parseFloat(score),
                passed_test: calculatedPassed,
                attempts_count: progress.attempts_count + 1,
                total_time_spent: (progress.total_time_spent || 0) + parseInt(time_spent || 0),
                last_accessed: new Date()
            };

            if (calculatedPassed) {
                updateData.completed_at = new Date();
            }

            await progress.update(updateData);

            console.log('User progress updated:', updateData);

            // Обновляем статистику ST пользователя если тест пройден
            if (calculatedPassed) {
                try {
                    await this.updateSTUserStats(userId, courseId, {
                        passed_test: true,
                        test_score: parseFloat(score),
                        total_time_spent: parseInt(time_spent || 0),
                        completed_at: new Date()
                    });
                } catch (stError) {
                    console.error('Error updating ST user stats:', stError);
                    // Не прерываем основной процесс из-за этой ошибки
                }
            }

            return res.json({
                success: true,
                message: 'Результат теста успешно сохранен',
                result: {
                    id: testResult.id,
                    score: testResult.score,
                    passed: testResult.passed,
                    time_spent: testResult.time_spent
                },
                progress: {
                    test_score: progress.test_score,
                    passed_test: progress.passed_test,
                    attempts_count: progress.attempts_count,
                    completed_at: progress.completed_at
                }
            });
        } catch (error) {
            console.error('Error submitting test result:', error);
            return next(ApiError.internal('Ошибка при сохранении результата теста: ' + error.message));
        }
    }

    // Получение результатов тестов пользователя
    async getUserTestResults(req, res, next) {
        try {
            const { userId, courseId } = req.params;

            console.log(`Getting test results for user ${userId}, course ${courseId}`);

            const results = await TestResult.findAll({
                where: { user_id: userId, course_id: courseId },
                order: [['created_at', 'DESC']]
            });

            return res.json(results);
        } catch (error) {
            console.error('Error getting test results:', error);
            return next(ApiError.internal('Ошибка при получении результатов тестов'));
        }
    }

    // Получение всех курсов пользователя с прогрессом
    async getUserCourses(req, res, next) {
        try {
            const { userId } = req.params;

            console.log(`Getting courses for user ${userId}`);

            const progresses = await UserCourseProgress.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: Course,
                        as: 'course',
                        attributes: ['id', 'title', 'description', 'level', 'duration', 'category', 'cover_image']
                    }
                ],
                order: [
                    ['passed_test', 'DESC'], // Сначала завершенные
                    ['test_score', 'DESC'],
                    [{ model: Course, as: 'course' }, 'order_index', 'ASC']
                ]
            });

            return res.json(progresses);
        } catch (error) {
            console.error('Error getting user courses:', error);
            return next(ApiError.internal('Ошибка при получении курсов пользователя'));
        }
    }

    // Получение общей статистики пользователя
    async getUserStats(req, res, next) {
        try {
            const { userId } = req.params;

            console.log(`Getting stats for user ${userId}`);

            // Получаем все прогрессы пользователя
            const progresses = await UserCourseProgress.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: Course,
                        as: 'course',
                        attributes: ['id', 'title', 'duration_minutes']
                    }
                ]
            });

            // Получаем ST пользователя
            const course = await Course.findAll(); 
            const stTest = await TestResult.findAll({
                where: { user_id: userId } 
            })

            // Рассчитываем статистику
            const totalCourses = course.length;
            const completedCourses = progresses.filter(p => p.passed_test).length;
            const totalTime = progresses.reduce((sum, p) => sum + (p.total_time_spent || 0), 0);
            const averageScore = completedCourses > 0 
                ? progresses.filter(p => p.passed_test).reduce((sum, p) => sum + (p.test_score || 0), 0) / completedCourses
                : 0;

            return res.json({
                user_id: userId,
                total_courses: totalCourses,
                completed_courses: completedCourses,
                completion_rate: totalCourses > 0 ? (completedCourses / totalCourses * 100).toFixed(2) : 0,
                average_score: averageScore.toFixed(2),
                total_time_spent: totalTime,
                st_stats: progresses || null,
                st_test: stTest || null
            });
        } catch (error) {
            console.error('Error getting user stats:', error);
            return next(ApiError.internal('Ошибка при получении статистики пользователя'));
        }
    }
}

// Экспортируем экземпляр класса
module.exports = new UserProgressController();