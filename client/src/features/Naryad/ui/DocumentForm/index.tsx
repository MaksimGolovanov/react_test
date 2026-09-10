// src/modules/Naryad/ui/DocumentForm/index.tsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Card, Progress, message, Space, Divider } from 'antd';
import { SaveOutlined, FileWordOutlined } from '@ant-design/icons';
import orderStore from '../../store/OrderStore';
import FieldRenderer from './FieldRenderer';
import EditableTable from './EditableTable';
import { useExportDocx } from '../../hooks/useExportDocx';
import debounce from 'lodash/debounce';
import styles from './styles.module.css';

interface DocumentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

const DocumentForm: React.FC<DocumentFormProps> = observer(({ onSuccess, onCancel }) => {
    // ✅ ВСЕ ХУКИ ВЫЗЫВАЕМ ВНАЧАЛЕ, ДО ЛЮБЫХ УСЛОВИЙ
    const { selectedTemplate, selectedOrder } = orderStore;
    const [isSaving, setIsSaving] = useState(false);
    const [progress, setProgress] = useState(0);
    const { exportDocx } = useExportDocx();

    const [localData, setLocalData] = useState<Record<string, any>>(() => selectedOrder?.data || {});

    useEffect(() => {
        if (selectedOrder) {
            setLocalData(selectedOrder.data || {});
        }
    }, [selectedOrder]);

    // Функция сохранения (useCallback)
    const saveData = useCallback(
        async (data: Record<string, any>, closeAfterSave = false) => {
            if (!selectedOrder || !selectedTemplate) {
                message.error('Нет выбранного наряда или шаблона');
                return false;
            }

            setIsSaving(true);
            try {
                const requiredFields = selectedTemplate.schema.filter((f) => f.required);
                for (const field of requiredFields) {
                    const value = data[field.name];
                    if (value === undefined || value === null || value === '') {
                        message.error(`Поле "${field.label}" обязательно для заполнения`);
                        setIsSaving(false);
                        return false;
                    }
                }

                const cleanData = JSON.parse(JSON.stringify(data));
                await orderStore.updateOrder(selectedOrder.id, { data: cleanData });
                message.success('Наряд сохранён');
                if (closeAfterSave && onSuccess) {
                    onSuccess();
                }
                setIsSaving(false);
                return true;
            } catch (error) {
                console.error('Ошибка сохранения:', error);
                message.error('Ошибка при сохранении');
                setIsSaving(false);
                return false;
            }
        },
        [selectedOrder, selectedTemplate, onSuccess] // зависимости
    );

    // Автосохранение с debounce
    const debouncedSave = useCallback(
        debounce((data: Record<string, any>) => {
            saveData(data, false);
        }, 1000),
        [saveData]
    );

    // Прогресс заполнения
    useMemo(() => {
        if (!selectedTemplate) {
            setProgress(0);
            return;
        }
        const allFields = selectedTemplate.schema.filter((f) => f.type !== 'array' && f.type !== 'group');
        const filled = allFields.filter((f) => {
            const val = localData[f.name];
            if (f.required) {
                return val !== undefined && val !== null && val !== '';
            }
            return true;
        }).length;
        const total = allFields.filter((f) => f.required).length;
        setProgress(total > 0 ? Math.round((filled / total) * 100) : 0);
    }, [localData, selectedTemplate]);

    // ✅ ТЕПЕРЬ МОЖНО СДЕЛАТЬ РАННИЙ ВОЗВРАТ, ПОСЛЕ ВСЕХ ХУКОВ
    if (!selectedTemplate || !selectedOrder) {
        return <div>Выберите шаблон и наряд</div>;
    }

    const schema = selectedTemplate.schema;
    const sections = selectedTemplate.sections;

    // Обработчики
    const handleFieldChange = (fieldName: string, value: any) => {
        const newData = { ...localData, [fieldName]: value };



        // Если изменилось структурное подразделение – сбрасываем связанные поля
        if (fieldName === 'structuralUnit') {
            newData.workType = undefined;
            newData.workTypeDescription = '';
            newData.measures = '';
            newData.safetyMeasures = '';
        }

        // Если изменился workType – подставляем данные из справочника
        if (fieldName === 'workType') {
            const service = newData.structuralUnit;
            const workCode = value;


            const workItem = orderStore.getGasHazardWork(service, workCode);
            if (workItem) {
                newData.workTypeDescription = workItem.description;
                newData.measures = workItem.preparationMeasures;
                newData.safetyMeasures = workItem.safetyMeasures;
            } else {
                newData.workTypeDescription = '';
                newData.measures = '';
                newData.safetyMeasures = '';
            }
        }

        setLocalData(newData);
        debouncedSave(newData);
    };

    const handleArrayChange = (fieldName: string, newArray: any[]) => {
        const newData = { ...localData, [fieldName]: newArray };
        setLocalData(newData);
        debouncedSave(newData);
    };

    const handleSaveAndClose = async () => {
        await saveData(localData, true);
    };

    const handleExport = async () => {
        try {
            // Сохраняем текущие данные
            await saveData(localData, false);

            // Получаем свежие данные из БД для работы с нарядом
            const service = localData.structuralUnit;
            const workCode = localData.workType;
            let exportData = { ...localData };

            if (service && workCode) {
                const workItem = orderStore.getGasHazardWork(service, workCode);
                if (workItem) {
                    // Перезаписываем поля из БД
                    exportData.workTypeDescription = workItem.description;
                    exportData.measures = workItem.preparationMeasures;
                    exportData.safetyMeasures = workItem.safetyMeasures;
                    console.log('📥 Обновлено из БД:', { measures: exportData.measures });
                }
            }

            const orderToExport = {
                ...selectedOrder,
                data: exportData,
            };

            await exportDocx(orderToExport, selectedTemplate);
        } catch (error) {
            message.error('Не удалось экспортировать документ. Проверьте наличие шаблона DOCX.');
        }
    };

    // Рендер поля – используем FieldRenderer с allData
    const renderField = (field: any) => {
        if (field.type === 'array') {
            return (
                <EditableTable
                    fields={field.subfields || []}
                    data={localData[field.name] || []}
                    onChange={(newData) => handleArrayChange(field.name, newData)}
                />
            );
        }
        if (field.type === 'group') {
            return (
                <div className={styles.groupContainer}>
                    {field.subfields?.map((sub: any) => (
                        <FieldRenderer
                            key={sub.name}
                            field={sub}
                            value={localData[sub.name]}
                            onChange={(val) => handleFieldChange(sub.name, val)}
                            allData={localData}
                        />
                    ))}
                </div>
            );
        }
        return (
            <FieldRenderer
                field={field}
                value={localData[field.name]}
                onChange={(val) => handleFieldChange(field.name, val)}
                allData={localData}
            />
        );
    };

    // Прокрутка к секции
    const scrollToSection = (sectionTitle: string) => {
        const id = sectionTitle.replace(/\s/g, '-');
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <Space>
                    <Button icon={<SaveOutlined />} onClick={handleSaveAndClose} loading={isSaving}>
                        Сохранить и закрыть
                    </Button>
                    <Button icon={<FileWordOutlined />} onClick={handleExport}>
                        Экспорт DOCX
                    </Button>
                    {onCancel && (
                        <Button onClick={onCancel} danger>
                            Отмена
                        </Button>
                    )}
                </Space>
                <div className={styles.progressWrapper}>
                    <span>Заполнено:</span>
                    <Progress percent={progress} size="small" style={{ width: 150 }} />
                </div>
            </div>

            <Divider />

            <div className={styles.content}>
                <div className={styles.anchorWrapper}>
                    <div style={{ padding: '0 16px' }}>
                        <div style={{ fontWeight: 600, marginBottom: 12 }}>Содержание</div>
                        {sections.map((section) => (
                            <div
                                key={section.title}
                                style={{
                                    cursor: 'pointer',
                                    padding: '6px 0',
                                    color: '#1890ff',
                                    borderBottom: '1px solid #f0f0f0',
                                }}
                                onClick={() => scrollToSection(section.title)}
                            >
                                {section.title}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.sectionsWrapper}>
                    {sections.map((section) => {
                        const sectionFields = section.fields.map((fieldName) =>
                            schema.find((f) => f.name === fieldName)
                        ).filter(Boolean);

                        if (sectionFields.length === 0) {
                            const staticKey = `section${sections.indexOf(section) + 7}`;
                            const staticText = selectedTemplate.static_content[staticKey as keyof typeof selectedTemplate.static_content];
                            return staticText ? (
                                <Card
                                    key={section.title}
                                    id={section.title.replace(/\s/g, '-')}
                                    title={section.title}
                                    className={styles.sectionCard}
                                >
                                    <div style={{ whiteSpace: 'pre-wrap', fontSize: 14 }}>{staticText}</div>
                                </Card>
                            ) : null;
                        }

                        return (
                            <Card
                                key={section.title}
                                id={section.title.replace(/\s/g, '-')}
                                title={section.title}
                                className={styles.sectionCard}
                            >
                                {sectionFields.map((field) => (
                                    <div key={field!.name} className={styles.fieldWrapper}>
                                        {renderField(field!)}
                                    </div>
                                ))}
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});

export default DocumentForm;