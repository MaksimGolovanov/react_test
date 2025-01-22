import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from './UserTable.module.css'; // Импорт CSS модуля
import Circle from '../../../../Components/circle/Circle'

const UserTable = ({ users, iususers }) => {
    return (
        <div className={styles.tableContainer}>
            <Table striped bordered hover className={styles.tableFixed}>
                <thead>
                    <tr>
                        <th style={{ width: '58px'}}></th>
                        <th style={{ width: '250px', textAlign: 'left' }}>ФИО</th>
                        <th className={styles.tableHeader}>Имя для входа</th>
                        <th className={styles.tableHeader}>Email</th>
                        <th className={styles.tableHeader}>Должность</th>
                        <th className={styles.tableHeader}>Служба</th>
                        <th className={styles.tableHeader}>Табельный №</th>
                        <th className={styles.tableHeader}>Статус</th>
                    </tr>
                </thead>
                <tbody>
                {users.map(user => {
                        const iusUser = iususers.find(ius => ius.tabNumber === user.tab_num); // Находим соответствующего пользователя из iususers
                        return (
                            <tr key={user.id}>
                                <td>
                                    <div>
                                        <Circle initials={`${user.fio.split(' ').map(name => name.charAt(0)).slice(0, 2).join('')}`} />
                                    </div>
                                </td>
                                <td>
                                    <Link to={`/iuspt/edit/${user.id}`}>{user.fio}</Link>
                                </td>
                                <td>{iusUser ? iusUser.name : '-'}</td> {/* Используем данные из iususers */}
                                <td>{user.email}</td>
                                <td>{user.post}</td>
                                <td>{user.department.slice(13)}</td>
                                <td>{user.tab_num}</td>
                                <td>Активен</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default UserTable;