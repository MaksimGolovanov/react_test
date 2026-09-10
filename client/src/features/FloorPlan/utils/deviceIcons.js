export const DEVICE_TYPES = {
  computer: { label: '💻', color: '#1890ff' },
  printer: { label: '🖨️', color: '#faad14' },
  mfu: { label: '📠', color: '#52c41a' },
  monitor: { label: '🖥️', color: '#722ed1' },
  switch: { label: '🔀', color: '#fa541c' },
};

export const getDeviceIcon = (type) => DEVICE_TYPES[type] || DEVICE_TYPES.computer;