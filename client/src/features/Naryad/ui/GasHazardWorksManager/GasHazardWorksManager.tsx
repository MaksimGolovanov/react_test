// src/modules/Naryad/ui/GasHazardWorksManager/GasHazardWorksManager.tsx

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Table, Button, Modal, Form, Input, Select, message, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import orderStore from '../../store/OrderStore';

const { TextArea } = Input;

interface GasHazardWorksManagerProps {
    visible: boolean;
    onClose: () => void;
}

const GasHazardWorksManager: React.FC<GasHazardWorksManagerProps> = observer(({ visible, onClose }) => {
    const { gasHazardWorksStore } = orderStore;
    const [editingItem, setEditingItem] = useState<any>(null);
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            gasHazardWorksStore.loadAll(); // <-- исправлено
        }
    }, [visible]);

    const handleAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setModalVisible(true);
    };

    const handleEdit = (record: any) => {
        setEditingItem(record);
        form.setFieldsValue(record);
        setModalVisible(true);
    };

    const handleDelete = async (id: string) => {
        try {
            await gasHazardWorksStore.delete(id);
            message.success('Пункт удалён');
        } catch (error) {
            message.error('Ошибка удаления');
        }
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (editingItem) {
                await gasHazardWorksStore.update(editingItem.id, values);
                message.success('Пункт обновлён');
            } else {
                await gasHazardWorksStore.create(values);
                message.success('Пункт добавлен');
            }
            setModalVisible(false);
        } catch (error) {
            message.error('Ошибка сохранения');
        }
    };

    const columns = [
        { title: 'Код', dataIndex: 'code', key: 'code', width: 100 },
        { title: 'Служба', dataIndex: 'service', key: 'service', width: 120 },
        { title: 'Описание работ', dataIndex: 'description', key: 'description', ellipsis: true },
        { title: 'Без наряда', dataIndex: 'withoutPermit', key: 'withoutPermit', render: (val: boolean) => val ? 'Да' : 'Нет' },
        {
            title: 'Действия',
            key: 'actions',
            width: 150,
            render: (_: any, record: any) => (
                <Space>
                    <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Удалить пункт?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Да"
                        cancelText="Нет"
                    >
                        <Button icon={<DeleteOutlined />} size="small" danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <>
            <Modal
                title="Справочник Перечня ГОР"
                open={visible}
                onCancel={onClose}
                footer={null}
                width="90%"
                style={{ maxWidth: 1200 }}
            >
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
                    Добавить пункт
                </Button>
                <Table
                    dataSource={gasHazardWorksStore.items}
                    columns={columns}
                    rowKey="id"
                    loading={gasHazardWorksStore.isLoading}
                    pagination={{ pageSize: 10 }}
                />
            </Modal>

            <Modal
                title={editingItem ? 'Редактировать пункт' : 'Добавить пункт'}
                open={modalVisible}
                onOk={handleSubmit}
                onCancel={() => setModalVisible(false)}
                width={800}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="code" label="Код" rules={[{ required: true, message: 'Введите код' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="service" label="Служба" rules={[{ required: true, message: 'Выберите службу' }]}>
                        <Select>
                            <Select.Option value="ЛЭС">ЛЭС</Select.Option>
                            <Select.Option value="КС">КС</Select.Option>
                            <Select.Option value="СЗК">СЗК</Select.Option>
                            <Select.Option value="АСУ, А и ТМ">АСУ, А и ТМ</Select.Option>
                            <Select.Option value="ВЦТС УС">ВЦТС УС</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item name="description" label="Описание работ" rules={[{ required: true, message: 'Введите описание' }]}>
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="dangerFactors" label="Опасные факторы">
                        <TextArea rows={3} />
                    </Form.Item>
                    <Form.Item name="executorCategory" label="Категория исполнителей">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="preparationMeasures" label="Мероприятия по подготовке">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="safetyMeasures" label="Мероприятия по безопасному проведению">
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item name="appendices" label="Приложения">
                        <TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="withoutPermit" label="Без наряда-допуска" valuePropName="checked">
                        <Select>
                            <Select.Option value={false}>С нарядом</Select.Option>
                            <Select.Option value={true}>Без наряда (журнал)</Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
});

export default GasHazardWorksManager;