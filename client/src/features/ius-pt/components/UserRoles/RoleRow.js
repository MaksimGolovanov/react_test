import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

const RoleRow = ({ role, isChecked }) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(isChecked);
  }, [isChecked]);

  return (
    <div className={styles.row}>
      <div>
        <input
          type='checkbox'
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className={styles.checkbox}
        />
      </div>
      <div>{role.IusSpravRole?.typename}</div>
      <div>{role.IusSpravRole?.type}</div>
      <div>{role.IusSpravRole?.name}</div>
      <div>{role.IusSpravRole?.code}</div>
      <div>{role.IusSpravRole?.mandat}</div>
      <div>{role.IusSpravRole?.business_process}</div>
      <div>
        {role.createdAt
          ? new Date(role.createdAt).toLocaleString('ru-RU', {
              timeZone: 'Europe/Moscow',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : 'Дата не указана'}
      </div>
    </div>
  );
};

export default RoleRow;