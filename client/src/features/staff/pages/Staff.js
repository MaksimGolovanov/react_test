import React, { useEffect, useState, useMemo } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import StaffService from '../services/StaffService'; // Сервис для взаимодействия с данными
import './Staff.css'
import { BiDownload } from "react-icons/bi";
import { FaRegCopy } from "react-icons/fa";
import { LuFileEdit } from "react-icons/lu";
import { MdDeleteForever } from "react-icons/md";
import StaffEditModal from './StaffEditModal'; // Импорт созданного нами компонента модального окна
import StaffImportModal from './StaffImportModal';
import Spinner from 'react-bootstrap/Spinner';

import Circle from '../../../Components/circle/Circle';

function Staff() {
    const [staff, setStaff] = useState([]); // Список сотрудников
    const [filteredStaff, setFilteredStaff] = useState([]); // Фильтрованный список сотрудников
    const [searchQuery, setSearchQuery] = useState(''); // Текущий запрос поиска
    const [modalIsOpen, setModalIsOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const [selectedData, setSelectedData] = useState(''); // Данные строки, которую мы редактируем
    const [modalShow, setModalShow] = useState(false);
    const [sortConfig, setSortConfig] = useState(null)
    const [departmens, setDepatmens] = useState([])
    const [isLoading, setIsLoading] = useState(true); // Начальное состояние загрузки

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);


    };
    const closeModalImport = () => {
        setModalShow(false);

    };
    const handleEditClick = (data) => {
        setSelectedData(data); // Сохраняем данные текущей строки для редактирования
        openModal(); // Открываем модальное окно
    };


    useEffect(() => {
        async function departmensGet() {
            try {
                const departments = await StaffService.fetchDepartment()
                setDepatmens(departments)

            } catch (error) {
                console.error(error);
            }
        }
        departmensGet()
    }, [])

    const getDepartmentById = (id) => {
        const departmentCode = String(id).split(' ')[0]
        const foundDepartment = departmens.find(department => department.code === departmentCode);
        if (foundDepartment) {
            return foundDepartment.description;
        }

        return null; // Вернем null, если отдел не найден
    };

    const fetchData = async () => {
        try {
            const fetchedStaff = await StaffService.fetchStaff();
            setStaff(fetchedStaff);
            setFilteredStaff(fetchedStaff); // Изначально показываем весь список
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); // Завершаем загрузку
        }
    }

    useEffect(() => {

        fetchData();
    }, []);





    function handleSearchChange(event) {
        setSearchQuery(event.target.value);
    }

    useEffect(() => {
        if (!searchQuery) {
            setFilteredStaff(staff); // Если поисковой запрос пуст, показываем все сотрудники
        } else {
            const filteredList = staff.filter(member =>
                (member.fio && member.fio.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (member.login && member.login.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (member.post && member.post.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (member.telephone && member.telephone.includes(searchQuery)) || // Проверка на существование свойства
                (member.ip && member.ip.includes(searchQuery)) || // Проверка на существование свойства
                (member.tab_num && member.tab_num.includes(searchQuery)) // Проверка на существование свойства
            );
            setFilteredStaff(filteredList);
        }
    }, [searchQuery, staff]);

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                console.log("Текст скопирован в буфер обмена!");
            })
            .catch((err) => {
                console.error("Ошибка при копировании:", err);
            });
    }

    const requestSort = (key) => {
        let direction = 'ascending'; // Направление сортировки

        if (sortConfig?.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        setSortConfig({ key, direction });
    };

    // Применение сортировки к фильтрованным данным
    const sortedStaff = useMemo(() => {
        let sortedData = [...filteredStaff];

        if (sortConfig !== null) {
            sortedData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }

                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }

                return 0;
            });
        }

        return sortedData;
    }, [filteredStaff, sortConfig]);

    const handleDelete = async (id) => {
        try {
            await StaffService.deleteStaff(id)
            const updatedStaff = staff.filter(number => number.id !== id)
            setStaff(updatedStaff)
            setFilteredStaff(updatedStaff)
        } catch (error) {
            console.error(error)
        }
    }

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                
                height: '730px', // Высота экрана
                width: 'auto', // Ширина экрана
            }} className='text-dark'>
                <Spinner animation="border" role="status" style={{ width: '5rem', height: '5rem' }}>
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </div>
        );
    }

    return (

        <div>
            <div className='d-flex mb-2'>
                <Form.Control //строка поиска
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ width: '500px' }}
                />
                {}
                <Button className='button-next ml-2' onClick={() => setModalShow(true)}><BiDownload className={'icon-staff'} size={20} style={{ marginRight: '8px' }} />ИМПОРТ</Button>
            </div>

            <div style={{ maxHeight: '780px', overflowY: 'auto' }}>
                <Table striped bordered hover variant="white" className='table-staff'>
                    <thead className="fixed-header">
                        <tr>
                            <th style={{ width: '50px', backgroundColor: '#25292A', color: '#FA922F' }}></th>
                            <th style={{ width: '210px', backgroundColor: '#25292A', color: '#FA922F', cursor: 'pointer' }}
                                onClick={() => requestSort('fio')}
                            >
                                Фамилия Имя Отчество
                                {sortConfig?.key === 'fio' && (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                            </th>
                            <th style={{ width: '100px', backgroundColor: '#25292A', color: '#FA922F' }}>Логин</th>
                            <th style={{ width: '250px', backgroundColor: '#25292A', color: '#FA922F', cursor: 'pointer' }}
                                onClick={() => requestSort('post')}
                            >
                                Должность
                                {sortConfig?.key === 'post' && (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                            </th>
                            <th style={{ width: '250px', backgroundColor: '#25292A', color: '#FA922F', cursor: 'pointer' }}
                                onClick={() => requestSort('department')}
                            >
                                Служба
                                {sortConfig?.key === 'department' && (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                            </th>
                            <th style={{ width: '80px', backgroundColor: '#25292A', color: '#FA922F' }}>Телефон</th>
                            <th style={{ width: '220px', backgroundColor: '#25292A', color: '#FA922F' }}>Email</th>
                            <th style={{ width: '120px', backgroundColor: '#25292A', color: '#FA922F' }}>IP</th>
                            <th style={{ width: '120px', backgroundColor: '#25292A', color: '#FA922F' }}>Табельный номер</th>
                            <th style={{ width: '70px', backgroundColor: '#25292A', color: '#FA922F' }}></th>
                        </tr>
                    </thead>
                    <tbody className="left-aligned-table">
                        {sortedStaff.map(staffMember => (
                            <tr key={staffMember.id} className={staffMember.del == 1 ? 'table-danger' : undefined}>
                                <td>
                                    <div>
                                        <Circle initials={`${staffMember.fio.split(' ').map(name => name.charAt(0)).slice(0, 2).join('')}`} />
                                    </div>
                                </td>
                                <td>{staffMember.fio}</td>
                                <td>{staffMember.login}</td>
                                <td>{staffMember.post}</td>
                                <td>{getDepartmentById(staffMember.department)}</td>
                                <td>{staffMember.telephone}</td>
                                <td>{staffMember.email}</td>
                                <td>
                                    {staffMember.ip !== '' && staffMember.ip !== '-' ? (
                                        <>
                                            {staffMember.ip}
                                            <button className="copy-button" onClick={() => copyToClipboard(staffMember.ip)}>
                                                <FaRegCopy size={13} style={{ marginLeft: '8px' }} />
                                            </button>
                                        </>
                                    ) : null}
                                </td>
                                <td>{staffMember.tab_num}</td>
                                <td>
                                    <button className="edit-button" onClick={() => handleEditClick(staffMember)}><LuFileEdit size={20} /></button>
                                    <button className="delete-button" onClick={() => handleDelete(staffMember.id)}><MdDeleteForever size={24} style={{ marginLeft: '8px' }} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <StaffEditModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                fetchData={fetchData}
                selectedData={selectedData}
            />
            <StaffImportModal
                isOpen={modalShow}
                onRequestClose={closeModalImport}


            />



        </div>
    );
}

export default Staff;