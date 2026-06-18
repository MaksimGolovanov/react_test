import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Row, Col, Spin, Typography, Modal, Button, message } from 'antd';
import StaffService from '../services/StaffService';
import StaffCreateModal from '../modal/StaffCreateModal';
import StaffEditModal from '../modal/StaffEditModal';
import StaffImportModal from '../modal/StaffImportModal';
import UserProfilePanel from '../components/UserProfilePanel/UserProfilePanel';
import TopActionsPanel from '../components/TopActionsPanel/TopActionsPanel';
import StaffListPanel from '../components/StaffListPanel/StaffListPanel';
import styles from './style.module.css';
import { useNavigate } from 'react-router-dom';
import passwordGenerator from '../utils/passwordGenerator';
import { checkPhotosBatch, clearPhotoCache } from '../utils/photoChecker';
import { exportStaffToExcel, downloadExcelFile } from '../utils/exportUtils';

const { Text } = Typography;

// Константа исключённых отделов (остаётся без изменений)
const EXCLUDED_DEPARTMENTS = [
  'Бюро пропусков Вуктыльского ЛПУМГ',
  'ППО "Газпром трансгаз Ухта профсоюз - Вуктыльское ЛПУМГ"',
  'Техническая группа (Вуктыльское ЛПУМГ)',
  'Вуктыльское отделение',
  'Врачебный здравпункт Вуктыльского ЛПУМГ',
  'Служба строительного контроля',
];

function Staff() {
  const [staff, setStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [showNoPhoto, setShowNoPhoto] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  const navigate = useNavigate();

  // Функция стабильной сортировки (без изменений)
  const sortStaff = useCallback((staffArray) => {
    if (!Array.isArray(staffArray)) return [];
    return [...staffArray].sort((a, b) => (a.fio || '').localeCompare(b.fio || ''));
  }, []);

  // Функция загрузки данных с сопоставлением отделов по полному совпадению
  const fetchDataWithDepartments = useCallback(
    async (deptData) => {
      try {
        const fetchedStaff = await StaffService.fetchStaff();

        // Проверка фото
        const tabNumbers = fetchedStaff
          .map((item) => item.tabNumber)
          .filter((tabNumber) => tabNumber && tabNumber.trim() !== '');
        let photoResults = {};
        try {
          photoResults = await checkPhotosBatch(tabNumbers);
        } catch (photoError) {
          console.error('Ошибка при проверке фото:', photoError);
        }

        // Сопоставляем отделы по точному совпадению строки department с code
        const staffWithDepartmentInfo = fetchedStaff.map((item) => {
          const delValue = item.del;
          let isDeleted = false;
          if (delValue === true || delValue === 1 || delValue === '1') {
            isDeleted = true;
          }
          const hasPhoto = !!photoResults[item.tabNumber];
          const departmentCode = item.department || '';
          // Ищем отдел по полному совпадению
          const dept = deptData.find(d => d.code === departmentCode);
          const departmentName = dept ? dept.description : departmentCode; // fallback – сам код
          const isExcludedDepartment = EXCLUDED_DEPARTMENTS.includes(departmentName);

          return {
            ...item,
            departmentName,
            isExcludedDepartment,
            hasPhoto,
            isDeleted,
          };
        });

        const sortedStaff = sortStaff(staffWithDepartmentInfo);
        setStaff(sortedStaff);

        // Выбираем первого подходящего пользователя
        const firstUser = sortedStaff.find(
          (u) => !u.isExcludedDepartment && !u.isDeleted
        );
        if (firstUser) {
          setSelectedUser(firstUser);
        }
      } catch (error) {
        console.error('Ошибка при загрузке сотрудников:', error);
        message.error('Ошибка при загрузке данных');
      }
    },
    [sortStaff]
  );

  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const deptData = await StaffService.fetchAllDepartments();
        setDepartments(deptData);
        await fetchDataWithDepartments(deptData);
        setDataVersion((prev) => prev + 1);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        message.error('Ошибка при загрузке данных');
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, [fetchDataWithDepartments]);

  const fetchData = useCallback(async () => {
    await fetchDataWithDepartments(departments);
    setDataVersion((prev) => prev + 1);
  }, [departments, fetchDataWithDepartments]);

  // Счётчики (без изменений)
  const { activeCount, deletedCount, noPhotoCount, excludedCount } = useMemo(() => {
    const mainStaff = staff.filter((user) => !user.isExcludedDepartment);
    const active = mainStaff.filter((user) => !user.isDeleted);
    const deleted = mainStaff.filter((user) => user.isDeleted);
    const noPhoto = staff.filter((user) => !user.hasPhoto && !user.isDeleted);
    const excluded = staff.filter((user) => user.isExcludedDepartment);
    return {
      activeCount: active.length,
      deletedCount: deleted.length,
      noPhotoCount: noPhoto.length,
      excludedCount: excluded.length,
    };
  }, [staff]);

  // Фильтрация (без изменений)
  const filteredStaff = useMemo(() => {
    if (!Array.isArray(staff) || staff.length === 0) return [];
    let result = [...staff];
    if (!showDeleted) {
      result = result.filter((user) => !user.isDeleted || user.isExcludedDepartment);
    }
    if (showNoPhoto) {
      result = result.filter((user) => !user.hasPhoto);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((user) => {
        const fields = [
          user.fio,
          user.post,
          user.departmentName,
          user.login,
          user.tabNumber,
          user.ip,
        ];
        return fields.some((field) => field && field.toString().toLowerCase().includes(query));
      });
    }
    return sortStaff(result);
  }, [staff, searchQuery, showNoPhoto, showDeleted, sortStaff]);

  // Автовыбор (без изменений)
  useEffect(() => {
    if (filteredStaff.length > 0) {
      if (selectedUser && filteredStaff.find((u) => u.tabNumber === selectedUser.tabNumber)) {
        return;
      }
      setSelectedUser(filteredStaff[0]);
    } else {
      setSelectedUser(null);
    }
  }, [filteredStaff, selectedUser]);

  // Обработчики (без изменений)
  const handleGeneratePassword = useCallback(() => {
    if (!showPasswordField) setShowPasswordField(true);
    const result = passwordGenerator.generatePassword(15);
    setGeneratedPassword(result.password);
    setPasswordCopied(false);
    if (!result.password) {
      message.error('Не удалось сгенерировать пароль. Попробуйте еще раз.');
    } else {
      message.success('Пароль сгенерирован');
    }
  }, [showPasswordField]);

  const handleCopyPassword = useCallback(async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setPasswordCopied(true);
      setTimeout(() => setPasswordCopied(false), 2000);
    } catch {
      message.error('Не удалось скопировать пароль');
    }
  }, [generatedPassword]);

  const handleCreateUser = () => setCreateModalOpen(true);
  const handleEditUser = () => {
    if (selectedUser) setEditModalOpen(true);
  };
  const handleImportUsers = () => setImportModalOpen(true);
  const handleSpravClick = () => navigate('/staff/sprav');
  const handlePSW = () => navigate('/staff/psw');

  const handleExportClick = useCallback(async () => {
    setExportLoading(true);
    try {
      const allUsb = await StaffService.fetchAllUsb();
      const usbByFio = new Map();
      allUsb.forEach((usb) => {
        if (usb.fio) {
          const fioLower = usb.fio.toLowerCase();
          if (!usbByFio.has(fioLower)) usbByFio.set(fioLower, []);
          usbByFio.get(fioLower).push(usb);
        }
      });
      const getUsbList = (staffMember) => {
        const fioLower = (staffMember.fio || '').toLowerCase().trim();
        const devices = usbByFio.get(fioLower) || [];
        const activeDevices = devices.filter((d) => d.log === 'Да');
        return activeDevices.map((d) => d.num_form || '').filter(Boolean).join(', ');
      };
      const exportResult = exportStaffToExcel(filteredStaff, EXCLUDED_DEPARTMENTS, getUsbList);
      downloadExcelFile(exportResult.workbook, exportResult.fileName);
      message.success('Экспорт успешно завершен');
    } catch {
      message.error('Ошибка при экспорте файла');
    } finally {
      setExportLoading(false);
    }
  }, [filteredStaff]);

  const handleDeleteUser = useCallback(async () => {
    if (!selectedUser || selectedUser.isDeleted) return;
    try {
      await StaffService.deleteStaff(selectedUser.tabNumber);
      await fetchData();
      setDeleteModalVisible(false);
      message.success('Сотрудник успешно удален');
    } catch {
      message.error('Ошибка при удалении сотрудника');
    }
  }, [selectedUser, fetchData]);

  const handleToggleDeleted = useCallback((checked) => {
    setShowDeleted(checked);
    if (checked && !selectedUser && filteredStaff.length > 0) {
      setSelectedUser(filteredStaff[0]);
    } else if (!checked && selectedUser?.isDeleted) {
      const firstActive = staff.find((u) => !u.isExcludedDepartment && !u.isDeleted);
      setSelectedUser(firstActive || null);
    }
  }, [selectedUser, filteredStaff, staff]);

  const handleToggleNoPhoto = useCallback((checked) => {
    setShowNoPhoto(checked);
    if (checked && !selectedUser && filteredStaff.length > 0) {
      setSelectedUser(filteredStaff[0]);
    }
  }, [selectedUser, filteredStaff]);

  const handleUserUpdate = useCallback(async () => {
    if (selectedUser?.tabNumber) clearPhotoCache();
    await fetchData();
  }, [selectedUser, fetchData]);

  const handleClearSearch = useCallback(() => setSearchQuery(''), []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Spin size="large" tip="Загрузка сотрудников..." />
      </div>
    );
  }

  return (
    <div className={styles.staffContainer}>
      <TopActionsPanel
        onCreate={handleCreateUser}
        onEdit={handleEditUser}
        onDelete={setDeleteModalVisible}
        onImport={handleImportUsers}
        onExport={handleExportClick}
        onSprav={handleSpravClick}
        onPsw={handlePSW}
        onToggleDeleted={handleToggleDeleted}
        onToggleNoPhoto={handleToggleNoPhoto}
        selectedUser={selectedUser}
        showDeleted={showDeleted}
        showNoPhoto={showNoPhoto}
        exportLoading={exportLoading}
        generatedPassword={generatedPassword}
        onGeneratePassword={handleGeneratePassword}
        onCopyPassword={handleCopyPassword}
        passwordCopied={passwordCopied}
        showPasswordField={showPasswordField}
        noPhotoCount={noPhotoCount}
        staff={staff}
        excludedCount={excludedCount}
        onClearSearch={handleClearSearch}
      />

      <Row gutter={16} className={styles.mainContent}>
        <Col xs={24} md={10} className={styles.userListPanel}>
          <StaffListPanel
            staff={filteredStaff}
            selectedUser={selectedUser}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onUserSelect={setSelectedUser}
            totalCount={staff.filter((u) => !u.isExcludedDepartment).length}
            activeCount={activeCount}
            deletedCount={deletedCount}
            noPhotoCount={noPhotoCount}
            excludedCount={excludedCount}
            showDeleted={showDeleted}
            showNoPhoto={showNoPhoto}
            dataVersion={dataVersion}
          />
        </Col>

        <Col xs={24} md={14} className={styles.profilePanel}>
          <UserProfilePanel
            key={`profile-${selectedUser?.tabNumber || 'empty'}-${dataVersion}`}
            user={selectedUser || null}
            onUpdate={handleUserUpdate}
            onEdit={selectedUser ? handleEditUser : null}
            onDelete={selectedUser ? () => setDeleteModalVisible(true) : null}
          />
        </Col>
      </Row>

      <StaffCreateModal
        isOpen={createModalOpen}
        onRequestClose={() => setCreateModalOpen(false)}
        fetchData={handleUserUpdate}
      />

      {selectedUser && (
        <StaffEditModal
          isOpen={editModalOpen}
          onRequestClose={() => setEditModalOpen(false)}
          selectedData={selectedUser}
          fetchData={handleUserUpdate}
          isExcludedUser={selectedUser?.isExcludedDepartment || false}
        />
      )}

      <StaffImportModal
        isOpen={importModalOpen}
        onRequestClose={() => setImportModalOpen(false)}
        onSuccess={handleUserUpdate}
      />

      <Modal
        title="Удаление сотрудника"
        open={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>Отмена</Button>,
          <Button key="delete" type="primary" danger onClick={handleDeleteUser}>Удалить</Button>,
        ]}
      >
        <p>
          Вы уверены, что хотите{' '}
          {selectedUser?.isDeleted ? 'окончательно удалить' : 'удалить'}{' '}
          сотрудника <strong>{selectedUser?.fio}</strong>?
        </p>
        {selectedUser?.isDeleted && (
          <Text type="danger">
            ВНИМАНИЕ: Этот сотрудник уже отмечен как уволенный. Удаление будет окончательным!
          </Text>
        )}
        <Text type="secondary">Это действие нельзя отменить.</Text>
      </Modal>
    </div>
  );
}

export default Staff;