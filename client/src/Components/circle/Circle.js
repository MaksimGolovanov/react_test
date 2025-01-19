import React, { useState } from 'react';
import styles from './Circle.module.css'; // Импортируйте стили для Circle

const Circle = ({ initials, size = 40 }) => {
  const [color, setColor] = useState(generatePastelColor());

  // Генерация пастельного цвета
  function generatePastelColor() {
    const r = Math.floor(Math.random() * 56 + 100); // Диапазон 200-255
    const g = Math.floor(Math.random() * 56 + 100); // Диапазон 200-255
    const b = Math.floor(Math.random() * 56 + 100); // Диапазон 200-255
    return `rgb(${r}, ${g}, ${b})`;
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
      {initials}
    </div>
  );
};

export default Circle;