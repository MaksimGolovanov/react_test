const Router = require('express');
const router = new Router();
const mapController = require('../controllers/mapController');

// Слои
router.get('/layers', mapController.getAllLayers);
router.post('/layers', mapController.createLayer);
router.put('/layers/:id', mapController.updateLayer);
router.delete('/layers/:id', mapController.deleteLayer);

// Метки
router.get('/markers', mapController.getMarkers);
router.post('/markers', mapController.createMarker);
router.put('/markers/:id', mapController.updateMarker);
router.delete('/markers/:id', mapController.deleteMarker);

// 🆕 Рисунки
router.get('/drawings', mapController.getAllDrawings);
router.post('/drawings', mapController.createDrawing);
router.put('/drawings/:id', mapController.updateDrawing);
router.delete('/drawings/:id', mapController.deleteDrawing);

module.exports = router;