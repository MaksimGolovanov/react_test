import React from 'react';
import styles from './style.module.css';

const RoleTableHeader = () => {
  return (
    <div className={styles.header}>
      <div></div>
      <div>Тип</div>
      <div>SID</div>
      <div>Функциональная роль/Бизнес-роль</div>
      <div>Код роли</div>
      <div>Мандат</div>
      <div>Бизнес процесс</div>
      <div>Дата назначения роли</div>
    </div>
  );
};

export default RoleTableHeader;