import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Modal, Input, Button, Space, Spin, message, theme } from 'antd';
import { FixedSizeList as List } from 'react-window';
import iusPtStore from '../../store/IusPtStore';
import RoleSelectionModal from './RoleSelectionModal';

const { useToken } = theme;

const AddOverRoleModal = React.memo(({ visible, onClose, selectedRoles, sourceUser }) => {
    const { token } = useToken();
    const normalizeString = useCallback((str) => (str || '').toLowerCase().trim(), []);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [userRoles, setUserRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchIndex, setSearchIndex] = useState(new Map());

    // Загрузка данных при открытии модалки
    useEffect(() => {
        if (!visible) return;

        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setIsLoading(true);
                await iusPtStore.fetchStaffWithIusUserSimpleOver({ signal: controller.signal });

                const sortedUsers = [...(iusPtStore.staffWithIusUsersSimpleOver || [])]
                    .sort((a, b) => a.fio.localeCompare(b.fio));

                const index = new Map();
                sortedUsers.forEach(user => {
                    const normalized = normalizeString(user.fio);
                    if (!index.has(normalized)) index.set(normalized, []);
                    index.get(normalized).push(user);
                });

                setUsers(sortedUsers);
                setSearchIndex(index);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error(err);
                    setError(err);
                    message.error('Ошибка загрузки списка пользователей');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        return () => controller.abort();
    }, [visible, normalizeString]);

    // Фильтрация с использованием индекса
    const filteredUsers = useMemo(() => {
        if (!searchQuery) return users;
        const query = normalizeString(searchQuery);
        const results = [];
        for (const [key, userGroup] of searchIndex.entries()) {
            if (key.includes(query)) results.push(...userGroup);
        }
        return results;
    }, [users, searchQuery, searchIndex, normalizeString]);

    const handleUserClick = useCallback((tabNumber) => {
        const user = users.find(u => u.tabNumber === tabNumber);
        setSelectedUser(user);
    }, [users]);

    const handleSubmit = useCallback(async () => {
        if (!selectedUser) return;
        setIsLoading(true);
        try {
            await iusPtStore.fetchUserRoles(selectedUser.tabNumber);
            setUserRoles(iusPtStore.userRoles);
            onClose();            // закрываем текущую модалку
            setShowRoleModal(true); // открываем следующую
        } catch (error) {
            console.error(error);
            message.error('Ошибка при загрузке ролей пользователя');
        } finally {
            setIsLoading(false);
        }
    }, [selectedUser, onClose]);

    // Компонент строки для виртуального списка
    const Row = useCallback(({ index, style }) => {
        const user = filteredUsers[index];
        if (!user) return null;
        const isSelected = selectedUser?.tabNumber === user.tabNumber;
        return (
            <div
                style={{
                    ...style,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderBottom: `1px solid ${token.colorBorder}`,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? token.colorPrimaryBg : 'transparent',
                    transition: 'background-color 0.2s',
                }}
                onClick={() => handleUserClick(user.tabNumber)}
                onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = token.controlItemBgHover;
                }}
                onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                }}
            >
                <span style={{ width: '60%', fontWeight: isSelected ? 500 : 400, color: token.colorText }}>
                    {user.fio}
                </span>
                <span style={{ width: '40%', color: token.colorTextSecondary }}>
                    {user.IusUser?.name || ''}
                </span>
            </div>
        );
    }, [filteredUsers, selectedUser, handleUserClick, token]);

    if (error) {
        return (
            <Modal title="Ошибка" open={visible} onCancel={onClose} footer={null}>
                <div style={{ color: token.colorError }}>{error.message || 'Неизвестная ошибка'}</div>
            </Modal>
        );
    }

    return (
        <>
            <Modal
                title="Выберите пользователя"
                open={visible}
                onCancel={onClose}
                footer={[
                    <Button key="cancel" onClick={onClose}>Закрыть</Button>,
                    <Button key="submit" type="primary" onClick={handleSubmit} disabled={!selectedUser}>
                        Выбрать
                    </Button>,
                ]}
                width={600}
            >
                <Input.Search
                    placeholder="Поиск пользователей..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: 16 }}
                    allowClear
                />
                <div
                    style={{
                        display: 'flex',
                        fontWeight: 500,
                        padding: '8px 12px',
                        borderBottom: `1px solid ${token.colorBorder}`,
                        color: token.colorTextSecondary,
                        fontSize: 12,
                    }}
                >
                    <span style={{ width: '60%' }}>ФИО</span>
                    <span style={{ width: '40%' }}>Имя для входа</span>
                </div>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: 40 }}>
                        <Spin tip="Загрузка..." />
                    </div>
                ) : (
                    <List
                        height={400}
                        itemCount={filteredUsers.length}
                        itemSize={48}
                        width="100%"
                    >
                        {Row}
                    </List>
                )}
            </Modal>

            <RoleSelectionModal
                visible={showRoleModal}
                onClose={() => setShowRoleModal(false)}
                targetUser={selectedUser}
                sourceRoles={selectedRoles}
                sourceUser={sourceUser}
            />
        </>
    );
});

export default AddOverRoleModal;