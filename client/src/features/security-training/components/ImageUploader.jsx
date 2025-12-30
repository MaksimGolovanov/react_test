// src/features/security-training/components/ImageUploader.jsx
import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const ImageUploader = ({ onImageUploaded }) => {
  const [uploading, setUploading] = useState(false);

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Можно загружать только изображения!');
    }
    
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Изображение должно быть меньше 5MB!');
    }
    
    return isImage && isLt5M;
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      setUploading(false);
      // В реальном приложении - URL от сервера
      const imageUrl = URL.createObjectURL(info.file.originFileObj);
      onImageUploaded(imageUrl);
      message.success(`${info.file.name} загружено успешно`);
    } else if (info.file.status === 'error') {
      setUploading(false);
      message.error(`${info.file.name} ошибка загрузки.`);
    }
  };

  return (
    <Upload
      name="image"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      customRequest={({ file, onSuccess }) => {
        // В реальном приложении здесь будет отправка на сервер
        setTimeout(() => {
          onSuccess('ok', file);
        }, 1000);
      }}
    >
      <Button icon={<UploadOutlined />} loading={uploading}>
        Загрузить изображение
      </Button>
    </Upload>
  );
};

export default ImageUploader;