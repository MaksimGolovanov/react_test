import React, { useEffect, useCallback } from 'react';
import { useObserver } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import userStore from '../Store/UserStore';
import { Table, Button, Card } from 'react-bootstrap';
import { IoIosCreate } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";
import './Admin.css';


const Admin = () => {

    const navigate = useNavigate();
    useEffect(() => {
        userStore.fetchUsers();
    }, []);

    const handleEditUser = (userId) => {

        navigate(`/admin/edit/${userId}`);
    }

    return useObserver(() => (
        <div>

            <Card style={{ width: '1000px' }}>
                <Table striped bordered hover variant="white" className='table-staff mb-0'>
                    <thead>
                        <tr>
                            <th style={{ width: '100px' }}>Логин</th>
                            <th style={{ width: '250px' }}>Описание</th>
                            <th>Роли</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userStore.loading ? (
                            <tr ><td colSpan="3">Загрузка...</td></tr>
                        ) : (
                            userStore.userRoles.map(user => (
                                <tr key={user.id} onClick={() => handleEditUser(user.id)}>
                                    <td >{user.login}</td>
                                    <td >{user.description}</td>
                                    <td style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                                        {user.roles.map(role => (
                                            <div key={role.id} className="role-block">
                                                <span>{role.role}</span>
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Card>


        </div>
    ));
};

export default Admin;