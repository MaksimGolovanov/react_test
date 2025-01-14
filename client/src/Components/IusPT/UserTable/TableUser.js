// UserTable.js
import React from 'react';
import { Table } from 'react-bootstrap';

const UserTable = ({ users }) => {
    return (
        <div className="table-container">
            <Table striped bordered hover className="table-fixed" style={{ fontSize: '12px', width: '100%', tableLayout: 'fixed'  }}>
                <thead>
                    <tr>
                        <th style={{width:'16%'}}>ФИО</th>
                        <th style={{width:'16%'}}>Имя для входа</th>
                        <th style={{width:'16%'}}>Email</th>
                        <th style={{width:'16%'}}>Должность</th>
                        <th style={{width:'16%'}}>Служба</th>
                        <th style={{width:'16%'}}>Табельный №</th>
                        <th style={{width:'16%'}}>Статус</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.fio}</td>
                            <td></td>
                            <td>{user.email}</td>
                            <td>{user.post}</td>
                            <td>{user.department.slice(13)}</td>
                            <td>{user.tab_num}</td>
                            <td>Активен</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default UserTable;