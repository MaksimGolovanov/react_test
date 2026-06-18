// src/features/ius-pt/components/UserRoles/RoleSelectionModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, message, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import iusPtStore from '../../store/IusPtStore';

const { useToken } = theme;

const RoleSelectionModal = ({ visible, onClose, targetUser, sourceRoles, sourceUser }) => {
  const { token } = useToken();
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDataReady, setIsDataReady] = useState(false);

  // Загрузка данных: стоп-роли, справочник ролей, роли целевого пользователя
  useEffect(() => {
    if (!visible || !targetUser || !sourceRoles?.length) {
      setRolesData([]);
      setIsDataReady(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Справочник ролей
        if (iusPtStore.roles.length === 0) await iusPtStore.fetchRoles();
        // 2. Стоп-роли
        if (iusPtStore.stopRoles.length === 0) await iusPtStore.fetchStopRoles();
        // 3. Роли целевого пользователя
        await iusPtStore.fetchUserRoles(targetUser.tabNumber);

        const userRoleIds = new Set(iusPtStore.userRoles.map(r => r.IusSpravRole?.id).filter(Boolean));
        const stopRoleMap = new Map();
        iusPtStore.stopRoles.forEach(sr => {
          const code = sr.CodName?.trim();
          if (code) stopRoleMap.set(code, sr);
        });

        const rolesList = sourceRoles
          .map(id => iusPtStore.roles.find(r => r.id === id))
          .filter(Boolean)
          .map(role => {
            const roleCode = role.code?.trim();
            const stopRole = stopRoleMap.get(roleCode);
            const isStopRole = !!stopRole;
            const alreadyHas = userRoleIds.has(role.id);
            return {
              id: role.id,
              code: role.code,
              typename: role.typename || '—',
              isStopRole,
              alreadyHas,
              canDoWithoutApproval: stopRole?.CanDoWithoutApproval || '—',
              disabled: alreadyHas, // только уже имеющиеся роли нельзя выбрать
            };
          });

        setRolesData(rolesList);
        // Автоматически отмечаем только те, которые не disabled (т.е. ещё не назначены пользователю)
        const preSelected = rolesList.filter(r => !r.disabled).map(r => r.id);
        setSelectedRowKeys(preSelected);
        setIsDataReady(true);
      } catch (error) {
        console.error(error);
        message.error('Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [visible, targetUser, sourceRoles]);

  const columns = [
    {
      title: 'Код',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Система',
      dataIndex: 'typename',
      key: 'typename',
    },
    {
      title: 'Запрещено',
      key: 'stopFlag',
      width: 100,
      render: (_, record) => record.isStopRole ? 'Запрещено' : null,
    },
    {
      title: 'Кому можно без согласования',
      dataIndex: 'canDoWithoutApproval',
      key: 'canDoWithoutApproval',
      ellipsis: true,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    getCheckboxProps: (record) => ({
      disabled: record.disabled,
    }),
  };

  const getRowClassName = (record) => {
    if (record.isStopRole) return 'stop-role-row';
    if (record.alreadyHas) return 'already-has-role-row';
    return '';
  };

  // Добавляем глобальные стили для подсветки строк с улучшенным контрастом
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .stop-role-row td {
        background-color: ${token.colorErrorBg} !important;
      }
      .already-has-role-row td {
        background-color: ${token.colorBgContainerDisabled || token.colorFillTertiary || '#f5f5f5'} !important;
        color: ${token.colorTextDisabled} !important;
      }
      .already-has-role-row td .ant-checkbox-wrapper {
        opacity: 0.5;
      }
    `;
    if (visible) document.head.appendChild(style);
    return () => { if (style.parentNode) style.parentNode.removeChild(style); };
  }, [visible, token.colorErrorBg, token.colorBgContainerDisabled, token.colorFillTertiary, token.colorTextDisabled]);

  const handleSubmit = async () => {
    if (!targetUser) {
      message.error('Пользователь не выбран');
      return;
    }
    if (selectedRowKeys.length === 0) {
      message.warning('Не выбрано ни одной роли');
      return;
    }

    // Дополнительная проверка: исключаем роли, которые уже есть у пользователя (на всякий случай)
    const userRoleIds = new Set(iusPtStore.userRoles.map(r => r.IusSpravRole?.id).filter(Boolean));
    const finalRoleIds = selectedRowKeys.filter(id => !userRoleIds.has(id));
    if (finalRoleIds.length === 0) {
      message.warning('Все выбранные роли уже назначены пользователю');
      return;
    }

    setLoading(true);
    try {
      await iusPtStore.addRolesToUser(targetUser.tabNumber, finalRoleIds);
      message.success('Роли успешно добавлены');
      onClose();
      navigate(`/iuspt/user/${targetUser.tabNumber}`);
    } catch (error) {
      console.error('Ошибка добавления ролей:', error);
      if (error.response) {
        console.error('Статус:', error.response.status);
        console.error('Данные ответа:', error.response.data);
        message.error(`Ошибка: ${error.response.data?.message || 'сервер вернул ошибку'}`);
      } else if (error.request) {
        message.error('Нет ответа от сервера');
      } else {
        message.error(error.message || 'Ошибка добавления ролей');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || !isDataReady) {
    return (
      <Modal
        title={`Выберите роли для пользователя ${targetUser?.fio || ''}`}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={900}
      >
        <div style={{ textAlign: 'center', padding: 40, color: token.colorText }}>
          Загрузка данных...
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title={`Выберите роли для пользователя ${targetUser?.fio || ''}`}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>Отмена</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleSubmit}>
          Подтвердить
        </Button>,
      ]}
      width={900}
    >
      <Table
        columns={columns}
        dataSource={rolesData}
        rowKey="id"
        rowSelection={rowSelection}
        pagination={false}
        size="small"
        rowClassName={getRowClassName}
      />
    </Modal>
  );
};

export default RoleSelectionModal;