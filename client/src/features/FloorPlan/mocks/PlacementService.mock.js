import { mockPlacements, ids } from './data';

const PlacementServiceMock = {
  create: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newPlacement = {
      id: ids.nextPlacementId++,
      floorPlanId: data.floorPlanId,
      deviceId: data.deviceId,
      x: data.x || 0,
      y: data.y || 0,
      rotation: data.rotation || 0,
      scale: data.scale || 1,
    };
    mockPlacements.push(newPlacement);
    return newPlacement;
  },

  updateBatch: async (placements) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    placements.forEach((updated) => {
      const index = mockPlacements.findIndex((p) => p.id === updated.id);
      if (index !== -1) {
        mockPlacements[index].x = updated.x;
        mockPlacements[index].y = updated.y;
        mockPlacements[index].rotation = updated.rotation || 0;
        mockPlacements[index].scale = updated.scale || 1;
      }
    });
    return true;
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockPlacements.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Расположение не найдено');
    mockPlacements.splice(index, 1);
    return true;
  },
};

export default PlacementServiceMock;