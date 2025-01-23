import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { IoArrowBack } from "react-icons/io5";
import ButtonAll from '../components/ButtonAll/ButtonAll';
import iusPtStore from '../store/IusPtStore';
import Circle from '../../../Components/circle/Circle';
import styles from './style.module.css'; // Импорт CSS модуля
import UserTable from '../components/UserTable/UserTable';


const IusPtUser = observer(() => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const foundUser = iusPtStore.iusstaffusers.find(user => user.id === parseInt(id));
        setUser(foundUser);
    }, [id]);

    if (!user) {
        return <div>Пользователь не найден</div>;
    }

    return (
        <>
            <ButtonAll icon={IoArrowBack} text="Назад" path="/iuspt" />
            <div className={styles.userContainer}>
                <div>
                    <Circle
                        fullName={user.fio}
                        size={80}
                    />
                </div>
                <div className={styles.userDetails}>
                    <p className={styles.fio}>{user.fio}</p>
                    <p className={styles.name}>{user.IusUser ? user.IusUser.name : '-'}</p>
                    <p className={styles.department}>{user.department && user.department.length > 13 ? user.department.slice(13) : user.department || '-'}</p>
                </div>
            </div>

            <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" className={styles.customtabs}>
                <Tab eventKey="home" title="Карточка пользователя">
                    <UserTable info={user} />
                </Tab>
                <Tab eventKey="role" title="Роли">
                    Tab content for Profile
                </Tab>
                <Tab eventKey="contact" title="Contact">
                    Tab content for Contact
                </Tab>
            </Tabs>


        </>
    );
});

export default IusPtUser;