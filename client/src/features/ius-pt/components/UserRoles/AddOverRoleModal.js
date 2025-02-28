import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './style.module.css';
import SearchInput from '../SearchInput/SearchInput';
import iusPtStore from '../../store/IusPtStore';
import Circle from '../../../../Components/circle/Circle';
import RoleSelectionModal from './RoleSelectionModal'; // Импортируем второе модальное окно

const AddOverRoleModal = ({ show, onHide, role }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false); // Состояние для второго модального окна
  const [userRoles, setUserRoles] = useState([]); // Состояние для ролей выбранного пользователя

  useEffect(() => {
    const fetchData = async () => {
      try {
        await iusPtStore.fetchStaffWithIusUsers();
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = useMemo(() => {
    return iusPtStore.staffWithIusUsers.filter((staffUser) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        staffUser.tabNumber.toLowerCase().includes(searchLower) ||
        staffUser.fio.toLowerCase().includes(searchLower) ||
        staffUser.post.toLowerCase().includes(searchLower) ||
        staffUser.department.toLowerCase().includes(searchLower) ||
        staffUser.email.toLowerCase().includes(searchLower) ||
        (staffUser.IusUser && staffUser.IusUser.name.toLowerCase().includes(searchLower))
      );
    });
  }, [iusPtStore.staffWithIusUsers, searchQuery]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      if (a.fio < b.fio) return -1;
      if (a.fio > b.fio) return 1;
      return 0;
    });
  }, [filteredUsers]);

  const handleUserClick = (tabNumber) => {
    const user = sortedUsers.find(user => user.tabNumber === tabNumber);
    setSelectedUser(user);
  };

  const handleSubmit = async () => {
    if (selectedUser) {
      try {
        // Загружаем роли выбранного пользователя
        await iusPtStore.fetchUserRoles(selectedUser.tabNumber);
        setUserRoles(iusPtStore.userRoles); // Сохраняем роли пользователя
        onHide(); // Закрываем первое модальное окно
        setShowRoleModal(true); // Открываем второе модальное окно
      } catch (error) {
        console.error('Ошибка при загрузке ролей пользователя:', error);
      }
    }
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка: {error?.message || 'Неизвестная ошибка'}</div>;
  }

  return (
    <>
      <Modal show={show} onHide={onHide} className={styles.modalAll}>
        <Modal.Header closeButton className={styles.modalHeader}>
          <Modal.Title className={styles.modalTitle}>Выберите пользователя</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск пользователей..."
          />
          <div className={styles.tablehead}>
            <p className={styles.tableheadfio}>ФИО</p>
            <p className={styles.tableheadname}>Имя для входа</p>
          </div> 
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <tbody className={styles.bodyTable}>
                {sortedUsers.map((staffUser, index) => (
                  <tr
                    key={index}
                    className={`${styles.bodyTableTr} ${selectedUser && selectedUser.tabNumber === staffUser.tabNumber ? styles.selectedRow : ''}`}
                    onClick={() => handleUserClick(staffUser.tabNumber)}
                  >
                    <td>
                      <Circle fullName={staffUser.fio} size={30} />
                    </td>
                    <td className={styles.fioLink}>{staffUser.fio}</td>
                    <td className={styles.nameLink}>{staffUser.IusUser ? staffUser.IusUser.name : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer className={styles.modalFooter}>
          <Button variant="secondary" onClick={onHide} className={styles.buttonSecondary}>
            Закрыть
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className={styles.buttonPrimary}
            disabled={!selectedUser} // Кнопка неактивна, если пользователь не выбран
          >
            Выбрать
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Второе модальное окно */}
      <RoleSelectionModal
        show={showRoleModal}
        onHide={() => setShowRoleModal(false)}
        roles={role} // Передаем выбранные роли
        userRoles={userRoles} // Передаем роли выбранного пользователя
        stopRoles={iusPtStore.stopRoles} // Передаем стоп-роли
        selectedUser={selectedUser}
      />
    </>
  );
};

export default AddOverRoleModal;