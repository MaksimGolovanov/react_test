import React, { useCallback, useRef } from 'react';
import { Button, Tooltip, message, theme } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image-more';

const { useToken } = theme;

interface MapToPDFProps {
    mapWrapperRef?: React.RefObject<HTMLDivElement>;
}

const MapToPDF: React.FC<MapToPDFProps> = ({ mapWrapperRef }) => {
    const { token } = useToken();
    const isExportingRef = useRef(false);

    const exportToPDF = useCallback(async () => {
        if (isExportingRef.current) return;
        isExportingRef.current = true;

        const hideLoading = message.loading('Экспорт карты...', 0);

        const root = mapWrapperRef?.current || document;
        const mapContainer = root.querySelector('.leaflet-container') as HTMLElement | null;

        if (!mapContainer) {
            message.error('Контейнер карты не найден');
            hideLoading();
            isExportingRef.current = false;
            return;
        }

        // Временно скрываем UI-элементы
        const uiSelectors = [
            '.unified-controls',
            '.edit-controls',
            '.coordinates-display',
            '.compass-modern',
            '.drawing-hint',
        ].join(',');

        const uiElements = root.querySelectorAll(uiSelectors);
        const originalDisplays = new Map<HTMLElement, string>();

        uiElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            originalDisplays.set(htmlEl, htmlEl.style.display);
            htmlEl.style.display = 'none';
        });

        const restoreUI = () => {
            originalDisplays.forEach((display, el) => {
                el.style.display = display;
            });
        };

        try {
            await new Promise((resolve) => setTimeout(resolve, 100));

            // Захват с dom-to-image-more с масштабированием для качества,
            // но без явного задания width/height – чтобы не было полей
            const scale = 2.5;
            const dataUrl = await domtoimage.toPng(mapContainer, {
                scale,                        // пиксельная плотность
                quality: 0.95,
                bgcolor: '#1a1a1a',           // фон, если есть прозрачности
                // width и height не задаём!
            });

            // PDF-документ
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Создаём изображение, чтобы узнать его размеры в пикселях
            const img = new Image();
            img.src = dataUrl;
            await new Promise<void>((resolve, reject) => {
                img.onload = () => resolve();
                img.onerror = reject;
            });

            const imgRatio = img.width / img.height;
            const pageRatio = pdfWidth / pdfHeight;

            // Вписываем с сохранением пропорций, но если хочешь на весь лист без полей —
            // замени на логику "cover" (заполнение с обрезкой) — см. комментарий ниже
            let finalW = pdfWidth;
            let finalH = pdfWidth / imgRatio;
            if (finalH > pdfHeight) {
                finalH = pdfHeight;
                finalW = pdfHeight * imgRatio;
            }

            const x = (pdfWidth - finalW) / 2;
            const y = (pdfHeight - finalH) / 2;

            pdf.addImage(dataUrl, 'PNG', x, y, finalW, finalH);
            pdf.save(`map-${Date.now()}.pdf`);
            message.success('Экспорт завершён');
        } catch (error) {
            console.error('Export error:', error);
            message.error('Ошибка при экспорте');
        } finally {
            restoreUI();
            hideLoading();
            isExportingRef.current = false;
        }
    }, [mapWrapperRef]);

    return (
        <Tooltip title="Экспорт PDF" placement="left">
            <Button
                className="control-btn"
                icon={<FilePdfOutlined style={{ fontSize: '18px' }} />}
                onClick={exportToPDF}
                style={{ background: token.colorError, color: '#fff', border: 'none' }}
            />
        </Tooltip>
    );
};

export default MapToPDF;