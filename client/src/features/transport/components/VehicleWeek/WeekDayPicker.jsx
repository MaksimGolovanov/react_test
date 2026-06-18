// src/features/transport/components/VehicleWeek/WeekDayPicker.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Button, theme } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { useToken } = theme;

const WeekDayPicker = ({ selectedDate, setSelectedDate }) => {
  const { token } = useToken();
  const today = dayjs().startOf('day');
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const containerRef = useRef(null);

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

          let backgroundColor = token.colorBgContainer;
          let color = token.colorTextSecondary;

          if (isSelectedDay) {
            backgroundColor = token.colorPrimary;
            color = '#fff';
          } else if (isTodayDay) {
            backgroundColor = token.colorSuccess;
            color = '#fff';
          } else if (isPastDay) {
            backgroundColor = token.colorBgLayout;
            color = token.colorTextDisabled;
          } else if (isWeekendDay) {
            backgroundColor = token.colorErrorBg;
            color = token.colorError;
          } else {
            backgroundColor = token.colorBgContainer;
            color = token.colorText;
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
                borderColor: isSelectedDay || isTodayDay ? 'transparent' : token.colorBorder,
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