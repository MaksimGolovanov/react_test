import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const WeekDayPicker = ({ selectedDate, setSelectedDate }) => {
  const today = dayjs().startOf('day');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkTheme = () => {
      setIsDarkTheme(document.body.classList.contains('dark-theme'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const getDaysRelativeToToday = () => {
    const days = [];
    const baseDate = today.add(currentWeekOffset, 'week');
    for (let i = -3; i <= 10; i++) days.push(baseDate.add(i, 'day'));
    return days;
  };

  const weekDays = getDaysRelativeToToday();

  useEffect(() => {
    if (containerRef.current) {
      const todayIndex = 3;
      const scrollAmount = todayIndex * 56 - containerRef.current.clientWidth / 2 + 28;
      containerRef.current.scrollTo({ left: scrollAmount, behavior: 'auto' });
    }
  }, [currentWeekOffset]);

  const goToPrevWeek = () => setCurrentWeekOffset(currentWeekOffset - 1);
  const goToNextWeek = () => setCurrentWeekOffset(currentWeekOffset + 1);
  const goToCurrentWeek = () => {
    setCurrentWeekOffset(0);
    setSelectedDate(today);
  };

  const isPast = (day) => day.isBefore(today, 'day');
  const isToday = (day) => day.isSame(today, 'day');
  const isSelected = (day) => day.isSame(selectedDate, 'day');
  const isWeekend = (day) => day.day() === 0 || day.day() === 6;
  const isCurrentWeek = currentWeekOffset === 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
      <Button size="small" icon={<LeftOutlined />} onClick={goToPrevWeek} type="text" />
      <div ref={containerRef} style={{ display: 'flex', gap: 4, overflowX: 'auto', flex: 1 }}>
        {weekDays.map((day) => {
          const isPastDay = isPast(day);
          const isTodayDay = isToday(day);
          const isSelectedDay = isSelected(day);
          const isWeekendDay = isWeekend(day);

          let backgroundColor = '#fff';
          let color = '#666';

          if (isSelectedDay) {
            backgroundColor = isDarkTheme ? '#1890ff' : '#1451fa';
            color = '#fff';
          } else if (isTodayDay) {
            backgroundColor = isDarkTheme ? '#2e5a4e' : '#a8c599';
            color = '#fff';
          } else if (isPastDay) {
            backgroundColor = isDarkTheme ? 'rgba(255,255,255,0.08)' : '#f5f5f5';
            color = isDarkTheme ? '#aaa' : '#bfbfbf';
          } else if (isWeekendDay) {
            backgroundColor = isDarkTheme ? 'rgba(255,77,79,0.2)' : '#ffd9d9';
            color = isDarkTheme ? '#ffa39e' : '#d4380d';
          } else {
            backgroundColor = isDarkTheme ? 'rgba(255,255,255,0.05)' : '#fff';
            color = isDarkTheme ? '#e0e0e0' : '#666';
          }

          return (
            <Button
              key={day.format('DD.MM.YYYY')}
              size="small"
              style={{
                minWidth: 52,
                padding: '2px 4px',
                height: 'auto',
                textAlign: 'center',
                backgroundColor,
                borderColor: isSelectedDay || isTodayDay ? 'transparent' : '#d9d9d9',
                color,
                opacity: isPastDay ? 0.6 : 1,
              }}
              onClick={() => setSelectedDate(day.startOf('day'))}
            >
              <div style={{ fontSize: 11, fontWeight: isSelectedDay ? 600 : 400 }}>
                {day.format('ddd').toUpperCase().slice(0, 2)}
              </div>
              <div style={{ fontSize: 10 }}>{day.format('DD')}</div>
            </Button>
          );
        })}
      </div>
      <Button size="small" icon={<RightOutlined />} onClick={goToNextWeek} type="text" />
      {!isCurrentWeek && (
        <Button size="small" onClick={goToCurrentWeek} type="link" style={{ fontSize: 11 }}>
          Текущая
        </Button>
      )}
    </div>
  );
};

export default WeekDayPicker;