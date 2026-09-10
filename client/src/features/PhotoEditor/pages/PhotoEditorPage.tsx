import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Skeleton, Row, Col, message } from 'antd';
import PhotoStore from '../store/PhotoStore';
import PhotoHeader from '../ui/PhotoHeader/PhotoHeader';
import PhotoCanvas from '../ui/PhotoCanvas/PhotoCanvas';
import PhotoControls from '../ui/PhotoControls/PhotoControls';
import styles from './style.module.css';

const PhotoEditorPage: React.FC = observer(() => {
  const {
    originalImage,
    editedImage,
    brightness,
    contrast,
    highlights,
    shadows,
    crop,
    faceDetection,
    isLoading,
    error,
    loadImage,
    setBrightness,
    setContrast,
    setHighlights,
    setShadows,
    autoCrop,
    reset,
    save,
    autoAdjust,
    cropPreset,
    setCropPreset,
    faceHeightRatio,
    faceTopOffset,
    setFaceHeightRatio,
    setFaceTopOffset,
    isCropped,
  } = PhotoStore;

  useEffect(() => {
    if (error) {
      message.error(error.message);
    }
  }, [error]);

  const handleUpload = (file: File) => loadImage(file);
  const handleAutoCrop = () => autoCrop();
  const handleSave = () => {
    save();
    message.success('Изображение сохранено');
  };
  const handleReset = () => reset();
  const handleAutoAdjust = () => autoAdjust();

  if (isLoading) {
    return (
      <div style={{ padding: 24 }}>
        <Skeleton active paragraph={{ rows: 6 }} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <PhotoHeader
        onUpload={handleUpload}
        onSave={handleSave}
        onReset={handleReset}
        onAutoCrop={handleAutoCrop}
        isProcessing={isLoading}
        hasImage={!!originalImage}
      />
      <Row gutter={16} style={{ flex: 1 }}>
        <Col span={18}>
          <div className={styles.canvasWrapper}>
            <PhotoCanvas
              imageSrc={editedImage || originalImage}
              brightness={brightness}
              contrast={contrast}
              cropArea={crop || undefined}
              faceBox={faceDetection}
            />
          </div>
        </Col>
        <Col span={6}>
          <PhotoControls
            brightness={brightness}
            contrast={contrast}
            highlights={highlights}
            shadows={shadows}
            onBrightnessChange={setBrightness}
            onContrastChange={setContrast}
            onHighlightsChange={setHighlights}
            onShadowsChange={setShadows}
            onAutoAdjust={handleAutoAdjust}
            cropPreset={cropPreset}
            onCropPresetChange={setCropPreset}
            faceHeightRatio={faceHeightRatio}
            faceTopOffset={faceTopOffset}
            onFaceHeightRatioChange={setFaceHeightRatio}
            onFaceTopOffsetChange={setFaceTopOffset}
            isCropped={isCropped}
          />
        </Col>
      </Row>
    </div>
  );
});

export default PhotoEditorPage;
