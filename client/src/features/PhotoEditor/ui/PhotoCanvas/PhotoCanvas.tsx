import React, { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { PhotoCanvasProps } from '../../types/photo.types';
import { TARGET_WIDTH_320, TARGET_HEIGHT_200, TARGET_WIDTH_146, TARGET_HEIGHT_194 } from '../../lib/constants';

const PhotoCanvas: React.FC<PhotoCanvasProps> = ({
    imageSrc,
    brightness,
    contrast,
    cropArea,
    faceBox,
    onCropSelect,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setDimensions({ width: rect.width, height: rect.height });
            }
        };
        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    useEffect(() => {
        if (!imageSrc || !canvasRef.current || dimensions.width === 0 || dimensions.height === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        const img = new Image();

        img.onload = () => {
            const imgWidth = img.width;
            const imgHeight = img.height;
            const containerWidth = dimensions.width;
            const containerHeight = dimensions.height;

            // Определяем, является ли изображение уже обрезанным (проверяем размеры)
            const isCropped =
                (imgWidth === TARGET_WIDTH_320 && imgHeight === TARGET_HEIGHT_200) ||
                (imgWidth === TARGET_WIDTH_146 && imgHeight === TARGET_HEIGHT_194);

            let destWidth: number, destHeight: number, offsetX: number, offsetY: number;

            if (isCropped) {
                // Обрезанное изображение: показываем в натуральную величину,
                // но если оно не помещается, уменьшаем для вписывания
                const scaleX = containerWidth / imgWidth;
                const scaleY = containerHeight / imgHeight;
                const scale = Math.min(scaleX, scaleY, 1); // не увеличиваем, только уменьшаем
                destWidth = imgWidth * scale;
                destHeight = imgHeight * scale;
                offsetX = (containerWidth - destWidth) / 2;
                offsetY = (containerHeight - destHeight) / 2;
            } else {
                // Исходное изображение: масштабируем, чтобы полностью вписать в контейнер
                const scaleX = containerWidth / imgWidth;
                const scaleY = containerHeight / imgHeight;
                const scale = Math.min(scaleX, scaleY);
                destWidth = imgWidth * scale;
                destHeight = imgHeight * scale;
                offsetX = (containerWidth - destWidth) / 2;
                offsetY = (containerHeight - destHeight) / 2;
            }

            canvas.width = containerWidth;
            canvas.height = containerHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, offsetX, offsetY, destWidth, destHeight);

            // Рисуем рамку обрезки (если есть) – только для исходного изображения
            if (cropArea && !isCropped) {
                const scaleX = destWidth / imgWidth;
                const scaleY = destHeight / imgHeight;
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    offsetX + cropArea.x * scaleX,
                    offsetY + cropArea.y * scaleY,
                    cropArea.width * scaleX,
                    cropArea.height * scaleY
                );
            }
            // Рисуем рамку лица (если есть) – только для исходного изображения
            if (faceBox && !isCropped) {
                const scaleX = destWidth / imgWidth;
                const scaleY = destHeight / imgHeight;
                ctx.strokeStyle = 'lime';
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    offsetX + faceBox.x * scaleX,
                    offsetY + faceBox.y * scaleY,
                    faceBox.width * scaleX,
                    faceBox.height * scaleY
                );
            }
        };

        img.src = imageSrc;
    }, [imageSrc, dimensions, cropArea, faceBox]);

    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                }}
            />
        </div>
    );
};

export default PhotoCanvas;