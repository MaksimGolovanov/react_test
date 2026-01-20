// hooks/useTestResults.js
import { useState, useEffect } from 'react';
import CourseService from '../../../../../api/CourseService';
import { checkAnswerCorrect } from '../utils/formatUtils';

export const useTestResults = (user, userStats) => {
  console.log("user",user)
  console.log("userStats",userStats)
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedPanels, setExpandedPanels] = useState([]);

  useEffect(() => {
    const loadTestResults = async () => {
      if (!user?.tabNumber || !userStats) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Используем данные тестов из userStats.st_test
        const stTests = userStats.st_test || [];
        
        // Если нет тестов в st_test, проверяем, есть ли progress данные
        if (stTests.length === 0) {
          setTestResults([]);
          setLoading(false);
          return;
        }

        const results = [];

        for (const test of stTests) {
          try {
            // Получаем вопросы курса
            const questionsResponse = await CourseService.getCourseQuestions(test.course_id);
            const courseQuestions = questionsResponse.questions || questionsResponse || [];

            if (courseQuestions.length === 0) continue;

            // Получаем информацию о курсе для названия
            const courseInfo = userStats.st_stats?.find(
              stat => stat.course_id === test.course_id
            );

            const questionAnalysis = [];
            
            // Анализируем каждый вопрос
            for (const question of courseQuestions) {
              try {
                const questionId = question.id;
                const questionIdStr = questionId.toString();
                let userAnswer = test.answers ? test.answers[questionIdStr] : undefined;

                if (userAnswer === undefined) {
                  // Пытаемся найти ответ по другим ключам
                  const allKeys = Object.keys(test.answers || {});
                  const matchingKey = allKeys.find(
                    key => key.toString() === questionIdStr || parseInt(key) === questionId
                  );
                  if (matchingKey) userAnswer = test.answers[matchingKey];
                }

                // Определяем правильный ответ
                let isCorrect = false;
                let correctAnswer = '';

                if (question.question_type === 'multiple') {
                  const correctOptions = question.options
                    ?.filter((opt) => opt && opt.correct)
                    ?.map((opt) => opt.id) || [];
                  correctAnswer = correctOptions;
                  isCorrect = checkAnswerCorrect(userAnswer, correctAnswer, 'multiple');
                } else {
                  const correctOption = question.options?.find((opt) => opt && opt.correct);
                  correctAnswer = correctOption ? correctOption.id : '';
                  isCorrect = checkAnswerCorrect(userAnswer, correctAnswer, 'single');
                }

                questionAnalysis.push({
                  questionId,
                  questionText: question.question_text,
                  questionType: question.question_type,
                  options: question.options || [],
                  userAnswer,
                  correctAnswer,
                  isCorrect,
                  explanation: question.explanation,
                  points: question.points || 1,
                });
              } catch (error) {
                console.error(`Error analyzing question ${question.id}:`, error);
                continue;
              }
            }

            if (questionAnalysis.length === 0) continue;

            // Рассчитываем статистику
            const correctCount = questionAnalysis.filter(q => q.isCorrect).length;
            const totalQuestions = questionAnalysis.length;
            const totalPoints = questionAnalysis.reduce((sum, q) => sum + (q.points || 1), 0);
            const earnedPoints = questionAnalysis.reduce(
              (sum, q) => sum + (q.isCorrect ? q.points || 1 : 0),
              0
            );

            const score = test.score ? parseFloat(test.score) : 
                         (totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0);

            results.push({
              courseId: test.course_id,
              courseName: courseInfo?.course?.title || `Курс ${test.course_id}`,
              score: score,
              passed: test.passed === true || test.passed === 't' ||
                     (typeof test.passed === 'string' && test.passed.toLowerCase() === 'true'),
              date: test.created_at || test.updated_at,
              totalQuestions,
              correctCount,
              totalPoints,
              earnedPoints,
              questionAnalysis,
              timeSpent: test.time_spent || 0,
              attemptNumber: test.attempt_number || 1,
            });
          } catch (error) {
            console.error(`Error loading test details for course ${test.course_id}:`, error);
          }
        }

        // Сортируем по дате
        results.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        setTestResults(results);
      } catch (error) {
        console.error('Error loading test results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && userStats) {
      loadTestResults();
    } else {
      setLoading(false);
    }
  }, [user, userStats]);

  const handlePanelChange = (keys) => {
    setExpandedPanels(keys);
  };

  return { testResults, loading, expandedPanels, handlePanelChange };
};