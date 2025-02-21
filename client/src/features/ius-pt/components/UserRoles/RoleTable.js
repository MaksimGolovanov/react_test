import React, { useEffect, useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import iusPtStore from '../../store/IusPtStore';
import styles from './style.module.css';
import SearchInput from '../SearchInput/SearchInput';
import RoleTableHeader from './RoleTableHeader';
import RoleGroup from './RoleGroup';
import ButtonAll from '../ButtonAll/ButtonAll';
import { MdDeleteForever } from 'react-icons/md';
import { toJS } from 'mobx';
import { GoChecklist } from "react-icons/go";
import AddOverRoleModal from './AddOverRoleModal';



const RoleTable = observer(({ info }) => {
  const { userRoles, fetchUserRoles, isLoading, error, deleteUserRole } = iusPtStore;
  const [expandedGroups, setExpandedGroups] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [showModal, setShowModal] = useState(false); // Состояние для отображения модального окна

  useEffect(() => {
    fetchUserRoles(info.tabNumber);
  }, [fetchUserRoles, info.tabNumber]);

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

  const handleSelectRole = (role, isChecked) => {
    setSelectedRoles((prev) =>
      isChecked
        ? [...prev, role]
        : prev.filter((r) => r !== role)
    );
  };

  const handleDeleteRoles = async () => {
    try {
      // Преобразуем Proxy-объекты в обычные объекты
      const rolesToDelete = selectedRoles.map(role => toJS(role));

      // Удаляем каждую выбранную роль
      for (const role of rolesToDelete) {
        if (!role.IusSpravRole?.id) {
          console.error('ID роли не найден:', role);
          continue; // Пропускаем роль, если ID отсутствует
        }

        console.log('Удаление роли:', { tabNumber: info.tabNumber, roleId: role.IusSpravRole.id });

        await deleteUserRole(info.tabNumber, role.IusSpravRole.id);
      }

      // Вызываем обновление данных после удаления
      await fetchUserRoles(info.tabNumber);

      // Очищаем список выбранных ролей
      setSelectedRoles([]);
    } catch (error) {
      console.error('Ошибка при удалении ролей:', error);
    }
  };


  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  const rolesArray = Array.isArray(userRoles) ? userRoles : [userRoles];
  const filteredRoles = filterRoles(rolesArray, searchQuery);
  const groupedData = groupRoles(filteredRoles);

  return (
    <>
      <div className='d-flex'>
        <ButtonAll
          icon={MdDeleteForever}
          text='Удалить'
          disabled={selectedRoles.length === 0}
          onClick={handleDeleteRoles}
        />
        <ButtonAll
          icon={GoChecklist}
          text='Создать по образцу'
          disabled={selectedRoles.length === 0}
          onClick={() => setShowModal(true)}
          

        />
      </div>

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
              onSelectRole={handleSelectRole}
            />
          ))}
        </div>
      </div>
      <AddOverRoleModal
        show={showModal}
        onHide={() => setShowModal(false)}
        role={selectedRoles}
        
      />
    </>
  );
});

export default RoleTable;