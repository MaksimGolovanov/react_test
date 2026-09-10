import * as faceapi from '@vladmandic/face-api';
import { CropArea, FaceDetection } from '../types/photo.types';
import { CROP_PRESETS, CropPreset } from '../lib/constants';

const MODEL_URL = '/models';

class PhotoService {
  private static canvas: HTMLCanvasElement | null = null;

  // Загрузка моделей face-api
  static async loadModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  }

  static fileToDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  static loadImageToCanvas(imgSrc: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };
      img.onerror = reject;
      img.src = imgSrc;
    });
  }

  static applyBrightnessContrast(
    srcCanvas: HTMLCanvasElement,
    brightness: number,
    contrast: number
  ): HTMLCanvasElement {
    const result = document.createElement('canvas');
    result.width = srcCanvas.width;
    result.height = srcCanvas.height;
    const ctx = result.getContext('2d')!;
    ctx.drawImage(srcCanvas, 0, 0);

    const imageData = ctx.getImageData(0, 0, result.width, result.height);
    const data = imageData.data;

    const b = (brightness - 100) / 100;
    const c = contrast / 100;

    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        let val = data[i + j] / 255;
        val = (val - 0.5) * c + 0.5;
        val += b;
        data[i + j] = Math.min(255, Math.max(0, val * 255));
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return result;
  }

  static autoLevels(srcCanvas: HTMLCanvasElement): HTMLCanvasElement {
    const result = document.createElement('canvas');
    result.width = srcCanvas.width;
    result.height = srcCanvas.height;
    const ctx = result.getContext('2d')!;
    ctx.drawImage(srcCanvas, 0, 0);

    const imageData = ctx.getImageData(0, 0, result.width, result.height);
    const data = imageData.data;

    let min = 255,
      max = 0;
    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        const val = data[i + j];
        if (val < min) min = val;
        if (val > max) max = val;
      }
    }

    if (min === 0 && max === 255) return result;
    const range = max - min;
    if (range === 0) return result;

    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        let val = data[i + j];
        val = ((val - min) / range) * 255;
        data[i + j] = Math.min(255, Math.max(0, val));
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return result;
  }

  static applyHighlightsShadows(
    srcCanvas: HTMLCanvasElement,
    highlights: number,
    shadows: number
  ): HTMLCanvasElement {
    const result = document.createElement('canvas');
    result.width = srcCanvas.width;
    result.height = srcCanvas.height;
    const ctx = result.getContext('2d')!;
    ctx.drawImage(srcCanvas, 0, 0);

    const imageData = ctx.getImageData(0, 0, result.width, result.height);
    const data = imageData.data;

    const sFactor = (shadows - 100) / 100;
    const hFactor = (highlights - 100) / 100;

    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        let val = data[i + j] / 255;
        const shadowWeight = 1 - val;
        const highlightWeight = val;
        let newVal =
          val + sFactor * shadowWeight * 0.5 + hFactor * highlightWeight * 0.5;
        newVal = Math.min(1, Math.max(0, newVal));
        data[i + j] = Math.round(newVal * 255);
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return result;
  }

  static cropImage(
    srcCanvas: HTMLCanvasElement,
    crop: CropArea
  ): HTMLCanvasElement {
    const result = document.createElement('canvas');
    result.width = crop.width;
    result.height = crop.height;
    const ctx = result.getContext('2d')!;
    ctx.drawImage(
      srcCanvas,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return result;
  }

  static resizeToExact(
    srcCanvas: HTMLCanvasElement,
    width: number,
    height: number
  ): HTMLCanvasElement {
    const result = document.createElement('canvas');
    result.width = width;
    result.height = height;
    const ctx = result.getContext('2d')!;
    ctx.drawImage(srcCanvas, 0, 0, width, height);
    return result;
  }

  static async detectFace(imgSrc: string): Promise<FaceDetection | null> {
    const img = await faceapi.fetchImage(imgSrc);
    const detections = await faceapi.detectSingleFace(
      img,
      new faceapi.TinyFaceDetectorOptions()
    );
    if (!detections) return null;
    const box = detections.box;
    return {
      x: box.x,
      y: box.y,
      width: box.width,
      height: box.height,
    };
  }

  static autoCropFace(
    srcCanvas: HTMLCanvasElement,
    face: FaceDetection,
    preset: CropPreset,
    faceHeightRatio: number,
    faceTopOffset: number
  ): HTMLCanvasElement {
    const presetData = CROP_PRESETS[preset];
    const { width: targetWidth, height: targetHeight } = presetData;

    const faceHeight = face.height;
    const faceWidth = face.width;
    const faceCenterX = face.x + faceWidth / 2;
    const faceTop = face.y;

    const scale = (targetHeight * faceHeightRatio) / faceHeight;
    let cropWidth = targetWidth / scale;
    let cropHeight = targetHeight / scale;

    let cropLeft = faceCenterX - cropWidth / 2;
    let cropTop = faceTop - cropHeight * faceTopOffset;

    if (cropLeft < 0) cropLeft = 0;
    if (cropTop < 0) cropTop = 0;
    if (cropLeft + cropWidth > srcCanvas.width) {
      cropWidth = srcCanvas.width - cropLeft;
    }
    if (cropTop + cropHeight > srcCanvas.height) {
      cropHeight = srcCanvas.height - cropTop;
    }

    const cropCanvas = document.createElement('canvas');
    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;
    const ctx = cropCanvas.getContext('2d')!;
    ctx.drawImage(
      srcCanvas,
      cropLeft,
      cropTop,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight
    );

    return this.resizeToExact(cropCanvas, targetWidth, targetHeight);
  }

  static canvasToDataURL(
    canvas: HTMLCanvasElement,
    format: string = 'image/jpeg',
    quality: number = 0.92
  ): string {
    return canvas.toDataURL(format, quality);
  }
}

export default PhotoService;
