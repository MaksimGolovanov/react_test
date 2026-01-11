// server/controllers/CourseController.js
const { Course, Lesson, Question } = require("../../models/courseModels");
const { UserCourseProgress, TestResult } = require("../../models/courseModels");
const ApiError = require("../../error/ApiError");
const { Op } = require("sequelize");

class CourseController {
  // Получение всех курсов (с пагинацией и фильтрами)
  async getAllCourses(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        level,
        category,
        active = true,
        search,
      } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      if (active !== "false") {
        where.is_active = true;
      }

      if (level) {
        where.level = level;
      }

      if (category) {
        where.category = category;
      }

      if (search) {
        where[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { short_description: { [Op.iLike]: `%${search}%` } },
        ];
      }

      const { count, rows: courses } = await Course.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [
          ["order_index", "ASC"],
          ["created_at", "DESC"],
        ],
        include: [
          {
            model: Lesson,
            as: "lessons",
            where: { is_active: true },
            required: false,
            attributes: ["id", "title", "duration", "order_index"],
          },
          {
            model: Question,
            as: "questions",
            where: { is_active: true },
            required: false,
            attributes: ["id"],
          },
        ],
        distinct: true,
      });

      return res.json({
        courses,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit),
        },
      });
    } catch (error) {
      console.error("Error getting courses:", error);
      return next(ApiError.internal("Ошибка при получении курсов"));
    }
  }

  async getCourseCountsByCategory(req, res, next) {
    try {
      console.log("getCourseCountsByCategory called");

      // Определяем все категории
      const categories = ["it", "ot", "pb", "med"];
      const result = {};

      // Для каждой категории выполняем отдельный запрос
      for (const category of categories) {
        const count = await Course.count({
          where: {
            category: category,
            is_active: true,
          },
        });
        result[category] = count;
        console.log(`Category ${category}: ${count} courses`);
      }

      console.log("Formatted counts:", result);
      return res.json(result);
    } catch (error) {
      console.error("Error getting course counts by category:", error);
      return next(ApiError.internal("Ошибка при получении количества курсов"));
    }
  }

  static async submitTestResult(userId, courseId, testData) {
    try {
      console.log("Submitting test result to API:", {
        userId,
        courseId,
        testData,
      });

      // Вариант 1: Используем endpoint из UserProgressController
      const response = await axios.post(
        `${API_URL}api/courses/${courseId}/submit-test/${userId}`,
        testData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Вариант 2: Или используем существующий endpoint
      // const response = await axios.post(
      //   `${API_URL}api/tests/${userId}/courses/${courseId}/submit`,
      //   testData
      // );

      console.log("Test submission API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error submitting test result:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      throw error;
    }
  }

  // Получение курса по ID
  async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      const { includeLessons = true, includeQuestions = true } = req.query;

      const include = [];

      if (includeLessons === "true") {
        include.push({
          model: Lesson,
          as: "lessons",
          where: { is_active: true },
          required: false,
          order: [["order_index", "ASC"]],
        });
      }

      if (includeQuestions === "true") {
        include.push({
          model: Question,
          as: "questions",
          where: { is_active: true },
          required: false,
          order: [["order_index", "ASC"]],
        });
      }

      const course = await Course.findByPk(id, {
        include,
      });

      if (!course) {
        return next(ApiError.notFound("Курс не найден"));
      }

      return res.json(course);
    } catch (error) {
      console.error("Error getting course:", error);
      return next(ApiError.internal("Ошибка при получении курса"));
    }
  }

  // Создание курса
  async createCourse(req, res, next) {
    try {
      const {
        title,
        description,
        short_description,
        level = "beginner",
        duration,
        duration_minutes = 0,
        icon,
        cover_image,
        is_active = true,
        order_index = 0,
        passing_score = 70,
        attempts_limit = 3,
        certification_available = false,
        category = "basics",
        tags = [],
      } = req.body;

      if (!title) {
        return next(ApiError.badRequest("Название курса обязательно"));
      }

      // Проверяем уникальность названия
      const existingCourse = await Course.findOne({ where: { title } });
      if (existingCourse) {
        return next(
          ApiError.badRequest("Курс с таким названием уже существует")
        );
      }

      const course = await Course.create({
        title,
        description,
        short_description: short_description || description?.substring(0, 500),
        level,
        duration,
        duration_minutes,
        icon,
        cover_image,
        is_active,
        order_index,
        passing_score,
        attempts_limit,
        certification_available,
        category,
        tags: Array.isArray(tags) ? tags : [],
      });

      return res.status(201).json({
        message: "Курс успешно создан",
        course,
      });
    } catch (error) {
      console.error("Error creating course:", error);
      return next(ApiError.internal("Ошибка при создании курса"));
    }
  }

  // Обновление курса
  async updateCourse(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const course = await Course.findByPk(id);
      if (!course) {
        return next(ApiError.notFound("Курс не найден"));
      }

      // Если меняется название, проверяем уникальность
      if (updateData.title && updateData.title !== course.title) {
        const existingCourse = await Course.findOne({
          where: {
            title: updateData.title,
            id: { [Op.ne]: id },
          },
        });
        if (existingCourse) {
          return next(
            ApiError.badRequest("Курс с таким названием уже существует")
          );
        }
      }

      // Обновляем курс
      await course.update(updateData);

      return res.json({
        message: "Курс успешно обновлен",
        course,
      });
    } catch (error) {
      console.error("Error updating course:", error);
      return next(ApiError.internal("Ошибка при обновлении курса"));
    }
  }

  // Удаление курса
  async deleteCourse(req, res, next) {
    try {
      const { id } = req.params;

      const course = await Course.findByPk(id);
      if (!course) {
        return next(ApiError.notFound("Курс не найден"));
      }

      // Проверяем, есть ли связанные данные
      const hasProgress = await UserCourseProgress.findOne({
        where: { course_id: id },
      });

      if (hasProgress) {
        // Если есть прогресс пользователей, деактивируем курс вместо удаления
        await course.update({ is_active: false });
        return res.json({
          message: "Курс деактивирован (имеет прогресс пользователей)",
        });
      }

      // Удаляем связанные уроки и вопросы
      await Lesson.destroy({ where: { course_id: id } });
      await Question.destroy({ where: { course_id: id } });

      // Удаляем курс
      await course.destroy();

      return res.json({ message: "Курс успешно удален" });
    } catch (error) {
      console.error("Error deleting course:", error);
      return next(ApiError.internal("Ошибка при удалении курса"));
    }
  }

  // Управление уроками курса
  async getCourseLessons(req, res, next) {
    try {
      const { id } = req.params;

      const lessons = await Lesson.findAll({
        where: { course_id: id, is_active: true },
        order: [["order_index", "ASC"]],
      });

      return res.json(lessons);
    } catch (error) {
      console.error("Error getting lessons:", error);
      return next(ApiError.internal("Ошибка при получении уроков"));
    }
  }

  async createLesson(req, res, next) {
    try {
      const { id } = req.params;
      const {
        title,
        content,
        content_type = "text",
        video_url,
        presentation_url,
        duration = 0,
        order_index = 0,
        is_active = true,
        additional_resources = [],
      } = req.body;

      if (!title) {
        return next(ApiError.badRequest("Название урока обязательно"));
      }

      // Проверяем существование курса
      const course = await Course.findByPk(id);
      if (!course) {
        return next(ApiError.notFound("Курс не найден"));
      }

      const lesson = await Lesson.create({
        course_id: id,
        title,
        content,
        content_type,
        video_url,
        presentation_url,
        duration,
        order_index,
        is_active,
        additional_resources: Array.isArray(additional_resources)
          ? additional_resources
          : [],
      });

      return res.status(201).json({
        message: "Урок успешно создан",
        lesson,
      });
    } catch (error) {
      console.error("Error creating lesson:", error);
      return next(ApiError.internal("Ошибка при создании урока"));
    }
  }

  async updateLesson(req, res, next) {
    try {
      const { id, lessonId } = req.params;
      const updateData = req.body;

      const lesson = await Lesson.findOne({
        where: { id: lessonId, course_id: id },
      });

      if (!lesson) {
        return next(ApiError.notFound("Урок не найден"));
      }

      await lesson.update(updateData);

      return res.json({
        message: "Урок успешно обновлен",
        lesson,
      });
    } catch (error) {
      console.error("Error updating lesson:", error);
      return next(ApiError.internal("Ошибка при обновлении урока"));
    }
  }

  async deleteLesson(req, res, next) {
    try {
      const { id, lessonId } = req.params;

      const lesson = await Lesson.findOne({
        where: { id: lessonId, course_id: id },
      });

      if (!lesson) {
        return next(ApiError.notFound("Урок не найден"));
      }

      await lesson.destroy();

      return res.json({ message: "Урок успешно удален" });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      return next(ApiError.internal("Ошибка при удалении урока"));
    }
  }

  // Управление вопросами теста
  async getCourseQuestions(req, res, next) {
    try {
      const { id } = req.params;

      const questions = await Question.findAll({
        where: { course_id: id, is_active: true },
        order: [["order_index", "ASC"]],
      });

      return res.json(questions);
    } catch (error) {
      console.error("Error getting questions:", error);
      return next(ApiError.internal("Ошибка при получении вопросов"));
    }
  }

  async createQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const {
        question_text,
        question_type = "single",
        options = [],
        correct_answer,
        explanation,
        points = 1,
        order_index = 0,
        is_active = true,
      } = req.body;

      if (!question_text) {
        return next(ApiError.badRequest("Текст вопроса обязателен"));
      }

      // Проверяем существование курса
      const course = await Course.findByPk(id);
      if (!course) {
        return next(ApiError.notFound("Курс не найден"));
      }

      // Валидация options для типов single/multiple
      if (question_type === "single" || question_type === "multiple") {
        if (!Array.isArray(options) || options.length < 2) {
          return next(
            ApiError.badRequest(
              "Для этого типа вопроса требуется как минимум 2 варианта ответа"
            )
          );
        }

        const correctOptions = options.filter((opt) => opt.correct);
        if (question_type === "single" && correctOptions.length !== 1) {
          return next(
            ApiError.badRequest(
              "Для одиночного выбора должен быть ровно один правильный ответ"
            )
          );
        }

        if (question_type === "multiple" && correctOptions.length < 1) {
          return next(
            ApiError.badRequest(
              "Для множественного выбора должен быть хотя бы один правильный ответ"
            )
          );
        }
      }

      const question = await Question.create({
        course_id: id,
        question_text,
        question_type,
        options,
        correct_answer,
        explanation,
        points,
        order_index,
        is_active,
      });

      return res.status(201).json({
        message: "Вопрос успешно создан",
        question,
      });
    } catch (error) {
      console.error("Error creating question:", error);
      return next(ApiError.internal("Ошибка при создании вопроса"));
    }
  }

  async updateQuestion(req, res, next) {
    try {
      const { id, questionId } = req.params;
      const updateData = req.body;

      const question = await Question.findOne({
        where: { id: questionId, course_id: id },
      });

      if (!question) {
        return next(ApiError.notFound("Вопрос не найден"));
      }

      // Валидация options при обновлении
      if (updateData.options) {
        const questionType = updateData.question_type || question.question_type;

        if (questionType === "single" || questionType === "multiple") {
          if (
            !Array.isArray(updateData.options) ||
            updateData.options.length < 2
          ) {
            return next(
              ApiError.badRequest(
                "Для этого типа вопроса требуется как минимум 2 варианта ответа"
              )
            );
          }

          const correctOptions = updateData.options.filter(
            (opt) => opt.correct
          );
          if (questionType === "single" && correctOptions.length !== 1) {
            return next(
              ApiError.badRequest(
                "Для одиночного выбора должен быть ровно один правильный ответ"
              )
            );
          }

          if (questionType === "multiple" && correctOptions.length < 1) {
            return next(
              ApiError.badRequest(
                "Для множественного выбора должен быть хотя бы один правильный ответ"
              )
            );
          }
        }
      }

      await question.update(updateData);

      return res.json({
        message: "Вопрос успешно обновлен",
        question,
      });
    } catch (error) {
      console.error("Error updating question:", error);
      return next(ApiError.internal("Ошибка при обновлении вопроса"));
    }
  }

  async deleteQuestion(req, res, next) {
    try {
      const { id, questionId } = req.params;

      const question = await Question.findOne({
        where: { id: questionId, course_id: id },
      });

      if (!question) {
        return next(ApiError.notFound("Вопрос не найден"));
      }

      await question.destroy();

      return res.json({ message: "Вопрос успешно удален" });
    } catch (error) {
      console.error("Error deleting question:", error);
      return next(ApiError.internal("Ошибка при удалении вопроса"));
    }
  }

  // Получение статистики по курсу
  async getCourseStats(req, res, next) {
    try {
      const { id } = req.params;

      const course = await Course.findByPk(id);
      if (!course) {
        return next(ApiError.notFound("Курс не найден"));
      }

      // Количество пользователей, прошедших курс
      const completedCount = await UserCourseProgress.count({
        where: {
          course_id: id,
          passed_test: true,
        },
      });

      // Средний балл
      const avgScoreResult = await TestResult.findOne({
        where: { course_id: id },
        attributes: [
          [sequelize.fn("AVG", sequelize.col("score")), "avg_score"],
        ],
        raw: true,
      });

      // Количество попыток
      const attemptsCount = await TestResult.count({
        where: { course_id: id },
      });

      // Последние результаты
      const recentResults = await TestResult.findAll({
        where: { course_id: id },
        order: [["created_at", "DESC"]],
        limit: 10,
        include: [
          {
            model: require("../models/models").User,
            attributes: ["login", "tabNumber"],
          },
        ],
      });

      return res.json({
        course: {
          id: course.id,
          title: course.title,
          level: course.level,
          category: course.category,
        },
        stats: {
          total_completed: completedCount,
          avg_score: avgScoreResult?.avg_score || 0,
          total_attempts: attemptsCount,
          passing_rate:
            attemptsCount > 0
              ? ((completedCount / attemptsCount) * 100).toFixed(2)
              : 0,
        },
        recent_results: recentResults,
      });
    } catch (error) {
      console.error("Error getting course stats:", error);
      return next(ApiError.internal("Ошибка при получении статистики курса"));
    }
  }
}

module.exports = new CourseController();
