// shared/ui/FormModal/FormModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, message } from 'antd';

export interface FormField {
    name: string;
    label: string;
    type?: 'text' | 'textarea' | 'select';
    options?: { label: string; value: string }[];
    required?: boolean;
    rules?: any[];
    placeholder?: string;
}

export interface FormModalProps<T> {   // <-- добавлен export
    visible: boolean;
    title: string;
    initialValues?: Partial<T>;
    fields: FormField[];
    onSubmit: (values: T) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

export function FormModal<T extends Record<string, any>>({
    visible,
    title,
    initialValues,
    fields,
    onSubmit,
    onCancel,
    loading = false,
}: FormModalProps<T>) {
    const [form] = Form.useForm<T>();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue(initialValues);
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await onSubmit(values);
            form.resetFields();
        } catch (error) {
            message.error('Ошибка при сохранении');
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={title}
            open={visible}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={loading}
            destroyOnClose
            width={600}
        >
            <Form form={form} layout="vertical">
                {fields.map((field) => (
                    <Form.Item
                        key={field.name}
                        name={field.name}
                        label={field.label}
                        rules={
                            field.rules ||
                            (field.required ? [{ required: true, message: `Введите ${field.label.toLowerCase()}` }] : [])
                        }
                    >
                        {field.type === 'textarea' ? (
                            <Input.TextArea rows={3} placeholder={field.placeholder} />
                        ) : field.type === 'select' ? (
                            <Select placeholder={field.placeholder} allowClear>
                                {field.options?.map((opt) => (
                                    <Select.Option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        ) : (
                            <Input placeholder={field.placeholder} />
                        )}
                    </Form.Item>
                ))}
            </Form>
        </Modal>
    );
}