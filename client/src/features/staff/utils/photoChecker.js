// utils/photoChecker.js

const photoCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут
const REQUEST_TIMEOUT = 3000; // Таймаут 3 секунды

// Основная функция проверки с кэшированием
export const checkPhotoExistsCached = async (tabNumber) => {
  if (!tabNumber || tabNumber.trim() === '') {
    console.debug(`Пустой табельный номер: ${tabNumber}`);
    return false;
  }

  // Проверяем кэш
  const cached = photoCache.get(tabNumber);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.exists;
  }

  try {
    // Используем тот же путь, что и в AvatarWithFallback
    const API_URL = process.env.REACT_APP_API_URL || '';
    const url = `${API_URL}static/photo/${tabNumber}.jpg`;
    
    console.debug(`Проверка фото по URL: ${url}`);
    
    return new Promise((resolve) => {
      const img = new Image();
      
      const timeoutId = setTimeout(() => {
        console.debug(`Таймаут для ${tabNumber}`);
        img.onload = null;
        img.onerror = null;
        img.src = '';
        photoCache.set(tabNumber, { exists: false, timestamp: Date.now() });
        resolve(false);
      }, REQUEST_TIMEOUT);

      img.onload = () => {
        clearTimeout(timeoutId);
        console.debug(`Фото найдено для ${tabNumber}`);
        photoCache.set(tabNumber, { exists: true, timestamp: Date.now() });
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        console.debug(`Фото не найдено для ${tabNumber}`);
        photoCache.set(tabNumber, { exists: false, timestamp: Date.now() });
        resolve(false);
      };

      img.src = url;
    });
    
  } catch (error) {
    console.debug(`Ошибка при проверке фото ${tabNumber}:`, error.message);
    
    // Сохраняем отрицательный результат в кэш
    photoCache.set(tabNumber, { exists: false, timestamp: Date.now() });
    
    return false;
  }
};

// Очистка кэша
export const clearPhotoCache = () => {
  console.debug('Очистка кэша фото');
  photoCache.clear();
};

// Пакетная проверка фото
export const checkPhotosBatch = async (tabNumbers, concurrencyLimit = 5) => {
  if (!tabNumbers || !Array.isArray(tabNumbers) || tabNumbers.length === 0) {
    console.debug('Нет табельных номеров для проверки');
    return {};
  }

  console.debug(`Начало пакетной проверки ${tabNumbers.length} фото`);

  const results = {};
  const toCheck = [];

  // Фильтруем уже закэшированные
  tabNumbers.forEach(tabNumber => {
    const cached = photoCache.get(tabNumber);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      results[tabNumber] = cached.exists;
    } else if (tabNumber && tabNumber.trim()) {
      toCheck.push(tabNumber);
    }
  });

  console.debug(`Из кэша: ${Object.keys(results).length}, для проверки: ${toCheck.length}`);

  if (toCheck.length === 0) {
    return results;
  }

  // Проверяем оставшиеся с ограничением параллелизма
  for (let i = 0; i < toCheck.length; i += concurrencyLimit) {
    const batch = toCheck.slice(i, i + concurrencyLimit);
    console.debug(`Проверка батча ${Math.floor(i / concurrencyLimit) + 1}:`, batch);
    
    const batchPromises = batch.map(tabNumber => 
      checkPhotoExistsCached(tabNumber).then(exists => ({ tabNumber, exists }))
    );

    try {
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(({ tabNumber, exists }) => {
        results[tabNumber] = exists;
      });
      
      console.debug(`Батч ${Math.floor(i / concurrencyLimit) + 1} завершен`);
    } catch (error) {
      console.error('Ошибка в батче:', error);
      batch.forEach(tabNumber => {
        results[tabNumber] = false;
      });
    }
  }

  const foundCount = Object.values(results).filter(v => v).length;
  console.debug(`Проверка завершена. Найдено фото: ${foundCount} из ${tabNumbers.length}`);
  
  return results;
};