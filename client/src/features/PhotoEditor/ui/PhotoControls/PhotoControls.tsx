import React from 'react';
import { Slider, Space, Button, Card, Select } from 'antd';
import { PhotoControlsProps } from '../../types/photo.types';
import {
    BRIGHTNESS_MIN,
    BRIGHTNESS_MAX,
    CONTRAST_MIN,
    CONTRAST_MAX,
    HIGHLIGHTS_MIN,
    HIGHLIGHTS_MAX,
    SHADOWS_MIN,
    SHADOWS_MAX,
    FACE_HEIGHT_RATIO_MIN,
    FACE_HEIGHT_RATIO_MAX,
    FACE_TOP_OFFSET_MIN,
    FACE_TOP_OFFSET_MAX,
    CROP_PRESETS,
} from '../../lib/constants';


const PhotoControls: React.FC<PhotoControlsProps> = ({
    brightness,
    contrast,
    highlights,
    shadows,
    onBrightnessChange,
    onContrastChange,
    onHighlightsChange,
    onShadowsChange,
    onAutoAdjust,
    cropPreset,
    onCropPresetChange,
    faceHeightRatio,
    faceTopOffset,
    onFaceHeightRatioChange,
    onFaceTopOffsetChange,
    isCropped,
}) => {
    const presetOptions = Object.keys(CROP_PRESETS).map(key => ({
        label: key,
        value: key,
    }));

    return (
        <Card title="Настройки" style={{ width: 300 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                    <label>Яркость: {brightness}</label>
                    <Slider
                        min={BRIGHTNESS_MIN}
                        max={BRIGHTNESS_MAX}
                        value={brightness}
                        onChange={onBrightnessChange}
                    />
                </div>
                <div>
                    <label>Контраст: {contrast}</label>
                    <Slider
                        min={CONTRAST_MIN}
                        max={CONTRAST_MAX}
                        value={contrast}
                        onChange={onContrastChange}
                    />
                </div>
                <div>
                    <label>Свет: {highlights}</label>
                    <Slider
                        min={HIGHLIGHTS_MIN}
                        max={HIGHLIGHTS_MAX}
                        value={highlights}
                        onChange={onHighlightsChange}
                    />
                </div>
                <div>
                    <label>Тени: {shadows}</label>
                    <Slider
                        min={SHADOWS_MIN}
                        max={SHADOWS_MAX}
                        value={shadows}
                        onChange={onShadowsChange}
                    />
                </div>

                <div>
                    <label>Размер лица: {faceHeightRatio.toFixed(2)}</label>
                    <Slider
                        min={FACE_HEIGHT_RATIO_MIN}
                        max={FACE_HEIGHT_RATIO_MAX}
                        step={0.01}
                        value={faceHeightRatio}
                        onChange={onFaceHeightRatioChange}
                        disabled={isCropped}
                    />
                </div>
                <div>
                    <label>Отступ сверху: {faceTopOffset.toFixed(2)}</label>
                    <Slider
                        min={FACE_TOP_OFFSET_MIN}
                        max={FACE_TOP_OFFSET_MAX}
                        step={0.01}
                        value={faceTopOffset}
                        onChange={onFaceTopOffsetChange}
                        disabled={isCropped}
                    />
                </div>

                <div style={{ marginTop: 8 }}>
                    <label>Размер кропа:</label>
                    <Select
                        value={cropPreset}
                        onChange={onCropPresetChange}
                        options={presetOptions}
                        style={{ width: '100%' }}
                        disabled={isCropped}
                    />
                </div>

                <Button onClick={onAutoAdjust} style={{ marginTop: 8 }}>
                    Автокоррекция
                </Button>
            </Space>
        </Card>
    );
};

export default PhotoControls;