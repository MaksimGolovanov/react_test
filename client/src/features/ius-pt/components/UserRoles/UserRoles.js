import React, { useEffect, useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa'; // Иконки для раскрытия/сворачивания
import { observer } from 'mobx-react-lite';
import iusPtStore from '../../store/IusPtStore';
import styles from './style.module.css'; // Импорт стилей
import SearchInput from '../SearchInput/SearchInput';

const UserRoles = observer(({ info }) => {
  const { userRoles, fetchUserRoles, isLoading } = iusPtStore;
  const [expandedGroups, setExpandedGroups] = useState({}); // Состояние для отслеживания раскрытых групп
  const [searchQuery, setSearchQuery] = useState(''); // Состояние для поискового запроса

  useEffect(() => {
    
    fetchUserRoles(info.tab_num);
  }, [fetchUserRoles, info.tab_num]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  

  // Преобразуем данные в массив, если это необходимо
  const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];

  // Группировка данных по `typename`
  const groupedData = rolesArray.reduce((acc, role) => {
    const key = role.IusSpravRole?.typename || 'Без типа';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(role);
    return acc;
  }, {});

  // Фильтрация данных по поисковому запросу
  const filteredGroupedData = Object.keys(groupedData).reduce((acc, typename) => {
    const filteredRoles = groupedData[typename].filter((role) =>
      role.IusSpravRole?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.IusSpravRole?.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.IusSpravRole?.typename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.IusSpravRole?.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredRoles.length > 0) {
      acc[typename] = filteredRoles;
    }
    return acc;
  }, {});

  // Обработчик для сворачивания/разворачивания групп
  const toggleGroup = (typename) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [typename]: !prev[typename], // Инвертируем текущее состояние группы
    }));
  };

  return (
    <>
      {/* Поле поиска */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Поиск ролей..."
        styles className={styles.search}
      />

      {/* Таблица с данными */}
      <div className={styles.container}>
        {/* Заголовок */}
        <div className={styles.header}>
          <div>Тип</div>
          <div>SID</div>
          <div>Функциональная роль/Бизнес-роль</div>
          <div>Код роли</div>
          <div>Мандат</div>
          <div>Бизнес процесс</div>
        </div>

        {/* Группы */}
        <div className={styles.tableBody}>
          {Object.keys(filteredGroupedData).map((typename) => (
            <div key={typename} className={styles.group}>
              {/* Родительская строка для группы */}
              <div className={styles.groupHeader}>
                <Button
                  variant="link"
                  onClick={() => toggleGroup(typename)}
                  aria-controls={`group-${typename}`}
                  aria-expanded={expandedGroups[typename]}
                  className={styles.toggleButton}
                >
                  <span className={styles.icon}>
                    {expandedGroups[typename] ? <FaAngleDown /> : <FaAngleRight />}
                  </span>
                  {typename} ({filteredGroupedData[typename].length} элементов)
                </Button>
              </div>

              {/* Дочерние строки группы */}
              <Collapse in={expandedGroups[typename]}>
                <div id={`group-${typename}`} className={styles.groupContent}>
                  {filteredGroupedData[typename].map((role, index) => (
                    <div key={`${typename}-${index}`} className={styles.row}>
                      <div>{role.IusSpravRole?.typename}</div>
                      <div>{role.IusSpravRole?.type}</div>
                      <div>{role.IusSpravRole?.name}</div>
                      <div>{role.IusSpravRole?.code}</div>
                      <div>{role.mandat}</div>
                      <div>{role.business_process}</div>
                    </div>
                  ))}
                </div>
              </Collapse>
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

export default UserRoles;