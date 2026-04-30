import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, message } from 'antd';
import { SaveOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import PrintsService from '../services/PrintsService';

export default function PrintCreateModal({ isOpen, onRequestClose, onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState({
    externalView: [],
    cartridgeView: [],
    blockView: [],
  });

  // Сброс формы и файлов при закрытии
  useEffect(() => {
    if (!isOpen) {
      form.resetFields();
      setFileList({
        externalView: [],
        cartridgeView: [],
        blockView: [],
      });
    }
  }, [isOpen, form]);

  const handleFileChange = (field, info) => {
    const newFileList = info.fileList.slice(-1); // максимум 1 файл
    setFileList(prev => ({ ...prev, [field]: newFileList }));
  };

  const handleSubmit = async (values) => {
    const { model, cartridge, paperFormat, scannerType } = values;
    const externalFile = fileList.externalView[0]?.originFileObj;
    const cartridgeFile = fileList.cartridgeView[0]?.originFileObj;
    const blockFile = fileList.blockView[0]?.originFileObj;

    if (!model || !cartridge || !paperFormat || !scannerType) {
      message.error('Заполните все обязательные поля');
      return;
    }
    if (!externalFile || !cartridgeFile || !blockFile) {
      message.error('Загрузите все необходимые изображения');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', model);
      formData.append('cartridge', cartridge);
      formData.append('paper_size', paperFormat);
      formData.append('scanner', scannerType);
      formData.append('img1', externalFile);
      formData.append('img2', cartridgeFile);
      formData.append('img3', blockFile);

      await PrintsService.createPrintModel(formData);
      message.success('Модель принтера успешно создана');
      onSuccess?.();
      onRequestClose();
    } catch (error) {
      console.error('Ошибка при создании модели принтера:', error);
      message.error('Произошла ошибка при создании модели принтера');
    } finally {
      setLoading(false);
    }
  };

  // Поля формы с метками и именами
  const formFields = [
    { name: 'model', label: 'Модель принтера', placeholder: 'Модель принтера', required: true },
    { name: 'cartridge', label: 'Тип картриджа/тонера', placeholder: 'Тип картриджа/тонера', required: true },
    { name: 'paperFormat', label: 'Максимальный формат печати', placeholder: 'Максимальный формат печати', required: true },
    { name: 'scannerType', label: 'Сканирование чб/цв', placeholder: 'Сканирование чб/цв', required: true },
  ];

  // Блоки загрузки файлов
  const uploadFields = [
    { field: 'externalView', label: 'Внешний вид' },
    { field: 'cartridgeView', label: 'Вид тонера/картриджа' },
    { field: 'blockView', label: 'Вид блока' },
  ];

  return (
    <Modal
      title="Добавление модели принтера"
      open={isOpen}
      onCancel={onRequestClose}
      footer={null}
      width={560}
      closeIcon={<CloseOutlined />}
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="middle">
        {formFields.map(({ name, label, placeholder, required }) => (
          <Form.Item
            key={name}
            name={name}
            label={label}
            rules={required ? [{ required: true, message: `Введите ${label.toLowerCase()}` }] : []}
          >
            <Input placeholder={placeholder} />
          </Form.Item>
        ))}

        {uploadFields.map(({ field, label }) => (
          <Form.Item key={field} label={label} required>
            <Upload
              listType="picture"
              maxCount={1}
              beforeUpload={() => false}
              fileList={fileList[field]}
              onChange={(info) => handleFileChange(field, info)}
              accept="image/*"
            >
              <Button icon={<PlusOutlined />} size="small">Загрузить</Button>
            </Upload>
            {fileList[field].length === 0 && (
              <div style={{ marginTop: 4, color: '#ff4d4f', fontSize: 12 }}>Обязательное поле</div>
            )}
          </Form.Item>
        ))}

        <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading}>
            СОХРАНИТЬ
          </Button>
          <Button onClick={onRequestClose} style={{ marginLeft: 8 }}>Отмена</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}