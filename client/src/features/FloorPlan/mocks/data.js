// Моковые сотрудники (для привязки)
export const mockStaff = [
  { tabNumber: '001234', fio: 'Иванов Иван Иванович', post: 'Инженер' },
  { tabNumber: '001235', fio: 'Петров Петр Петрович', post: 'Ведущий инженер' },
  { tabNumber: '001236', fio: 'Сидоров Сидор Сидорович', post: 'Начальник отдела' },
];

// Моковые планы этажей
export const mockPlans = [
  {
    id: 1,
    buildingName: 'Главный корпус',
    floor: 3,
    imageUrl: '/static/plans/floor3.png',
    width: 1200,
    height: 800,
  },
  {
    id: 2,
    buildingName: 'Главный корпус',
    floor: 4,
    imageUrl: '/static/plans/floor4.png',
    width: 1200,
    height: 800,
  },
];

// Моковые устройства
export let mockDevices = [
  {
    id: 1,
    type: 'computer',
    model: 'HP EliteBook 840 G6',
    serialNumber: 'SN-001',
    inventoryNumber: 'INV-001',
    ipAddress: '192.168.1.10',
    macAddress: 'AA:BB:CC:DD:EE:01',
    assignedTo: '001234',
    comment: 'Рабочая станция',
  },
  {
    id: 2,
    type: 'computer',
    model: 'Dell Latitude 5420',
    serialNumber: 'SN-002',
    inventoryNumber: 'INV-002',
    ipAddress: '192.168.1.11',
    macAddress: 'AA:BB:CC:DD:EE:02',
    assignedTo: '001235',
    comment: '',
  },
  {
    id: 3,
    type: 'mfu',
    model: 'Xerox WorkCentre 3655',
    serialNumber: 'SN-003',
    inventoryNumber: 'INV-003',
    ipAddress: '192.168.1.20',
    macAddress: 'AA:BB:CC:DD:EE:03',
    assignedTo: null,
    comment: 'МФУ в коридоре',
  },
  {
    id: 4,
    type: 'printer',
    model: 'HP LaserJet 4050',
    serialNumber: 'SN-004',
    inventoryNumber: 'INV-004',
    ipAddress: '192.168.1.21',
    macAddress: 'AA:BB:CC:DD:EE:04',
    assignedTo: null,
    comment: 'Принтер в комнате 301',
  },
  {
    id: 5,
    type: 'switch',
    model: 'Cisco Catalyst 2960',
    serialNumber: 'SN-005',
    inventoryNumber: 'INV-005',
    ipAddress: '192.168.1.254',
    macAddress: 'AA:BB:CC:DD:EE:05',
    assignedTo: null,
    comment: 'Свитч в серверной',
  },
  {
    id: 6,
    type: 'monitor',
    model: 'Samsung 24"',
    serialNumber: 'SN-006',
    inventoryNumber: 'INV-006',
    ipAddress: '',
    macAddress: '',
    assignedTo: '001236',
    comment: 'Дополнительный монитор',
  },
];

// Моковые расположения на планах
export let mockPlacements = [
  // План 1 (этаж 3)
  { id: 1, floorPlanId: 1, deviceId: 1, x: 200, y: 150, rotation: 0, scale: 1 },
  { id: 2, floorPlanId: 1, deviceId: 2, x: 350, y: 150, rotation: 0, scale: 1 },
  { id: 3, floorPlanId: 1, deviceId: 3, x: 500, y: 300, rotation: 0, scale: 1 },
  { id: 4, floorPlanId: 1, deviceId: 4, x: 100, y: 400, rotation: 0, scale: 1 },
  { id: 5, floorPlanId: 1, deviceId: 5, x: 800, y: 500, rotation: 0, scale: 1 },
  // План 2 (этаж 4)
  { id: 6, floorPlanId: 2, deviceId: 6, x: 400, y: 200, rotation: 0, scale: 1 },
];

// Глобальный объект счётчиков (изменяемый)
export const ids = {
  nextPlanId: 3,
  nextDeviceId: 7,
  nextPlacementId: 7,
};