import React, { useState } from 'react';
import { FaRegEdit } from "react-icons/fa";
import ButtonAll from '../ButtonAll/ButtonAll';
import styles from './style.module.css';
import EditUserModal from './EditUserModal'; // Импортируем модальное окно
import iusPtStore from '../../store/IusPtStore'

const IusPtUserInfo = ({ info }) => {
    const [showModal, setShowModal] = useState(false);

    const handleShow = () => { 
        
        setShowModal(true);}
    const handleClose = () => setShowModal(false);

    const handleSave = async (updatedData) => {
        try {
            // Отправляем данные на сервер для создания или обновления
            await iusPtStore.createOrUpdateUser({
                tabNumber: updatedData.tab_num, // Табельный номер для поиска
                name: updatedData.name,
                contractDetails: updatedData.contractDetails,
                computerName: updatedData.computerName,
            });
    
            // Обновляем список пользователей
            await iusPtStore.fetchIusUsers();
        } catch (error) {
            console.error('Ошибка при сохранении данных:', error);
        }
    };

    return (
        <>
            <div style={{ margin: '16px 0px' }}>
                <ButtonAll icon={FaRegEdit} text="Редактировать" onClick={handleShow} />
            </div>

            {/* Модальное окно для редактирования */}
            <EditUserModal
                show={showModal}
                handleClose={handleClose}
                user={info}
                onSave={handleSave}
            />

            <div className={styles.blockInfo}>
                <div className={styles.blockInfoStatic}>
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
                <div className={styles.blockInfoDinamic}>
                    <p>{info.name || ' - '}</p>
                    <p>{info.fio || ' - '}</p>
                    <p>{info.email || ' - '}</p>
                    <p>{info.department && info.department.length > 13 ? info.department.slice(13) : info.department || ' - '}</p>
                    <p>{info.post || ' - '}</p>
                    <p>{info.tab_num || ' - '}</p>
                    <p>{info.contractDetails || ' - '}</p>
                    <p>{info.location || ' - '}</p>
                    <p>{info.computerName || ' - '}</p>
                    <p>{info.telephone || ' - '}</p>
                    <p>{info.ip || ' - '}</p>
                </div>
            </div>
        </>
    );
};

export default IusPtUserInfo;