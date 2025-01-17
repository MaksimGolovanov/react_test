import React, { useState, useEffect } from 'react';
import styles from './style.module.css'; // Импорт CSS модуля
import { FaRegEdit } from "react-icons/fa";
import ButtonAll from '../ButtonAll/ButtonAll';



const IusPtUserInfo = ({ info }) => {


    return (
        <>
            <div style={{margin: '16px 0px'}}>
                <ButtonAll icon={FaRegEdit} text="Редактировать" path="/iuspt" />
            </div>
            <div className={styles.blockInfo} >
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
                    <p>{info.employeeNumber || ' - '}</p> {/* Табельный номер */}
                    <p>{info.contractDetails || ' - '}</p> {/* Реквизиты договора */}
                    <p>{info.location || ' - '}</p> {/* Расположение */}
                    <p>{info.computerName || ' - '}</p> {/* Имя компьютера */}
                    <p>{info.phone || ' - '}</p> {/* Контактный телефон */}
                    <p>{info.ipAddress || ' - '}</p> {/* IP адрес */}
                </div>

            </div>
        </>
    )

}
export default IusPtUserInfo