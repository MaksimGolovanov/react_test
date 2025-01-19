import React, { useState } from 'react';
import { Form, ProgressBar } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import IusPtStore from '../../store/IusPtStore';

const FileUploader = ({ onUploadComplete }) => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async (evt) => {
            setIsUploading(true);
            setUploadProgress(0);

            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

            const roles = data.slice(1).map((row) => ({
                typename: row[0] || '',
                type: row[1] || '',
                name: row[2] || '',
                code: row[3] || '',
                mandat: row[4] || ''
            }));

            const uniqueRoles = roles.filter((role) => {
                return !IusPtStore.roles.some(existingRole => existingRole.code === role.code);
            });

            const batchSize = 10;
            const totalBatches = Math.ceil(uniqueRoles.length / batchSize);

            for (let i = 0; i < uniqueRoles.length; i += batchSize) {
                const batch = uniqueRoles.slice(i, i + batchSize);
                try {
                    await Promise.all(batch.map(role => IusPtStore.createRole(role)));
                } catch (error) {
                    console.error('Ошибка при создании ролей из Excel:', error);
                }

                const progress = Math.floor(((i + batchSize) / uniqueRoles.length) * 100);
                setUploadProgress(progress);
            }

            setIsUploading(false);
            setUploadProgress(100);
            onUploadComplete(); // Вызов callback после завершения загрузки
        };

        reader.onerror = (error) => {
            console.error('Ошибка при чтении файла:', error);
            setIsUploading(false);
        };

        reader.readAsBinaryString(file);
    };

    return (
        <Form.Group className="mt-3">
            <Form.Label>Загрузить данные из Excel</Form.Label>
            <Form.Control
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                disabled={isUploading}
            />
            {isUploading && (
                <div className="mt-2">
                    <ProgressBar
                        now={uploadProgress}
                        label={`${uploadProgress}%`}
                        striped
                        animated
                    />
                    <div className="text-center mt-2">Загрузка... {uploadProgress}%</div>
                </div>
            )}
        </Form.Group>
    );
};

export default FileUploader;