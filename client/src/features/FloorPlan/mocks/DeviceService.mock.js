import { mockDevices, ids, mockPlacements } from './data';

const DeviceServiceMock = {
  fetchAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockDevices];
  },

  create: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newDevice = {
      id: ids.nextDeviceId++,
      type: data.type || 'computer',
      model: data.model || '',
      serialNumber: data.serialNumber || '',
      inventoryNumber: data.inventoryNumber || '',
      ipAddress: data.ipAddress || '',
      macAddress: data.macAddress || '',
      assignedTo: data.assignedTo || null,
      comment: data.comment || '',
    };
    mockDevices.push(newDevice);
    return newDevice;
  },

  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockDevices.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Устройство не найдено');
    const device = mockDevices[index];
    Object.assign(device, data);
    return device;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockDevices.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Устройство не найдено');
    mockDevices.splice(index, 1);
    const toRemove = mockPlacements.filter(p => p.deviceId === id);
    toRemove.forEach(p => {
      const idx = mockPlacements.indexOf(p);
      if (idx !== -1) mockPlacements.splice(idx, 1);
    });
    return true;
  },
};

export default DeviceServiceMock;