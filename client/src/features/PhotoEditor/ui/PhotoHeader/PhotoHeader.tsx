import React, { useRef } from 'react';
import { Button, Space, Upload, message } from 'antd';
import { UploadOutlined, SaveOutlined, ReloadOutlined, CameraOutlined } from '@ant-design/icons';
import { PhotoHeaderProps } from '../../types/photo.types';
import styles from './PhotoHeader.module.css';

const PhotoHeader: React.FC<PhotoHeaderProps> = ({
    onUpload,
    onSave,
    onReset,
    onAutoCrop,
    isProcessing,
    hasImage,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onUpload(file);
        }
        e.target.value = ''; // сброс для повторной загрузки того же файла
    };

    return (
        <div className={styles.header}>
            <Space size="middle">
                <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                >
                    Загрузить
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
                <Button
                    icon={<CameraOutlined />}
                    onClick={onAutoCrop}
                    disabled={!hasImage || isProcessing}

                >
                    Автообрезка по лицу
                </Button>
                <Button
                    icon={<SaveOutlined />}
                    onClick={onSave}
                    disabled={!hasImage || isProcessing}
                >
                    Сохранить
                </Button>
                <Button
                    icon={<ReloadOutlined />}
                    onClick={onReset}
                    disabled={!hasImage || isProcessing}
                >
                    Сброс
                </Button>
            </Space>
        </div>
    );
};

export default PhotoHeader;