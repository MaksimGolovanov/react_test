import React, { useEffect, useState, useMemo } from 'react';

import StaffService from '../services/StaffService'; // Сервис для взаимодействия с данными
import './Staff.css'
import { BiDownload } from "react-icons/bi";
import { FaRegCopy } from "react-icons/fa";
import { RiFileEditLine } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import StaffEditModal from './StaffEditModal'; // Импорт созданного нами компонента модального окна
import StaffImportModal from './StaffImportModal';
import Spinner from 'react-bootstrap/Spinner';
import ButtonAll from '../../ius-pt/components/ButtonAll/ButtonAll';
import Circle from '../../../Components/circle/Circle';
import SearchInput from '../../ius-pt/components/SearchInput/SearchInput';
import styles from './style.module.css';

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
                (member.tabNumber && member.tabNumber.includes(searchQuery)) // Проверка на существование свойства
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
            <ButtonAll text="Импорт" icon={BiDownload} onClick={() => setModalShow(true)} />
            <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Поиск пользователей..."
            />


            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead className={styles.headTable}>
                        <tr>
                            <th style={{ width: '45px' }}></th>
                            <th
                                onClick={() => requestSort('fio')}
                            >
                                Фамилия Имя Отчество
                                {sortConfig?.key === 'fio' && (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                            </th>
                            <th style={{ width: '120px' }}>Логин</th>
                            <th
                                onClick={() => requestSort('post')}
                            >
                                Должность
                                {sortConfig?.key === 'post' && (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                            </th>
                            <th
                                onClick={() => requestSort('department')}
                            >
                                Служба
                                {sortConfig?.key === 'department' && (sortConfig.direction === 'ascending' ? ' ↑' : ' ↓')}
                            </th>
                            <th style={{ width: '80px' }}>Телефон</th>
                            <th >Email</th>
                            <th style={{ width: '120px' }}>IP</th>
                            <th style={{ width: '90px' }}>Табельный номер</th>
                            <th style={{ width: '80px' }}></th>
                        </tr>
                    </thead>
                    <tbody className={styles.bodyTable}>
                        {sortedStaff.map(staffMember => (
                            <tr key={staffMember.id} className={staffMember.del == 1 ? 'table-danger' : undefined}>
                                <td>
                                    <div>
                                        <Circle fullName={staffMember.fio} size={30} />
                                    </div>
                                </td>
                                <td >{staffMember.fio}</td>
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
                                <td>{staffMember.tabNumber}</td>
                                <td>
                                    <button className="edit-button" onClick={() => handleEditClick(staffMember)}><RiFileEditLine size={20} /></button>
                                    <button className="delete-button" onClick={() => handleDelete(staffMember.id)}><MdDeleteForever size={24} style={{ marginLeft: '8px' }} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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