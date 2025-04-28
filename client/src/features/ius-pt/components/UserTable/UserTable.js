import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import styles from "./style.module.css"; // Импорт CSS модуля
import ButtonAll from "../ButtonAll/ButtonAll";
import { FaRegEdit } from "react-icons/fa";
import EditUserModal from "./EditUserModal"; // Импортируем модальное окно
import IusPtService from "../../services/IusPtService";
import IusPtStore from "../../store/IusPtStore"; // Импорт хранилища
import StaffService from "../../../staff/services/StaffService";

const UserTable = observer(({ info }) => {
  const [showModal, setShowModal] = useState(false); // Состояние для управления модальным окном
  const [isLoading, setIsLoading] = useState(false); // Состояние для отображения загрузки
  const [error, setError] = useState(null); // Состояние для хранения ошибок
  const [departmens, setDepatmens] = useState([]);

  useEffect(() => {
    async function departmensGet() {
      try {
        const departments = await StaffService.fetchDepartment();
        setDepatmens(departments);
      } catch (error) {
        console.error(error);
      }
    }
    departmensGet();
  }, []);

  const getDepartmentById = (id) => {
    const departmentCode = String(id).split(" ")[0];
    const foundDepartment = departmens.find(
      (department) => department.code === departmentCode
    );
    if (foundDepartment) {
      return foundDepartment.description;
    }

    return null; // Вернем null, если отдел не найден
  };

  // Обработчик открытия модального окна
  const handleEditClick = () => {
    setShowModal(true);
  };

  // Обработчик закрытия модального окна
  const handleCloseModal = () => {
    setShowModal(false);
    setError(null); // Сбрасываем ошибку при закрытии модального окна
  };

  // Обработчик сохранения данных
  const handleSave = async (updatedData) => {
    setIsLoading(true); // Включаем индикатор загрузки
    setError(null); // Сбрасываем ошибку

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

      

      // Обновляем данные пользователя через сервис
      await IusPtService.createOrUpdateUser(userData);
      await IusPtStore.fetchStaffWithIusUsers();

      // Обновляем данные в хранилище

      setShowModal(false); // Закрываем модальное окно
      
    } catch (error) {
      console.error("Ошибка при обновлении данных пользователя:", error);
      setError("Ошибка при обновлении данных пользователя");
    } finally {
      setIsLoading(false); // Выключаем индикатор загрузки
    }
  };

  return (
    <>
      {/* Кнопка "Редактировать" */}
      <ButtonAll
        icon={FaRegEdit}
        text="Редактировать"
        onClick={handleEditClick}
      />

      {/* Карточка пользователя */}
      <div className={styles.ankCardContainer}>
        <div className={styles.ankCard}>
          <p>Имя пользователя</p>
          <p>Фамилия Имя Отчество</p>
          <p>Электронная почта</p>
          <p>Подразделение</p>
          <p>Должность</p>
          <p>Табельный номер</p>
          <p>Реквизиты договора о конфиденциальности</p>
          <p>Расположение город, адресс</p>
          <p>Имя компьютера</p>
          <p>Контактный телефон</p>
          <p>IP адрес</p>
          <p>Ф.И.О. непосредственного руководителя пользователя</p>
          <p>E-mail непосредственного руководителя пользователя:</p>
        </div>
        <div className={styles.ankCardDinamic}>
          <p>{info.IusUser ? info.IusUser.name : "-"}</p>
          <p>{info.fio || " - "}</p>
          <p>{info.email || " - "}</p>
          <p>
            {getDepartmentById(info.department)}
          </p>
          <p>{info.post || " - "}</p>
          <p>{info.tabNumber || " - "}</p>
          <p>{info.IusUser ? info.IusUser.contractDetails : " - "}</p>
          <p>{info.IusUser ? info.IusUser.location : " - "}</p>
          <p>{info.IusUser ? info.IusUser.computerName : " - "}</p>
          <p>{info.telephone || " - "}</p>
          <p>{info.ip || " - "}</p>
          <p>{info.IusUser ? info.IusUser.manager : " - "}</p>
          <p>{info.IusUser ? info.IusUser.managerEmail : " - "}</p>
        </div>
      </div>

      {/* Модальное окно редактирования */}
      <EditUserModal
        show={showModal}
        handleClose={handleCloseModal}
        user={info}
        onSave={handleSave}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
});

export default UserTable;
