import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FixedSizeList as List } from 'react-window';
import styles from './style.module.css';
import SearchInput from '../SearchInput/SearchInput';
import iusPtStore from '../../store/IusPtStore';
import RoleSelectionModal from './RoleSelectionModal';

const AddOverRoleModal = React.memo(({ show, onHide, role }) => {
    const normalizeString = useCallback((str) => (str || '').toLowerCase().trim(), []);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [userRoles, setUserRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchIndex, setSearchIndex] = useState(new Map());

    // Загрузка и предварительная обработка данных
    useEffect(() => {
        if (!show) return;

        const controller = new AbortController();
        
        const fetchData = async () => {
            try {
                setIsLoading(true);
                await iusPtStore.fetchStaffWithIusUserSimpleOver({ signal: controller.signal });
                
                // Сортировка и индексация данных
                const sortedUsers = [...(iusPtStore.staffWithIusUsersSimpleOver || [])]
                    .sort((a, b) => a.fio.localeCompare(b.fio));
                
                // Создание поискового индекса
                const index = new Map();
                sortedUsers.forEach(user => {
                    const normalizedFio = normalizeString(user.fio);
                    if (!index.has(normalizedFio)) {
                        index.set(normalizedFio, []);
                    }
                    index.get(normalizedFio).push(user);
                });

                setUsers(sortedUsers);
                setSearchIndex(index);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Ошибка при загрузке данных:', err);
                    setError(err);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        
        return () => controller.abort();
    }, [show, normalizeString]);

    // Оптимизированная фильтрация с использованием индекса
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        
        const query = normalizeString(searchQuery);
        const results = [];
        
        // Быстрый поиск по индексу
        for (const [key, userGroup] of searchIndex.entries()) {
            if (key.includes(query)) {
                results.push(...userGroup);
            }
        }
        
        return results;
    }, [users, searchQuery, searchIndex, normalizeString]); // Добавлена normalizeString

    // Оптимизированные обработчики
    const handleUserClick = useCallback((tabNumber) => {
        setSelectedUser(users.find(user => user.tabNumber === tabNumber));
    }, [users]);

    const handleSubmit = useCallback(async () => {
        if (!selectedUser) return;

        try {
            setIsLoading(true);
            await iusPtStore.fetchUserRoles(selectedUser.tabNumber);
            setUserRoles(iusPtStore.userRoles);
            onHide();
            setShowRoleModal(true);
        } catch (error) {
            console.error('Ошибка при загрузке ролей пользователя:', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedUser, onHide]);

    // Оптимизированный рендеринг строк таблицы
    const Row = useCallback(({ index, style }) => {
        const staffUser = filteredUsers[index];
        return (
            <UserRow 
                staffUser={staffUser}
                isSelected={selectedUser?.tabNumber === staffUser.tabNumber}
                onClick={handleUserClick}
                style={style}
            />
        );
    }, [filteredUsers, selectedUser, handleUserClick]);

    if (isLoading) {
        return <div className={styles.loading}>Загрузка...</div>;
    }

    if (error) {
        return <div className={styles.error}>Ошибка: {error?.message || 'Неизвестная ошибка'}</div>;
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
                        debounceTime={300}
                    />
                    <div className={styles.tablehead}>
                        <p className={styles.tableheadfio}>ФИО</p>
                        <p className={styles.tableheadname}>Имя для входа</p>
                    </div>
                    <div className={styles.tableContainer}>
                        <List
                            height={400}
                            itemCount={filteredUsers.length}
                            itemSize={38}
                            width="100%"
                        >
                            {Row}
                        </List>
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
                        disabled={!selectedUser}
                    >
                        Выбрать
                    </Button>
                </Modal.Footer>
            </Modal>

            <RoleSelectionModal
                show={showRoleModal}
                onHide={() => setShowRoleModal(false)}
                roles={role}
                userRoles={userRoles}
                stopRoles={iusPtStore.stopRoles}
                selectedUser={selectedUser}
            />
        </>
    );
});

// Оптимизированный компонент строки
const UserRow = React.memo(({ staffUser, isSelected, onClick, style }) => {
    const handleClick = useCallback(() => {
        onClick(staffUser.tabNumber);
    }, [onClick, staffUser.tabNumber]);
    
    return (
        <div style={style}>
            <div 
                className={`${styles.rowContainer} ${isSelected ? styles.selectedRow : ''}`}
                onClick={handleClick}
            >
                <span className={styles.fioLink}>{staffUser.fio}</span>
                <span className={styles.nameLink}>
                    {staffUser.IusUser?.name || ''}
                </span>
            </div>
        </div>
    );
}, (prevProps, nextProps) => (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.staffUser.tabNumber === nextProps.staffUser.tabNumber &&
    prevProps.staffUser.fio === nextProps.staffUser.fio &&
    prevProps.staffUser.IusUser?.name === nextProps.staffUser.IusUser?.name
));

export default AddOverRoleModal;