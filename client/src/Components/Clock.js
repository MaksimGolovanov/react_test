// Components/Clock.js
import React, { useState, useEffect } from 'react';
import { theme } from 'antd';

const { useToken } = theme;

const Clock = () => {
  const [date, setDate] = useState(new Date());
  const { token } = useToken();

  useEffect(() => {
    const timerID = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timerID);
  }, []);

  const formatDate = (d) => {
    const isoDate = d.toISOString();
    const parts = isoDate.split('T')[0].split('-');
    const formattedDate = `${parts[0]}/${parts[1]}/${parts[2]} ${d.toLocaleString('ru-RU', { weekday: 'short' })}`;
    return formattedDate;
  };

  const currentDate = formatDate(date);
  const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
  const currentTime = date.toLocaleString("ru-RU", timeOptions);

  // Основной цвет текста – гарантированно видимый
  const mainColor = token.colorText;
  const secondaryColor = token.colorTextSecondary;

  return (
    <div style={{ textAlign: 'center', marginRight: '16px', lineHeight: 1.2 }}>
      <p style={{ fontWeight: 'bold', color: mainColor, fontSize: '23px', lineHeight: 1.2, margin: 0 }}>
        {currentTime}
      </p>
      <p style={{ fontWeight: 'bold', color: secondaryColor, fontSize: '12px', lineHeight: 1.2, margin: 0 }}>
        {currentDate}
      </p>
    </div>
  );
};

export default Clock;