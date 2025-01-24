import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './style.module.css'; // Импорт CSS модуля
import ButtonAll from '../ButtonAll/ButtonAll';
import { FaRegEdit } from 'react-icons/fa';
import EditUserModal from './EditUserModal'; // Импортируем модальное окно
import IusPtService from '../../services/IusPtService';
import IusPtStore from '../../store/IusPtStore'; // Импорт хранилища

const UserTable = observer(({ info }) => {
    const [showModal, setShowModal] = useState(false); // Состояние для управления модальным окном
    const [isLoading, setIsLoading] = useState(false); // Состояние для отображения загрузки
    const [error, setError] = useState(null); // Состояние для хранения ошибок

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
                tabNumber: info.tab_num,
                name: updatedData.name,
                contractDetails: updatedData.contractDetails,
                computerName: updatedData.computerName,
                location: updatedData.location,
            };

            console.log('Данные для отправки:', userData); // Логируем данные

            // Обновляем данные пользователя через сервис
            await IusPtService.createOrUpdateUser(userData);
            await IusPtStore.fetchStaffWithIusUsers();
            // Обновляем данные в хранилище
            

            setShowModal(false); // Закрываем модальное окно
            console.log('Данные успешно обновлены:', userData);
        } catch (error) {
            console.error('Ошибка при обновлении данных пользователя:', error);
            setError('Ошибка при обновлении данных пользователя');
        } finally {
            setIsLoading(false); // Выключаем индикатор загрузки
        }
    };

    return (
        <>
            {/* Кнопка "Редактировать" */}
            <ButtonAll icon={FaRegEdit} text="Редактировать" onClick={handleEditClick} />

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
                </div>
                <div className={styles.ankCardDinamic}>
                    <p>{info.IusUser ? info.IusUser.name : '-'}</p>
                    <p>{info.fio || ' - '}</p>
                    <p>{info.email || ' - '}</p>
                    <p>{info.department && info.department.length > 13 ? info.department.slice(13) : info.department || ' - '}</p>
                    <p>{info.post || ' - '}</p>
                    <p>{info.tab_num || ' - '}</p>
                    <p>{info.IusUser ? info.IusUser.contractDetails : ' - '}</p>
                    <p>{info.IusUser ? info.IusUser.location : ' - '}</p>
                    <p>{info.IusUser ? info.IusUser.computerName : ' - '}</p>
                    <p>{info.telephone || ' - '}</p>
                    <p>{info.ip || ' - '}</p>
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