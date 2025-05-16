import React, { useEffect, useState } from 'react';
import { Image, Table } from 'react-bootstrap';
import PrintsService from '../services/PrintsService';
import { RiFileEditLine } from "react-icons/ri";
import { MdDeleteForever } from "react-icons/md";
import Button from 'react-bootstrap/Button';
import { IoIosCreate } from "react-icons/io";
import PrintModelCreateModal from './PrintModelCreateModal'

function PrintModel() {
    const [printsModels, setPrintsModels] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false); // Состояние для открытия/закрытия модального окна


    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const handleCreateClick = () => {
        openModal(); // Открываем модальное окно
    };

    const fetchData = async () => {
        try {
            const response = await PrintsService.fetchPrintModel(); // Добавлены скобки для вызова функции
            if (!Array.isArray(response)) throw new Error('Ответ сервера не является массивом');

            setPrintsModels(response);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Если fetchData зависит от других состояний, добавьте их сюда

    const handleDelete = async (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту модель?')) {
            try {
                await PrintsService.deletePrintModel(id);
                fetchData(); // Обновляем список после удаления
            } catch (error) {
                alert('Ошибка при удалении модели принтера');
            }
        }
    };

    return (
        <>
            <div style={{ maxHeight: '760px', overflowY: 'auto' }}>
                <Button className='button-next float-end ms-auto mb-1' onClick={() => handleCreateClick()} ><IoIosCreate className={'icon-staff'} size={20} style={{ marginRight: '8px' }} />Создать</Button>

                <Table striped bordered hover className='text-center' >
                    <thead>
                        <tr>
                            <th>Модель принтера</th>
                            <th>Тип картриджа</th>
                            <th>Формат печати максимальный</th>
                            <th>Сканирование цв/чб</th>
                            <th>Внешний вид</th>
                            <th>Вид тонера/картриджа</th>
                            <th>Вид блока</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            printsModels.map((printModel) => (
                                <tr key={printModel.id} >
                                    <td>{printModel.name}</td>
                                    <td>{printModel.cartridge}</td>
                                    <td>{printModel.paper_size}</td>
                                    <td>{printModel.scanner}</td>
                                    <td ><Image width={100} height={100} src={`${process.env.REACT_APP_API_URL}${printModel.img1}`}></Image></td>
                                    <td><Image width={151} height={100} src={`${process.env.REACT_APP_API_URL}${printModel.img2}`}></Image></td>
                                    <td><Image width={151} height={100} src={`${process.env.REACT_APP_API_URL}${printModel.img3}`}></Image></td>
                                    <td>
                                        <button className="edit-button"><RiFileEditLine size={20} /></button>
                                        <button className="delete-button" onClick={() => handleDelete(printModel.id)} ><MdDeleteForever size={24} style={{ marginLeft: '8px' }} /></button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </div>
            <PrintModelCreateModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                onSuccess={fetchData}
            />
        </>
    );
}

export default PrintModel;