// utils/formatUtils.js
/**
 * Форматирует время из минут в читаемый формат
 */
export const formatTimeFromMinutes = (minutes) => {
  if (!minutes || minutes === 0) return '0 мин';
  if (minutes < 60) return `${minutes} мин`;

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins === 0 ? `${hours} ч` : `${hours} ч ${mins} мин`;
};

/**
 * Получает текст опции по её ID
 */
export const getOptionText = (options, optionId) => {
  if (!options || !Array.isArray(options)) return optionId;
  const option = options.find((opt) => opt.id === optionId);
  return option ? option.text : optionId;
};

/**
 * Форматирует отображение ответа
 */
export const formatAnswerDisplay = (answer, questionType, options) => {
  if (!answer) return 'Нет ответа';
  if (Array.isArray(answer)) {
    return answer.map((opt) => getOptionText(options, opt)).join(', ');
  }
  return getOptionText(options, answer);
};

/**
 * Проверяет правильность ответа
 */
export const checkAnswerCorrect = (userAnswer, correctAnswer, questionType) => {
  if (!userAnswer || !correctAnswer) return false;

  if (questionType === 'multiple') {
    if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) return false;
    const sortedUser = [...userAnswer].sort();
    const sortedCorrect = [...correctAnswer].sort();
    return JSON.stringify(sortedUser) === JSON.stringify(sortedCorrect);
  }
  return userAnswer === correctAnswer;
};