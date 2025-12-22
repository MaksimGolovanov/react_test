import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timerID = setInterval(() => setDate(new Date()), 1000);

    return () => clearInterval(timerID);
  }, []);

  const formatDate = (d) => {
    const isoDate = d.toISOString();
    const parts = isoDate.split('T')[0].split('-'); // Разделяем ISO-строку на части

    // Формируем нужную строку
    const formattedDate = `${parts[0]}/${parts[1]}/${parts[2]} ${d.toLocaleString('ru-RU', { weekday: 'short' })}`;
    
    return formattedDate;
  }

  const currentDate = formatDate(date);
  
  const timeOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false };
  const currentTime = date.toLocaleString("ru-RU", timeOptions);

  return (
    <div className="text-center mr-4">
      <p style={{ fontWeight: 'bold', color: '#707070', fontSize: '23px', lineHeight: '1.0' }} className="m-0">{currentTime}</p>
      <p style={{ fontWeight: 'bold', color: '#707070', fontSize: '12px', lineHeight: '1.0' }}className="m-0">{currentDate}</p>
    </div>
  );
};

export default Clock;