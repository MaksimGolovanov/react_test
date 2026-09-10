// src/modules/Naryad/hooks/useExportDocx.ts

import { useCallback } from 'react';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import { saveAs } from 'file-saver';
import { Order, OrderTemplate } from '../types/order.types';

export const useExportDocx = () => {
    const exportDocx = useCallback(async (order: Order, template: OrderTemplate) => {
        try {
            // Загружаем файл шаблона DOCX
            const response = await fetch(`/templates/${template.docx_template}`);
            if (!response.ok) {
                throw new Error(`Шаблон ${template.docx_template} не найден`);
            }
            const arrayBuffer = await response.arrayBuffer();

            const zip = new PizZip(arrayBuffer);
            const doc = new Docxtemplater(zip, {
                paragraphLoop: true,
                linebreaks: true,
            });

            const data = order.data || {};

            // Явно извлекаем нужные поля, включая из справочника
            const workers = data.workers || [];
            const airSamples = data.airSamples || [];
            const extensions = data.completion?.extensions || [];
            const tpa = data.tpa || [];

            // Статические тексты (если нужны)
            const staticContent = template.static_content || {};

            const templateData = {
                ...data,
                workers,
                airSamples,
                extensions,
                tpa,
                // Явно добавляем поля из справочника, чтобы быть уверенным
                workType: data.workType || '',
                workTypeDescription: data.workTypeDescription || '',
                measures: data.measures || '',
                safetyMeasures: data.safetyMeasures || '',
                // Для совместимости со старыми шаблонами
                measuresString: data.measures || '',
                safetyMeasuresString: data.safetyMeasures || '',
                // Статика
                section7: staticContent.section7 || '',
                section8: staticContent.section8 || '',
                section9: staticContent.section9 || '',
                number: order.number || '',
            };

            // Логируем для отладки (можно удалить после проверки)
            console.log('DOCX templateData:', templateData);

            doc.setData(templateData);
            doc.render();

            const out = doc.getZip().generate({
                type: 'blob',
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            saveAs(out, `Наряд-допуск_${order.number}.docx`);
        } catch (error) {
            console.error('Ошибка при экспорте DOCX:', error);
            throw error;
        }
    }, []);

    return { exportDocx };
};