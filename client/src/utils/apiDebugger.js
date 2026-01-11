// src/utils/apiDebugger.js

/**
 * Утилита для отладки API запросов
 */
export const debugAPI = async (method, url, data = null) => {
  console.log(`🔍 API Debug: ${method} ${url}`);

  if (data) {
    console.log('📦 Request data:', JSON.stringify(data, null, 2));
  }

  try {
    const startTime = Date.now();
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: data ? JSON.stringify(data) : null,
      credentials: 'include', // Для отправки куки, если нужно
    });

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`⏱️ Response time: ${duration}ms`);
    console.log(
      `📊 Response status: ${response.status} ${response.statusText}`
    );

    // Логируем заголовки ответа
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('📋 Response headers:', headers);

    const text = await response.text();
    console.log('📄 Response body:', text);

    try {
      const json = JSON.parse(text);
      console.log('✅ JSON parsed successfully');
      return {
        success: response.ok,
        status: response.status,
        data: json,
        headers,
        duration,
      };
    } catch (jsonError) {
      console.log('⚠️ Response is not JSON');
      return {
        success: response.ok,
        status: response.status,
        data: text,
        headers,
        duration,
      };
    }
  } catch (error) {
    console.error('❌ API Error:', error);
    return {
      success: false,
      error: error.message,
      stack: error.stack,
    };
  }
};

/**
 * Тестирование всех возможных API эндпоинтов
 */
export const testAllAPIEndpoints = async (userId, courseId) => {
  console.log('🧪 Начинаем тестирование API эндпоинтов...');

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/';
  console.log(`🌐 Base URL: ${baseUrl}`);
  console.log(`👤 User ID: ${userId}`);
  console.log(`📚 Course ID: ${courseId}`);

  // Тестовые данные для запросов
  const testProgressData = {
    completed_lessons: ['test_lesson_1'],
    test_score: 0,
    passed_test: false,
    total_time_spent: 5,
    last_activity: new Date().toISOString(),
  };

  const testLessonData = {
    lesson_id: 'test_lesson_1',
    action: 'complete',
  };

  // Список эндпоинтов для тестирования
  const tests = [
    // GET запросы
    {
      method: 'GET',
      url: `${baseUrl}api/courses/${courseId}`,
      description: 'Получить информацию о курсе',
    },
    {
      method: 'GET',
      url: `${baseUrl}api/courses`,
      description: 'Получить список курсов',
    },
    {
      method: 'GET',
      url: `${baseUrl}api/courses/${courseId}/lessons`,
      description: 'Получить уроки курса',
    },

    // Прогресс пользователя - различные варианты
    {
      method: 'GET',
      url: `${baseUrl}api/user-progress/${userId}/${courseId}`,
      description: 'GET прогресс пользователя (вариант 1)',
    },
    {
      method: 'GET',
      url: `${baseUrl}api/courses/user-progress/${userId}/courses/${courseId}`,
      description: 'GET прогресс пользователя (вариант 2)',
    },
    {
      method: 'GET',
      url: `${baseUrl}api/progress/${userId}/${courseId}`,
      description: 'GET прогресс пользователя (вариант 3)',
    },

    // Обновление прогресса - PUT
    {
      method: 'PUT',
      url: `${baseUrl}api/user-progress/${userId}/${courseId}`,
      data: testProgressData,
      description: 'Обновить прогресс (вариант 1)',
    },
    {
      method: 'PUT',
      url: `${baseUrl}api/courses/user-progress/${userId}/courses/${courseId}`,
      data: testProgressData,
      description: 'Обновить прогресс (вариант 2)',
    },

    // Завершение урока - POST
    {
      method: 'POST',
      url: `${baseUrl}api/courses/${courseId}/complete-lesson/${userId}`,
      data: testLessonData,
      description: 'Завершить урок (вариант 1)',
    },
    {
      method: 'POST',
      url: `${baseUrl}api/lessons/complete`,
      data: { userId, courseId, ...testLessonData },
      description: 'Завершить урок (вариант 2)',
    },

    // Создание прогресса - POST
    {
      method: 'POST',
      url: `${baseUrl}api/user-progress`,
      data: { user_id: userId, course_id: courseId, ...testProgressData },
      description: 'Создать запись прогресса',
    },
  ];

  const results = [];

  for (const test of tests) {
    console.log(`\n--- Тестируем: ${test.description} ---`);
    console.log(`📞 Метод: ${test.method}, URL: ${test.url}`);

    const result = await debugAPI(test.method, test.url, test.data);

    const testResult = {
      description: test.description,
      url: test.url,
      method: test.method,
      success: result.success,
      status: result.status,
      duration: result.duration,
      data: result.data,
    };

    results.push(testResult);

    console.log(`Результат: ${result.success ? '✅ УСПЕХ' : '❌ ОШИБКА'}`);
    console.log(`Статус: ${result.status || 'N/A'}`);
    console.log(`Время: ${result.duration || 'N/A'}ms`);
  }

  // Сводка результатов
  console.log('\n📊 СВОДКА РЕЗУЛЬТАТОВ ТЕСТИРОВАНИЯ:');
  console.log('='.repeat(50));

  const successfulTests = results.filter((r) => r.success);
  const failedTests = results.filter((r) => !r.success);

  console.log(`✅ Успешных тестов: ${successfulTests.length}`);
  console.log(`❌ Неуспешных тестов: ${failedTests.length}`);
  console.log(`📈 Общее количество: ${results.length}`);

  if (successfulTests.length > 0) {
    console.log('\n📋 Рабочие эндпоинты:');
    successfulTests.forEach((test) => {
      console.log(`  ✅ ${test.description}`);
      console.log(`     ${test.method} ${test.url}`);
    });
  }

  if (failedTests.length > 0) {
    console.log('\n⚠️ Проблемные эндпоинты:');
    failedTests.forEach((test) => {
      console.log(`  ❌ ${test.description}`);
      console.log(`     ${test.method} ${test.url}`);
      console.log(`     Статус: ${test.status || 'N/A'}`);
    });
  }

  return results;
};

/**
 * Простой тест основных эндпоинтов
 */
export const quickAPITest = async () => {
  console.log('🚀 Быстрый тест API...');

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

  // Получаем userId из localStorage или других источников
  const authData =
    localStorage.getItem('securityTrainingAuth') ||
    localStorage.getItem('auth');
  let userId = '';

  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      userId = parsed.tabNumber || parsed.userId || '';
    } catch (e) {
      console.log('Не удалось распарсить auth данные');
    }
  }

  // Тестовые данные
  const testUserId = userId || 'test_user_123';
  const testCourseId = 'test_course_456';

  const basicTests = [
    { method: 'GET', url: `${baseUrl}api/health`, description: 'Health check' },
    {
      method: 'GET',
      url: `${baseUrl}api/courses`,
      description: 'Список курсов',
    },
    {
      method: 'GET',
      url: `${baseUrl}api/courses/${testCourseId}`,
      description: 'Конкретный курс',
    },
  ];

  const results = [];

  for (const test of basicTests) {
    console.log(`\nТестируем: ${test.description}`);
    const result = await debugAPI(test.method, test.url);
    results.push({ ...test, result });
  }

  return results;
};

/**
 * Тестирование CORS и доступности сервера
 */
export const testServerConnectivity = async () => {
  console.log('🔌 Тестирование подключения к серверу...');

  const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

  try {
    // Простой запрос без параметров
    const response = await fetch(baseUrl);
    console.log(`Сервер доступен: ${response.ok ? '✅' : '❌'}`);
    console.log(`Статус: ${response.status} ${response.statusText}`);

    // Проверяем заголовки CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': response.headers.get(
        'Access-Control-Allow-Origin'
      ),
      'Access-Control-Allow-Methods': response.headers.get(
        'Access-Control-Allow-Methods'
      ),
      'Access-Control-Allow-Headers': response.headers.get(
        'Access-Control-Allow-Headers'
      ),
    };

    console.log('CORS заголовки:', corsHeaders);

    return {
      available: response.ok,
      status: response.status,
      corsHeaders,
    };
  } catch (error) {
    console.error('❌ Сервер недоступен:', error.message);
    return {
      available: false,
      error: error.message,
    };
  }
};

// Экспорт по умолчанию для удобства
export default {
  debugAPI,
  testAllAPIEndpoints,
  quickAPITest,
  testServerConnectivity,
};
