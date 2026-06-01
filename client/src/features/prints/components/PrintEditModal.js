import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Row, Col } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import PrintsService from '../services/PrintsService';

export default function PrintEditModal({ isOpen, onRequestClose, onSuccess, PrintsId }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [printModels, setPrintModels] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            Promise.all([
                PrintsService.fetchPrintModel(),
                PrintsService.fetchDepartmens(),
                PrintsService.fetchLocation(),
                PrintsService.fetchPrint(PrintsId)
            ]).then(([models, depts, locs, print]) => {
                setPrintModels(models);
                setDepartments(depts);
                setLocations(locs);
                form.setFieldsValue({
                    model_id: print.print_model,
                    logical_name: print.logical_name,
                    ip: print.ip,
                    url: print.url,
                    department: print.department,
                    location: print.location,
                    serial_number: print.serial_number,
                    description: print.description,
                    status: print.status,
                });
                setInitialLoading(false);
            }).catch(err => {
                console.error(err);
                message.error('Ошибка загрузки данных');
                setInitialLoading(false);
            });
        }
    }, [isOpen, PrintsId, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await PrintsService.updatePrint({
                id: PrintsId,
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
            message.success('Принтер обновлён');
            onSuccess?.();
            onRequestClose();
        } catch (error) {
            console.error('Ошибка:', error);
            message.error('Ошибка при обновлении');
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
            title="Редактирование принтера"
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            width={600}
            closeIcon={<CloseOutlined />}
            confirmLoading={initialLoading}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item name="model_id" label="Модель принтера" rules={[{ required: true }]}>
                    <Select placeholder="Выберите модель" allowClear>
                        {printModels.map(model => (
                            <Select.Option key={model.id} value={model.id}>{model.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="logical_name" label="Логическое имя">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="ip" label="IP-адрес" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="url" label="URL">
                            <Select allowClear>
                                <Select.Option value="http://">http://</Select.Option>
                                <Select.Option value="https://">https://</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="department" label="Отдел" rules={[{ required: true }]}>
                            <Select allowClear>
                                {departments.map(dept => (
                                    <Select.Option key={dept.id} value={dept.short_name}>{dept.short_name}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="location" label="Расположение">
                            <Select allowClear>
                                {locations.map(loc => (
                                    <Select.Option key={loc.id} value={loc.location}>{loc.location}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="status" label="Статус" rules={[{ required: true }]}>
                            <Select>
                                <Select.Option value={1}>В работе</Select.Option>
                                <Select.Option value={0}>В ремонте</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="serial_number" label="Серийный номер">
                    <Input />
                </Form.Item>

                <Form.Item name="description" label="Примечание">
                    <Input.TextArea rows={3} />
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