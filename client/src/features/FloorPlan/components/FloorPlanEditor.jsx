import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Image, Group, Text, Circle } from 'react-konva';
import { getDeviceIcon } from '../utils/deviceIcons';
import styles from './style.module.css';

const FloorPlanEditor = ({
  imageUrl,
  devices = [],
  onDeviceMove,
  onDeviceSelect,
  selectedDeviceId,
  editable = false,
  imageWidth = 1200,
  imageHeight = 730,
  viewportHeight = 730,
}) => {
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const stageRef = useRef(null);
  const [image, setImage] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [stageWidth, setStageWidth] = useState(0);
  const [showArrows, setShowArrows] = useState(false);

  // Загрузка изображения
  useEffect(() => {
    if (imageUrl) {
      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        setImage(img);
        updateContainerWidth();
      };
      img.onerror = () => console.warn('Ошибка загрузки изображения:', imageUrl);
    } else {
      setImage(null);
    }
  }, [imageUrl]);

  const updateContainerWidth = () => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    if (rect.width > 0) {
      setContainerWidth(rect.width);
    } else {
      requestAnimationFrame(() => {
        const newRect = container.getBoundingClientRect();
        if (newRect.width > 0) {
          setContainerWidth(newRect.width);
        }
      });
    }
  };

  // Отслеживание изменения ширины контейнера
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateContainerWidth();

    const ro = new ResizeObserver(updateContainerWidth);
    ro.observe(container);

    window.addEventListener('resize', updateContainerWidth);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateContainerWidth);
    };
  }, []);

  // Пересчёт геометрии
  useEffect(() => {
    if (!image || containerWidth === 0) {
      setScale(1);
      setOffsetX(0);
      setStageWidth(containerWidth || 0);
      setShowArrows(false);
      return;
    }

    const imgW = image.width || imageWidth;
    const imgH = image.height || imageHeight;

    const newScale = viewportHeight / imgH;
    const scaledImgW = imgW * newScale;

    let newStageWidth = containerWidth;
    let newOffsetX = 0;
    let needArrows = false;

    if (scaledImgW <= containerWidth) {
      newStageWidth = containerWidth;
      newOffsetX = (containerWidth - scaledImgW) / 2;
      needArrows = false;
    } else {
      newStageWidth = scaledImgW;
      newOffsetX = 0;
      needArrows = true;
    }

    setScale(newScale);
    setOffsetX(newOffsetX);
    setStageWidth(newStageWidth);
    setShowArrows(needArrows);
  }, [image, containerWidth, viewportHeight, imageWidth, imageHeight]);

  const handleDragMove = (e, placementId) => {
    const node = e.target;
    const originalX = (node.x() - offsetX) / scale;
    const originalY = node.y() / scale;
    onDeviceMove(placementId, originalX, originalY);
  };

  const handleClick = (e, placementId) => {
    e.cancelBubble = true;
    onDeviceSelect(placementId);
  };

  const handleScroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const step = Math.max(200, container.clientWidth * 0.8);
    const newLeft = container.scrollLeft + (direction === 'left' ? -step : step);
    container.scrollTo({ left: newLeft, behavior: 'smooth' });
  };

  // Показываем только когда есть ширина
  if (containerWidth === 0) {
    return <div className={styles.editorContainer} ref={containerRef} />;
  }

  return (
    <div className={styles.editorContainer} ref={containerRef}>
      <div
        className={styles.viewportWrapper}
        style={{
          width: containerWidth,
          height: viewportHeight,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          ref={scrollRef}
          className={styles.scrollWrapper}
          style={{
            width: '100%',
            height: '100%',
            overflowX: showArrows ? 'auto' : 'hidden',
            overflowY: 'hidden',
          }}
        >
          <Stage
            width={stageWidth || containerWidth}
            height={viewportHeight}
            ref={stageRef}
            style={{ background: '#f0f2f5', borderRadius: 8 }}
          >
            <Layer>
              {image && (
                <Image
                  image={image}
                  x={offsetX}
                  y={0}
                  width={image.width * scale}
                  height={image.height * scale}
                />
              )}
            </Layer>
            <Layer>
              {devices.map((item) => {
                const device = item.device;
                if (!device) return null;
                const isSelected = item.id === selectedDeviceId;
                const icon = getDeviceIcon(device.type);
                const scaledX = item.x * scale + offsetX;
                const scaledY = item.y * scale;

                return (
                  <Group
                    key={item.id}
                    x={scaledX}
                    y={scaledY}
                    draggable={editable}
                    onDragMove={(e) => handleDragMove(e, item.id)}
                    onClick={(e) => handleClick(e, item.id)}
                  >
                    <Circle
                      radius={24}
                      fill={isSelected ? '#ff4d4f' : icon.color}
                      opacity={0.2}
                    />
                    <Text
                      text={icon.label}
                      fontSize={28}
                      align="center"
                      verticalAlign="middle"
                      width={48}
                      height={48}
                      offsetX={24}
                      offsetY={24}
                    />
                    <Text
                      text={device.model || device.type}
                      fontSize={10}
                      align="center"
                      y={28}
                      offsetX={24}
                      width={48}
                      fill="#333"
                    />
                    {device.assignedTo && (
                      <Text
                        text={device.assignedTo}
                        fontSize={9}
                        align="center"
                        y={40}
                        offsetX={24}
                        width={48}
                        fill="#666"
                      />
                    )}
                  </Group>
                );
              })}
            </Layer>
          </Stage>
        </div>

      </div>
    </div>
  );
};

export default FloorPlanEditor;