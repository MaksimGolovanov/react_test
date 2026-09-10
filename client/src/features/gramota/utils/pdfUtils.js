/**
 * Безопасный парсинг макета
 */
export const parseLayout = (layout) => {
  if (!layout) return null;
  if (typeof layout === 'string') {
    try {
      return JSON.parse(layout);
    } catch {
      return null;
    }
  }
  return layout;
};

/**
 * Замена переменных в тексте
 */
export const replaceVariables = (text, staff) => {
  const date = new Date();
  const genderWord = staff.gender === 'female' ? 'Занявшая' : 'Занявший';
  const place = staff.place || 'I';
  const placePhrase =
    place.toLowerCase() === 'участие'
      ? 'За участие'
      : `${genderWord} ${place} место`;

  const replacements = {
    '{fio}': staff.fio || '',
    '{post}': staff.post || '',
    '{department}': staff.departmentName || staff.department || '',
    '{date}': date.toLocaleDateString('ru-RU'),
    '{year}': date.getFullYear().toString(),
    '{place}': place,
    '{gender_word}': genderWord,
    '{place_phrase}': placePhrase,
    '{age}': staff.age || 50,
  };

  let result = text;
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(key, 'g'), value);
  }
  return result;
};

/**
 * Получение стиля элемента с учётом макета
 */
export const getElementStyle = (parsedLayout, type, defaultStyle) => {
  if (parsedLayout?.elements) {
    const el = parsedLayout.elements.find((e) => e.type === type);
    if (el) {
      if (el.enabled === false) return null;
      return { ...defaultStyle, ...el.style };
    }
  }
  return { ...defaultStyle };
};
