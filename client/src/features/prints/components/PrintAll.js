import React, { useState, useEffect, useCallback } from 'react';
import PrintsService from '../services/PrintsService';
import { Col, Image, Row, Table, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { IoIosCreate } from "react-icons/io";
import PrintCreateModal from './PrintCreateModal';

import PrintEditModal from './PrintEditModal';
import { RiFileEditLine } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import { FaFirefoxBrowser } from "react-icons/fa6";
import PrintChart from './PrintChart';



function PrintAll() {

    const [prints, setPrints] = useState([]);
    const [printModels, setPrintModels] = useState([]);
    const [printsEdit, setPrintsEdit] = useState([]);
    const [selectedPrint, setSelectedPrint] = useState(null); // Состояние для хранения выбранной строки
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // Текущий запрос поиска
    const [filteredStaff, setFilteredStaff] = useState([]); // Фильтрованный список сотрудников

    const openModal = useCallback(() => {
        if (!modalIsOpen) {
            setModalIsOpen(true);
        }
    }, [modalIsOpen]);

    const closeModal = useCallback(() => {
        setModalIsOpen(false);

    }, []);

    const handleCreateClick = useCallback(() => {
        openModal();
    }, [openModal]);

    const openModalEdit = useCallback(() => {
        if (!modalIsOpenEdit) {
            setModalIsOpenEdit(true);
        }
    }, [modalIsOpenEdit]);

    const closeModalEdit = useCallback(() => {
        setModalIsOpenEdit(false);

    }, []);

    const handleCreateClickEdit = useCallback((id) => {
        setPrintsEdit(id)
        openModalEdit();
    }, [openModalEdit]);

    //получение всех принтеров из таблицы(модель) Prints
    const fetchPrints = async () => {
        try {
            const response = await PrintsService.fetchPrints();
            setPrints(response);
        } catch (error) {
            console.error('Ошибка при загрузке принтеров:', error);
        }
    };

    //получение всех моделей принтеров из таблицы(модель) PrintsModel
    const fetchPrintModels = async () => {
        try {
            const response = await PrintsService.fetchPrintModel(); // Добавлены скобки для вызова функции
            setPrintModels(response);
        } catch (error) {
            console.error('Ошибка при загрузке моделей принтеров:', error);
        }
    };

    // Функция поиска информации о модели по ее ID
    const getModelInfoById = (modelId) => {
        const foundModel = printModels.find(model => model.id === Number(modelId));

        if (!foundModel) {
            return null; // Или вернуть объект с пустыми значениями, если требуется
        }
        return foundModel;
    };

    // Обработчик клика на строку таблицы
    const handleRowClick = (print) => {
        setSelectedPrint(print);

    };

    useEffect(() => {
        fetchPrints();
        fetchPrintModels();
    }, []);

    const deletePrint = useCallback(async (id) => {
        try {
            await PrintsService.deletePrint(id);
            const updatedPrints = prints.filter((print) => print.id !== id);
            setPrints(updatedPrints);
        } catch (error) {
            console.error('Ошибка при удалении локации:', error);
        }
    }, [prints]);

    function handleSearchChange(event) {
        setSearchQuery(event.target.value);
    }
    useEffect(() => {
        if (!searchQuery) {
            setFilteredStaff(prints); // Если поисковой запрос пуст, показываем все сотрудники
        } else {
            const filteredList = prints.filter(member =>
                (member.department && member.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (member.location && member.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (member.ip && member.ip.toLowerCase().includes(searchQuery.toLowerCase()))

            );
            setFilteredStaff(filteredList);
        }
    }, [searchQuery, prints]);


    return (
        <div >

            <Row>
                <Col xs={4}>
                    <div className='d-flex mb-2'>
                        <Form.Control
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{ width: '500px' }}
                        />

                    </div>
                    <Table style={{ width: '500px' }} striped bordered hover className='table-prints'>
                        <thead>
                            <tr>
                                <th>Статус</th>
                                <th>Отдел</th>
                                <th>Расположение</th>
                                <th>Принтер</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStaff.map((print) => {
                                const modelInfo = getModelInfoById(print.print_model);
                                return (
                                    <tr key={print.id} onClick={() => handleRowClick(print)}

                                        className={

                                            selectedPrint && selectedPrint.id === print.id ? 'table-success' : ''
                                        }
                                    >
                                        <td>
                                            {/* Отображение зеленого или красного круга */}
                                            {print.status === 1 ? (
                                                <span className="green-circle"></span>
                                            ) : (
                                                <span className="red-circle"></span>
                                            )}
                                        </td>
                                        <td>{print.department}</td>
                                        <td>{print.location}</td>
                                        <td>{modelInfo?.name || 'Не найдено'}</td>
                                        <td>
                                            <button className="edit-button"><RiFileEditLine size={20} onClick={() => handleCreateClickEdit(print.id)} /></button>
                                            <button className="delete-button"><MdDeleteForever size={24} style={{ marginLeft: '8px' }} onClick={() => deletePrint(print.id)} /></button>
                                        </td>
                                    </tr>
                                ); // Важно добавить возврат элемента!
                            })}

                        </tbody>
                    </Table>

                </Col>
                <Col xs={8}>
                    <Button
                        className='button-next float-end ms-auto'
                        onClick={handleCreateClick}
                    >
                        <IoIosCreate className={'icon-staff'} size={20} style={{ marginRight: '8px' }} />
                        Создать
                    </Button>
                    {selectedPrint && (
                        <div>
                            <Row className='mt-5'>
                                <Col>
                                    <h3 style={{ textAlign: 'center' }}>
                                        {getModelInfoById(selectedPrint.print_model)?.name || 'Выберите принтер'}
                                    </h3>
                                    <Row>
                                        <Col>
                                            <Image
                                                src={getModelInfoById(selectedPrint.print_model)?.img1 ? `http://localhost:5000/${getModelInfoById(selectedPrint.print_model)?.img1}` : null}
                                                style={{ width: '245px', height: '245px', objectFit: 'cover' }}
                                                alt="Внешний вид принтера"
                                            />
                                        </Col>
                                        <Col>
                                            <Image
                                                src={getModelInfoById(selectedPrint.print_model)?.img2 ? `http://localhost:5000/${getModelInfoById(selectedPrint.print_model)?.img2}` : null}
                                                style={{ width: '164px', height: '113px', objectFit: 'cover' }}
                                                alt="Картридж"
                                            />
                                            <Image
                                                src={getModelInfoById(selectedPrint.print_model)?.img3 ? `http://localhost:5000/${getModelInfoById(selectedPrint.print_model)?.img3}` : null}
                                                style={{ width: '164px', height: '113px', objectFit: 'cover', marginTop: '19px' }}
                                                alt="Блок"
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        <Col className='leftProperty'>
                                            <p>МОДЕЛЬ:</p>
                                            <p>ЛОГИЧЕСКОЕ ИМЯ:</p>
                                            <p>КАРТРИДЖ:</p>
                                            <p>ФОРМАТ:</p>
                                            <p>ТИП СКАНЕРА:</p>
                                            <p>ОТДЕЛ:</p>
                                            <p>МЕСТО РАСПОЛОЖЕНИЯ:</p>
                                            <p>IP:</p>
                                            <p>URL:</p>
                                            <p>СЕРИЙНЫЙ №</p>
                                        </Col>
                                        <Col className='rightProperty'>
                                            <p>{getModelInfoById(selectedPrint.print_model)?.name || '-'}</p>
                                            <p>{selectedPrint?.logical_name || '-'}</p>
                                            <p>{getModelInfoById(selectedPrint.print_model)?.cartridge || '-'}</p>
                                            <p>{getModelInfoById(selectedPrint.print_model)?.paper_size || '-'}</p>
                                            <p>{getModelInfoById(selectedPrint.print_model)?.scanner || '-'}</p>
                                            <p>{selectedPrint?.department || '-'}</p>
                                            <p>{selectedPrint?.location || '-'}</p>
                                            <p>{selectedPrint?.ip || '-'}</p>
                                            <p>{selectedPrint?.url || '-'}</p>
                                            <p>{selectedPrint?.serial_number || '-'}</p>
                                        </Col>
                                    </Row>
                                    <Button className='button-next' style={{width:'400px'}} href={`${selectedPrint.url}${selectedPrint.ip}`} target="_blank" rel="noopener noreferrer">
                                    <FaFirefoxBrowser className={'icon-staff'} size={20} style={{ marginRight: '8px' }}/>
                                        Перейти по адресу
                                    </Button>
                                </Col>

                            </Row>

                            <Row>

                                {selectedPrint?.serial_number && <PrintChart itemid={selectedPrint.serial_number} />}
                            </Row>
                        </div>
                    )}
                </Col>
            </Row>
            <PrintCreateModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                onSuccess={fetchPrints}


            />
            <PrintEditModal
                isOpen={modalIsOpenEdit}
                onRequestClose={closeModalEdit}
                onSuccess={fetchPrints}
                PrintsId={printsEdit}

            />


        </div>
    )
}

export default PrintAll
