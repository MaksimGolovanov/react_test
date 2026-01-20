// src/features/security-training/utils/stringUtils.js
export const getCourseWord = (count) => {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'курсов';
  if (lastDigit === 1) return 'курс';
  if (lastDigit >= 2 && lastDigit <= 4) return 'курса';
  return 'курсов';
};