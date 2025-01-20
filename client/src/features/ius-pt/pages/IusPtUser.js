import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './style.module.css'; // Импорт CSS модуля
import iusPtStore from '../store/IusPtStore';
import Circle from '../../../Components/circle/Circle';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import IusPtUserInfo from '../components/IusPtUserInfo/IusPtUserInfo';
import { IoArrowBack } from "react-icons/io5";
import ButtonAll from '../components/ButtonAll/ButtonAll';

const IusPtUser = () => {
    const { id } = useParams(); // Получаем id из URL
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null); // Состояние для хранения данных пользователя

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                setError(null);

                // Загружаем данные пользователей и пользователей ИУС
                await iusPtStore.fetchUsers();
                await iusPtStore.fetchIusUsers();

                // Находим пользователя по id
                const foundUser = iusPtStore.users.find(user => user.id === parseInt(id));
                if (!foundUser) {
                    setError("Пользователь не найден.");
                    return;
                }

                // Находим соответствующего пользователя из iususers по табельному номеру
                const foundIusUser = iusPtStore.iususers.find(iusUser => iusUser.tabNumber === foundUser.tab_num);

                // Объединяем данные
                const mergedUser = {
                    ...foundUser, // Данные из users
                    ...foundIusUser, // Данные из iususers
                    location: "169570, Российская Федерация, Республика Коми, г. Вуктыл",
                };

                setUser(mergedUser); // Устанавливаем объединенные данные
            } catch (error) {
                console.error("Ошибка при загрузке пользователей:", error);
                setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]); // Зависимость от id, чтобы данные обновлялись при изменении id

    if (error) {
        return <div className={styles.errorMessage}>{error}</div>;
    }

    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!user) {
        return <div className={styles.errorMessage}>Пользователь не найден.</div>;
    }

    return (
        <>
            <ButtonAll icon={IoArrowBack} text="Назад" path="/iuspt" />
            <div className={styles.userContainer}>
                <div>
                    <Circle
                        initials={`${user.fio.split(' ').map(name => name.charAt(0)).slice(0, 2).join('')}`}
                        size={80}
                    />
                </div>
                <div className={styles.userDetails}>
                    <p className={styles.fio}>{user.fio}</p>
                    <p className={styles.name}>{user.name || '-'}</p>
                    <p className={styles.department}>{user.department && user.department.length > 13 ? user.department.slice(13) : user.department || '-'}</p>
                </div>
            </div>
            <div>
                <Tabs className={styles.customTabs}>
                    <Tab eventKey="Prints" title="Карточка пользователя" className={styles.customTab}>
                        <IusPtUserInfo info={user} />
                    </Tab>
                    <Tab eventKey="print_model" title="Роли" className={styles.customTab}>
                        sdfff
                    </Tab>
                </Tabs>
            </div>
        </>
    );
};

export default IusPtUser;