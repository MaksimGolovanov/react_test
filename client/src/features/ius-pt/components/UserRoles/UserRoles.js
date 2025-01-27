import React, { useEffect, useState, useCallback } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';
import iusPtStore from '../../store/IusPtStore';
import styles from './style.module.css';
import SearchInput from '../SearchInput/SearchInput';

const UserRoles = observer(({ info }) => {
  const { userRoles, fetchUserRoles, isLoading, error } = iusPtStore;
  const [expandedGroups, setExpandedGroups] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    fetchUserRoles(info.tab_num);
  }, [fetchUserRoles, info.tab_num]);

  const toggleGroup = useCallback((key) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const filterRoles = useCallback((roles, query) => {
    return roles.filter((role) =>
      Object.values(role.IusSpravRole || {}).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  }, []);

  const groupRoles = useCallback((roles) => {
    return roles.reduce((acc, role) => {
      const typename = role.IusSpravRole?.typename || 'Без типа';
      const type = role.IusSpravRole?.type || 'Без типа';

      if (!acc[typename]) acc[typename] = {};
      if (!acc[typename][type]) acc[typename][type] = [];

      acc[typename][type].push(role);
      return acc;
    }, {});
  }, []);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];
  const filteredRoles = filterRoles(rolesArray, searchQuery);
  const groupedData = groupRoles(filteredRoles);
  console.log(groupedData)
  return (
    <>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Поиск ролей..."
        className={styles.search}
      />

      <div className={styles.container}>
        <div className={styles.header}>
          <div>Тип</div>
          <div>SID</div>
          <div>Функциональная роль/Бизнес-роль</div>
          <div>Код роли</div>
          <div>Мандат</div>
          <div>Бизнес процесс</div>
          <div>Дата назначения роли</div> {/* Новый столбец */}
        </div>

        <div className={styles.tableBody}>
          {Object.keys(groupedData).map((typename) => (
            <div key={typename} className={styles.group}>
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
                  {typename} ({Object.values(groupedData[typename]).flat().length} элементов)
                </Button>
              </div>

              <Collapse in={expandedGroups[typename]}>
                <div id={`group-${typename}`} className={styles.groupContent}>
                  {Object.keys(groupedData[typename]).map((type) => (
                    <div key={type} className={styles.subGroup}>
                      <div className={styles.subGroupHeader}>
                        <Button
                          variant="link"
                          onClick={() => toggleGroup(`${typename}-${type}`)}
                          aria-controls={`sub-group-${typename}-${type}`}
                          aria-expanded={expandedGroups[`${typename}-${type}`]}
                          className={styles.toggleButton}
                        >
                          <span className={styles.icon}>
                            {expandedGroups[`${typename}-${type}`] ? <FaAngleDown /> : <FaAngleRight />}
                          </span>
                          {type} ({groupedData[typename][type].length} элементов)
                        </Button>
                      </div>

                      <Collapse in={expandedGroups[`${typename}-${type}`]}>
                        <div id={`sub-group-${typename}-${type}`} className={styles.groupContent}>
                          {groupedData[typename][type].map((role, index) => (
                            <div key={`${typename}-${type}-${index}`} className={styles.row}>
                              <div>{role.IusSpravRole?.typename}</div>
                              <div>{role.IusSpravRole?.type}</div>
                              <div>{role.IusSpravRole?.name}</div>
                              <div>{role.IusSpravRole?.code}</div>
                              <div>{role.IusSpravRole?.mandat}</div>
                              <div>{role.IusSpravRole?.business_process}</div>
                              <div>
                                {role.assignedAt
                                  ? new Date(role.createdAt).toLocaleString('ru-RU', {
                                      timeZone: 'Europe/Moscow',
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric'
                                      
                                    })
                                  : 'Дата не указана'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </Collapse>
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