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
import '../pages/Prints.css';

function PrintAll() {
    const [prints, setPrints] = useState([]);
    const [printModels, setPrintModels] = useState([]);
    const [printsEdit, setPrintsEdit] = useState([]);
    const [selectedPrint, setSelectedPrint] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpenEdit, setModalIsOpenEdit] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPrints, setFilteredPrints] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    // Базовый URL из переменных окружения
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

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
        setPrintsEdit(id);
        openModalEdit();
    }, [openModalEdit]);

    const fetchPrints = async () => {
        try {
            const response = await PrintsService.fetchPrints();
            setPrints(response);
            setFilteredPrints(response);
        } catch (error) {
            console.error('Ошибка при загрузке принтеров:', error);
        }
    };

    const fetchPrintModels = async () => {
        try {
            const response = await PrintsService.fetchPrintModel();
            setPrintModels(response);
        } catch (error) {
            console.error('Ошибка при загрузке моделей принтеров:', error);
        }
    };

    const getModelInfoById = (modelId) => {
        const foundModel = printModels.find(model => model.id === Number(modelId));
        return foundModel || null;
    };

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
            setFilteredPrints(updatedPrints);
        } catch (error) {
            console.error('Ошибка при удалении локации:', error);
        }
    }, [prints]);

    function handleSearchChange(event) {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        
        if (!query) {
            setFilteredPrints(prints);
            return;
        }

        const filtered = prints.filter(print => {
            const modelInfo = getModelInfoById(print.print_model);
            return (
                (print.department && print.department.toLowerCase().includes(query)) ||
                (print.location && print.location.toLowerCase().includes(query)) ||
                (print.ip && print.ip.toLowerCase().includes(query)) ||
                (print.logical_name && print.logical_name.toLowerCase().includes(query)) ||
                (print.serial_number && print.serial_number.toLowerCase().includes(query)) ||
                (print.url && print.url.toLowerCase().includes(query)) ||
                (modelInfo?.name && modelInfo.name.toLowerCase().includes(query)) ||
                (modelInfo?.cartridge && modelInfo.cartridge.toLowerCase().includes(query))
            );
        });
        
        setFilteredPrints(filtered);
    }

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedPrints = () => {
        if (!sortConfig.key) return filteredPrints;

        return [...filteredPrints].sort((a, b) => {
            // Для сортировки по модели принтера
            if (sortConfig.key === 'print_model') {
                const modelA = getModelInfoById(a.print_model)?.name || '';
                const modelB = getModelInfoById(b.print_model)?.name || '';
                
                if (modelA < modelB) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (modelA > modelB) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            }

            // Для обычных полей
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    const sortedPrints = getSortedPrints();

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <div>
            <Row>
                <Col xs={4}>
                    <div className='d-flex mb-2'>
                        <Form.Control
                            type="text"
                            placeholder="Поиск по всем полям..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            style={{ width: '500px' }}
                        />
                    </div>
                    <Table striped bordered hover className='table-prints'>
                        <thead>
                            <tr>
                                <th onClick={() => requestSort('status')}>
                                    Статус{getSortIndicator('status')}
                                </th>
                                <th onClick={() => requestSort('department')}>
                                    Отдел{getSortIndicator('department')}
                                </th>
                                <th onClick={() => requestSort('location')}>
                                    Расположение{getSortIndicator('location')}
                                </th>
                                <th onClick={() => requestSort('print_model')}>
                                    Принтер{getSortIndicator('print_model')}
                                </th>
                                <th onClick={() => requestSort('description')}>
                                    Примечание{getSortIndicator('description')}
                                </th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPrints.map((print) => {
                                const modelInfo = getModelInfoById(print.print_model);
                                return (
                                    <tr key={print.id} onClick={() => handleRowClick(print)}
                                        className={
                                            selectedPrint && selectedPrint.id === print.id ? 'table-success' : ''
                                        }
                                    >
                                        <td>
                                            {print.status === 1 ? (
                                                <span className="green-circle"></span>
                                            ) : (
                                                <span className="red-circle"></span>
                                            )}
                                        </td>
                                        <td>{print.department}</td>
                                        <td>{print.location}</td>
                                        
                                        <td>{modelInfo?.name || 'Не найдено'}</td>
                                        <td>{print.description}</td>
                                        <td>
                                            <button className="edit-button">
                                                <RiFileEditLine size={20} onClick={() => handleCreateClickEdit(print.id)} />
                                            </button>
                                            <button className="delete-button">
                                                <MdDeleteForever size={24} style={{ marginLeft: '8px' }} onClick={() => deletePrint(print.id)} />
                                            </button>
                                        </td>
                                    </tr>
                                );
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
                                                src={getModelInfoById(selectedPrint.print_model)?.img1 ? `${API_BASE_URL}static/${getModelInfoById(selectedPrint.print_model)?.img1}` : null}
                                                style={{ width: '245px', height: '245px', objectFit: 'cover' }}
                                                alt="Внешний вид принтера"
                                            />
                                        </Col>
                                        <Col>
                                            <Image
                                                src={getModelInfoById(selectedPrint.print_model)?.img2 ? `${API_BASE_URL}static/${getModelInfoById(selectedPrint.print_model)?.img2}` : null}
                                                style={{ width: '164px', height: '113px', objectFit: 'cover' }}
                                                alt="Картридж"
                                            />
                                            <Image
                                                src={getModelInfoById(selectedPrint.print_model)?.img3 ? `${API_BASE_URL}static/${getModelInfoById(selectedPrint.print_model)?.img3}` : null}
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
                                    <Button 
                                        className='button-next' 
                                        style={{width: '400px'}} 
                                        href={`${selectedPrint.url}${selectedPrint.ip}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                    >
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

export default PrintAll;