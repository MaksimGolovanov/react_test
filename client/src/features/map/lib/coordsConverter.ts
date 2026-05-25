// src/modules/Map/lib/coordsConverter.ts

export function decimalToDMS(decimal: number, isLat: boolean): string {
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutesFull = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesFull);
  const seconds = (minutesFull - minutes) * 60;
  const secondsRounded = Math.round(seconds * 10) / 10;

  // Форматируем с ведущими нулями: градусы и минуты всегда 2 цифры, секунды — 4 символа (например, "20.0" или " 5.2")
  const degStr = degrees.toString().padStart(2, '0');
  const minStr = minutes.toString().padStart(2, '0');
  const secStr = secondsRounded.toFixed(1).padStart(4, ' '); // 4 символа: " 0.1" или "20.0"

  const direction = isLat 
    ? (decimal >= 0 ? 'N' : 'S')
    : (decimal >= 0 ? 'E' : 'W');

  return `${degStr}°${minStr}′${secStr}″ ${direction}`;
}

export function formatDMS(lat: number, lng: number): string {
  return `${decimalToDMS(lat, true)} ${decimalToDMS(lng, false)}`;
}