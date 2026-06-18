import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Descriptions, message, theme } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import EditUserModal from './EditUserModal';
import IusPtService from '../../services/IusPtService';
import IusPtStore from '../../store/IusPtStore';
import StaffService from '../../../staff/services/StaffService';

const { useToken } = theme;

const UserTable = observer(({ info }) => {
  const { token } = useToken();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const depts = await StaffService.fetchAllDepartments();
        setDepartments(depts);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDepartments();
  }, []);

  const getDepartmentById = (id) => {
    if (!id) return null;
    const code = String(id).split(' ')[0];
    const found = departments.find(d => d.code === code) || departments.find(d => d.code === id);
    return found ? found.description : null;
  };

  const handleEditClick = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
  };

  const handleSave = async (updatedData) => {
    setIsLoading(true);
    setError(null);
    try {
      const userData = {
        tabNumber: info.tabNumber,
        name: updatedData.name,
        contractDetails: updatedData.contractDetails,
        computerName: updatedData.computerName,
        location: updatedData.location,
        manager: updatedData.manager,
        managerEmail: updatedData.managerEmail,
      };
      await IusPtService.createOrUpdateUser(userData);
      await IusPtStore.fetchStaffWithIusUsers();
      setShowModal(false);
      message.success('Данные обновлены');
    } catch (err) {
      console.error(err);
      setError('Ошибка при обновлении данных пользователя');
      message.error('Ошибка обновления');
    } finally {
      setIsLoading(false);
    }
  };

  const items = [
    { label: 'Имя пользователя', children: info.IusUser?.name || '-' },
    { label: 'Фамилия Имя Отчество', children: info.fio || '-' },
    { label: 'Электронная почта', children: info.email || '-' },
    { label: 'Подразделение', children: getDepartmentById(info.department) || '-' },
    { label: 'Должность', children: info.post || '-' },
    { label: 'Табельный номер', children: info.tabNumber || '-' },
    { label: 'Реквизиты договора о конфиденциальности', children: info.IusUser?.contractDetails || '-' },
    { label: 'Расположение (город, адрес)', children: info.IusUser?.location || '-' },
    { label: 'Имя компьютера', children: info.IusUser?.computerName || '-' },
    { label: 'Контактный телефон', children: info.telephone || '-' },
    { label: 'IP адрес', children: info.ip || '-' },
    { label: 'Ф.И.О. руководителя', children: info.IusUser?.manager || '-' },
    { label: 'E-mail руководителя', children: info.IusUser?.managerEmail || '-' },
  ];

  return (
    <div>
      <Button
        icon={<EditOutlined />}
        onClick={handleEditClick}
        style={{ marginBottom: 16 }}
      >
        Редактировать
      </Button>

      <Descriptions
        bordered
        column={1}
        size="small"
        labelStyle={{ width: '40%', background: token.colorBgLayout }}
      >
        {items.map(item => (
          <Descriptions.Item key={item.label} label={item.label}>
            {item.children}
          </Descriptions.Item>
        ))}
      </Descriptions>

      <EditUserModal
        visible={showModal}
        onCancel={handleCloseModal}
        user={info}
        onSave={handleSave}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
});

export default UserTable;