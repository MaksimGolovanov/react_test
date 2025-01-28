import React, { useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import iusPtStore from '../../store/IusPtStore';
import styles from './style.module.css';
import SearchInput from '../SearchInput/SearchInput';
import RoleTableHeader from './RoleTableHeader';
import RoleGroup from './RoleGroup';

const RoleTable = observer(({ info }) => {
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

  return (
    <>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Поиск ролей..."
        className={styles.search}
      />

      <div className={styles.container}>
        <RoleTableHeader />
        <div className={styles.tableBody}>
          {Object.keys(groupedData).map((typename) => (
            <RoleGroup
              key={typename}
              typename={typename}
              types={groupedData[typename]}
              expandedGroups={expandedGroups}
              toggleGroup={toggleGroup}
            />
          ))}
        </div>
      </div>
    </>
  );
});

export default RoleTable;