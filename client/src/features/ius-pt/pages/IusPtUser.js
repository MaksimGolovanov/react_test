import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useParams, useNavigate } from 'react-router-dom';
import { IoArrowBack, IoCreateOutline } from 'react-icons/io5';
import ButtonAll from '../components/ButtonAll/ButtonAll';
import iusPtStore from '../store/IusPtStore';
import Circle from '../../../Components/circle/Circle';
import styles from './style.module.css';
import UserTable from '../components/UserTable/UserTable';
import UserRoles from '../components/UserRoles/UserRoles';
import UserRolesPage from '../components/UserRolesPage/UserRolesPage';

const IusPtUser = observer(() => {
    const { tabNumber } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // Загружаем данные о сотруднике и получаем результат
                const userData = await iusPtStore.fetchStaffByTabNumber(tabNumber);
                
                
                // Проверяем, что данные получены
                if (userData && typeof userData === 'object' && !Array.isArray(userData)) {
                    setUser(userData);
                } else {
                    setError('Пользователь не найден');
                }
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
                setError('Ошибка при загрузке данных. Пожалуйста, попробуйте позже.');
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchUser();
    }, [tabNumber]);

   

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (!user) {
        return <div>Данные пользователя не загружены</div>;
    }
    
    return (
        <>
            <div style={{display: 'flex'}}>
                <ButtonAll icon={IoArrowBack} text="Назад" onClick={() => navigate('/iuspt')} />
                <ButtonAll icon={IoCreateOutline} text="Создать заявку" 
                    onClick={() => navigate(`/iuspt/user-application/${tabNumber}`)}/>
            </div>

            <div className={styles.userContainer}>
                <div>
                    <Circle fullName={user.fio} employeeId={user.tabNumber} size={80} />
                </div>
                <div className={styles.userDetails}>
                    <p className={styles.fio}>{user.fio}</p>
                    <p className={styles.name}>{user.IusUser?.name || '-'}</p>
                    <p className={styles.department}>
                        {user.department?.length > 13 
                            ? user.department.slice(13) 
                            : user.department || '-'}
                    </p>
                </div>
            </div>

            <Tabs defaultActiveKey="home" id="user-tabs" className={styles.customtabs}>
                <Tab eventKey="home" title="Карточка пользователя">
                    <UserTable info={user} />
                </Tab>
                <Tab eventKey="role" title="Роли">
                    <UserRoles info={user} />
                </Tab>
                <Tab eventKey="contact" title="Добавление ролей">
                    <UserRolesPage info={user} />
                </Tab>
            </Tabs>
        </>
    );
});

export default IusPtUser;