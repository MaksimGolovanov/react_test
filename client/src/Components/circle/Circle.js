import React, { useState } from 'react';
import styles from './Circle.module.css'; // Импортируйте стили для Circle

const Circle = ({ fullName, size = 40 }) => {
  const [color] = useState(generatePastelColor());

  // Генерация пастельного цвета
  function generatePastelColor() {
    const r = Math.floor(Math.random() * 120 + 70); // Диапазон 100-155
    const g = Math.floor(Math.random() * 120 + 70); // Диапазон 100-155
    const b = Math.floor(Math.random() * 120 + 70); // Диапазон 100-155
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Получение инициалов из полного имени
  function getInitials(name) {
    const parts = name.split(' '); // Разделяем строку по пробелам
    if (parts.length >= 2) {
      // Берем первую букву фамилии и первую букву имени
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    // Если строка содержит только одно слово, возвращаем первую букву
    return parts[0][0].toUpperCase();
  }

  // Стили для круга
  const circleStyle = {
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.45, // Размер текста зависит от размера круга
    lineHeight: `${size}px`, // Выравнивание текста по вертикали
  };

  return (
    <div className={styles.circle} style={circleStyle}>
      {getInitials(fullName)}
    </div>
  );
};

export default Circle;