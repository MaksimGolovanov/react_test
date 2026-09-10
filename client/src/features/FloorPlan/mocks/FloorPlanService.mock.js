import { mockPlans, mockPlacements, mockDevices, ids } from './data';

const getDevice = (id) => mockDevices.find(d => d.id === id);

const getPlacementsWithDevices = (planId) => {
  return mockPlacements
    .filter(p => p.floorPlanId === planId)
    .map(p => ({
      id: p.id,
      device: getDevice(p.deviceId),
      x: p.x,
      y: p.y,
      rotation: p.rotation,
      scale: p.scale,
    }));
};

const FloorPlanServiceMock = {
  fetchAll: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...mockPlans];
  },

  fetchWithDevices: async (planId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const plan = mockPlans.find(p => p.id === planId);
    if (!plan) throw new Error('План не найден');
    return {
      plan: { ...plan },
      placements: getPlacementsWithDevices(planId),
    };
  },

  create: async (data, imageFile) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPlan = {
      id: ids.nextPlanId++,
      buildingName: data.buildingName || 'Новое здание',
      floor: data.floor || 1,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : '/static/plans/default.png',
      width: 1200,
      height: 800,
    };
    mockPlans.push(newPlan);
    return newPlan;
  },

  update: async (id, data, imageFile) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPlans.findIndex(p => p.id === id);
    if (index === -1) throw new Error('План не найден');
    const plan = mockPlans[index];
    if (data.buildingName) plan.buildingName = data.buildingName;
    if (data.floor) plan.floor = data.floor;
    if (imageFile) plan.imageUrl = URL.createObjectURL(imageFile);
    return plan;
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockPlans.findIndex(p => p.id === id);
    if (index === -1) throw new Error('План не найден');
    mockPlans.splice(index, 1);
    const toRemove = mockPlacements.filter(p => p.floorPlanId === id);
    toRemove.forEach(p => {
      const idx = mockPlacements.indexOf(p);
      if (idx !== -1) mockPlacements.splice(idx, 1);
    });
    return true;
  },
};

export default FloorPlanServiceMock;