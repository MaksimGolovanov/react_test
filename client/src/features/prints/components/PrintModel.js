import React, { useEffect, useState } from 'react';
import { Table, Button, Image, Modal, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import PrintsService from '../services/PrintsService';
import PrintModelCreateModal from './PrintModelCreateModal';

function PrintModel() {
    const [printsModels, setPrintsModels] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    const handleCreateClick = () => openModal();

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await PrintsService.fetchPrintModel();
            if (!Array.isArray(response)) throw new Error('Ответ сервера не является массивом');
            setPrintsModels(response);
        } catch (error) {
            console.error(error);
            alert('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = (id) => {
        Modal.confirm({
            title: 'Подтверждение удаления',
            content: 'Вы уверены, что хотите удалить эту модель?',
            okText: 'Да',
            cancelText: 'Нет',
            onOk: async () => {
                try {
                    await PrintsService.deletePrintModel(id);
                    fetchData();
                } catch (error) {
                    alert('Ошибка при удалении модели принтера');
                }
            },
        });
    };

    const columns = [
        {
            title: 'Модель принтера',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Тип картриджа',
            dataIndex: 'cartridge',
            key: 'cartridge',
        },
        {
            title: 'Формат печати максимальный',
            dataIndex: 'paper_size',
            key: 'paper_size',
        },
        {
            title: 'Сканирование цв/чб',
            dataIndex: 'scanner',
            key: 'scanner',
        },
        {
            title: 'Внешний вид',
            key: 'img1',
            render: (_, record) => (
                <Image
                    width={100}
                    height={100}
                    src={`${process.env.REACT_APP_API_URL}static/${record.img1}`}
                    preview={{ mask: false }}
                />
            ),
        },
        {
            title: 'Вид тонера/картриджа',
            key: 'img2',
            render: (_, record) => (
                <Image
                    width={151}
                    height={100}
                    src={`${process.env.REACT_APP_API_URL}static/${record.img2}`}
                    preview={{ mask: false }}
                />
            ),
        },
        {
            title: 'Вид блока',
            key: 'img3',
            render: (_, record) => (
                <Image
                    width={151}
                    height={100}
                    src={`${process.env.REACT_APP_API_URL}static/${record.img3}`}
                    preview={{ mask: false }}
                />
            ),
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => {/* добавить логику редактирования */}}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{ marginBottom: 16, textAlign: 'left' }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={handleCreateClick}
                >
                    Создать
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={printsModels}
                rowKey="id"
                loading={loading}
                bordered
                scroll={{ y: 760 }}
                pagination={false}
            />

            <PrintModelCreateModal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                onSuccess={fetchData}
            />
        </>
    );
}

export default PrintModel;