import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import ButtonAll from '../components/ButtonAll/ButtonAll';
import iusPtStore from '../store/IusPtStore';
import Circle from '../../../Components/circle/Circle';
import styles from './style.module.css'; // Импорт CSS модуля
import UserTable from '../components/UserTable/UserTable';

const IusPtUser = observer(() => {
    const { id } = useParams(); // Получаем ID пользователя из URL
    const navigate = useNavigate(); // Хук для навигации
    const [user, setUser] = useState(null); // Состояние для хранения данных пользователя
    const [isLoading, setIsLoading] = useState(true); // Состояние для отображения загрузки
    const [error, setError] = useState(null); // Состояние для хранения ошибок

    // Загрузка данных о пользователе
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Загружаем данные о сотрудниках и их связях с пользователями ИУС
                await iusPtStore.fetchStaffWithIusUsers();

                // Ищем пользователя по ID
                const foundUser = iusPtStore.staffWithIusUsers.find(
                    (staffUser) => staffUser.id === parseInt(id)
                );

                if (foundUser) {
                    setUser(foundUser);
                } else {
                    setError('Пользователь не найден');
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Ошибка при загрузке данных');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    // Если данные загружаются, показываем индикатор загрузки
    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    // Если произошла ошибка, показываем сообщение об ошибке
    if (error) {
        return <div>{error}</div>;
    }

    // Если пользователь не найден, показываем сообщение
    if (!user) {
        return <div>Пользователь не найден</div>;
    }

    return (
        <>
            {/* Кнопка "Назад" */}
            <ButtonAll icon={IoArrowBack} text="Назад" onClick={() => navigate('/iuspt')} />

            {/* Информация о пользователе */}
            <div className={styles.userContainer}>
                <div>
                    <Circle fullName={user.fio} size={80} />
                </div>
                <div className={styles.userDetails}>
                    <p className={styles.fio}>{user.fio}</p>
                    <p className={styles.name}>{user.IusUser ? user.IusUser.name : '-'}</p>
                    <p className={styles.department}>
                        {user.department && user.department.length > 13
                            ? user.department.slice(13)
                            : user.department || '-'}
                    </p>
                </div>
            </div>

            {/* Вкладки */}
            <Tabs
                defaultActiveKey="home"
                id="uncontrolled-tab-example"
                className={styles.customtabs}
            >
                <Tab eventKey="home" title="Карточка пользователя">
                    <UserTable info={user} />
                </Tab>
                <Tab eventKey="role" title="Роли">
                    <div>Информация о ролях пользователя</div>
                </Tab>
                <Tab eventKey="contact" title="Contact">
                    <div>Контактная информация</div>
                </Tab>
            </Tabs>
        </>
    );
});

export default IusPtUser;