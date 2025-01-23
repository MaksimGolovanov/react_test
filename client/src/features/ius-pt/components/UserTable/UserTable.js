import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './style.module.css'; // Импорт CSS модуля
import ButtonAll from '../ButtonAll/ButtonAll';
import { FaRegEdit } from "react-icons/fa";
import EditUserModal from './EditUserModal'; // Импортируем модальное окно

const UserTable = observer(({ info }) => {
    const [showModal, setShowModal] = useState(false); // Состояние для управления видимостью модального окна

    const handleEditClick = () => {
        setShowModal(true); // Показываем модальное окно при нажатии на кнопку
    };

    const handleCloseModal = () => {
        setShowModal(false); // Скрываем модальное окно
    };

    const handleSave = (updatedData) => {
        // Здесь можно обновить данные пользователя, например, через MobX или другой state management
        console.log('Updated Data:', updatedData);
        setShowModal(false); // Закрываем модальное окно после сохранения
    };

    return (
        <>
            <ButtonAll icon={FaRegEdit} text="Редактировать" onClick={handleEditClick} />
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
                    <p>{info.location || ' - '}</p>
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
            />
        </>
    );
});

export default UserTable;