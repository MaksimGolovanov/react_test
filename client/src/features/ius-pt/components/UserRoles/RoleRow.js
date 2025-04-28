import React, { memo, useCallback } from 'react';
import styles from './style.module.css';

const RoleRow = memo(({ role, isChecked, onSelectRole }) => {
  const handleCheckboxChange = useCallback((e) => {
    const isChecked = e.target.checked;
    onSelectRole(role, isChecked);
  }, [role, onSelectRole]);

  const formattedDate = role.createdAt
    ? new Date(role.createdAt).toLocaleString('ru-RU', {
        timeZone: 'Europe/Moscow',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Дата не указана';

  return (
    <div className={styles.row}>
      <div>
        <input
          type='checkbox'
          checked={isChecked}
          onChange={handleCheckboxChange}
          className={styles.checkbox}
        />
      </div>
      <div>{role.IusSpravRole?.typename}</div>
      <div>{role.IusSpravRole?.type}</div>
      <div>{role.IusSpravRole?.name}</div>
      <div>{role.IusSpravRole?.code}</div>
      <div>{role.IusSpravRole?.mandat}</div>
      <div>{role.IusSpravRole?.business_process}</div>
      <div>{formattedDate}</div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Перерисовываем только если изменились ключевые данные или состояние чекбокса
  return (
    prevProps.isChecked === nextProps.isChecked &&
    prevProps.role.IusSpravRole?.id === nextProps.role.IusSpravRole?.id &&
    prevProps.onSelectRole === nextProps.onSelectRole
  );
});

export default RoleRow;