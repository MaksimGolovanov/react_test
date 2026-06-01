import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import PrintsService from '../services/PrintsService';

export default function PrintCreateModal({ isOpen, onRequestClose, onSuccess }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [printModels, setPrintModels] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        if (isOpen) {
            fetchPrintModels();
            fetchDepartments();
            fetchLocations();
        }
    }, [isOpen]);

    const fetchPrintModels = async () => {
        try {
            const models = await PrintsService.fetchPrintModel();
            setPrintModels(models);
        } catch (error) {
            console.error('Ошибка загрузки моделей:', error);
        }
    };
    const fetchDepartments = async () => {
        try {
            const depts = await PrintsService.fetchDepartmens();
            setDepartments(depts);
        } catch (error) {
            console.error('Ошибка загрузки отделов:', error);
        }
    };
    const fetchLocations = async () => {
        try {
            const locs = await PrintsService.fetchLocation();
            setLocations(locs);
        } catch (error) {
            console.error('Ошибка загрузки локаций:', error);
        }
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await PrintsService.createPrint({
                print_model: parseInt(values.model_id),
                logical_name: values.logical_name,
                ip: values.ip,
                url: values.url,
                department: values.department,
                location: values.location,
                serial_number: values.serial_number,
                description: values.description,
                status: values.status,
            });
            message.success('Принтер успешно добавлен');
            onSuccess?.();
            onRequestClose();
            form.resetFields();
        } catch (error) {
            console.error('Ошибка:', error);
            message.error('Ошибка при создании принтера');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onRequestClose();
    };

    return (
        <Modal
            title="Добавление принтера"
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            width={600}
            closeIcon={<CloseOutlined />}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="model_id"
                    label="Модель принтера"
                    rules={[{ required: true, message: 'Выберите модель' }]}
                >
                    <Select placeholder="Выберите модель" allowClear>
                        {printModels.sort((a,b) => a.name.localeCompare(b.name)).map(model => (
                            <Select.Option key={model.id} value={model.id}>{model.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="logical_name" label="Логическое имя">
                            <Input placeholder="Логическое имя" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="ip" label="IP-адрес" rules={[{ required: true, message: 'Введите IP' }]}>
                            <Input placeholder="192.168.1.1" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="url" label="URL">
                            <Select placeholder="Выберите протокол" allowClear>
                                <Select.Option value="http://">http://</Select.Option>
                                <Select.Option value="https://">https://</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="department" label="Отдел" rules={[{ required: true, message: 'Выберите отдел' }]}>
                            <Select placeholder="Выберите отдел" allowClear>
                                {departments.sort((a,b) => a.short_name.localeCompare(b.short_name)).map(dept => (
                                    <Select.Option key={dept.id} value={dept.short_name}>{dept.short_name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="location" label="Расположение">
                            <Select placeholder="Выберите расположение" allowClear>
                                {locations.sort((a,b) => a.location.localeCompare(b.location)).map(loc => (
                                    <Select.Option key={loc.id} value={loc.location}>{loc.location}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="status" label="Статус" rules={[{ required: true }]}>
                            <Select placeholder="Выберите статус">
                                <Select.Option value={1}>В работе</Select.Option>
                                <Select.Option value={0}>В ремонте</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="serial_number" label="Серийный номер">
                    <Input placeholder="Серийный номер" />
                </Form.Item>

                <Form.Item name="description" label="Примечание">
                    <Input.TextArea rows={3} placeholder="Примечание" />
                </Form.Item>

                <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                    <Button onClick={handleCancel} style={{ marginRight: 8 }}>Отмена</Button>
                    <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
                        Сохранить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}