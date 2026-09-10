import type { CropPreset } from '../lib/constants';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FaceDetection {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PhotoState {
  originalImage: string | null;
  editedImage: string | null;
  brightness: number;
  contrast: number;
  highlights: number;
  shadows: number;
  crop: CropArea | null;
  faceDetection: FaceDetection | null;
}

export interface PhotoHeaderProps {
  onUpload: (file: File) => void;
  onSave: () => void;
  onReset: () => void;
  onAutoCrop: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

export interface PhotoControlsProps {
  brightness: number;
  contrast: number;
  highlights: number;
  shadows: number;
  onBrightnessChange: (val: number) => void;
  onContrastChange: (val: number) => void;
  onHighlightsChange: (val: number) => void;
  onShadowsChange: (val: number) => void;
  onAutoAdjust: () => void;
  cropPreset: CropPreset;
  onCropPresetChange: (preset: CropPreset) => void;
  faceHeightRatio: number;
  faceTopOffset: number;
  onFaceHeightRatioChange: (val: number) => void;
  onFaceTopOffsetChange: (val: number) => void;
  isCropped: boolean;
  cropArea?: CropArea;
}

export interface PhotoCanvasProps {
  imageSrc: string | null;
  brightness: number;
  contrast: number;
  cropArea?: CropArea;
  faceBox?: FaceDetection | null;
  onCropSelect?: (area: CropArea) => void;
  width?: number;
  height?: number;
}