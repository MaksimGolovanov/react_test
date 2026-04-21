import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { SaveOutlined, CloseOutlined } from '@ant-design/icons';
import PrintsService from '../services/PrintsService';

const PrintEditLocationModal = ({ isOpen, onRequestClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Сброс формы при открытии/закрытии
    useEffect(() => {
        if (!isOpen) {
            form.resetFields();
        }
    }, [isOpen, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            await PrintsService.createLocation(values);
            message.success('Здание успешно добавлено');
            onRequestClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Ошибка создания локации:', error);
            message.error('Ошибка при создании здания');
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
            title="Добавление здания"
            open={isOpen}
            onCancel={handleCancel}
            footer={null}
            width={500}
            closable={false}
            maskClosable={false}
            style={{ top: 20 }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                autoComplete="off"
            >
                <Form.Item
                    name="location"
                    label="Расположение"
                    rules={[
                        { required: true, message: 'Пожалуйста, введите место расположения' },
                        { min: 2, message: 'Название должно содержать не менее 2 символов' }
                    ]}
                >
                    <Input placeholder="Введите место расположения" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Button onClick={handleCancel} style={{ marginRight: 8 }}>
                        <CloseOutlined /> Отмена
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        <SaveOutlined /> Сохранить
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default PrintEditLocationModal;