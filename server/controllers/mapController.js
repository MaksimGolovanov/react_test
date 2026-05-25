const { Layer, Marker, Drawing } = require('../models/map')
const { sequelize } = require('../db') // для выполнения сырых запросов
const { QueryTypes } = require('sequelize')
const ApiError = require('../error/ApiError')

class MapController {
     // ----- Слои -----
     async getAllLayers(req, res, next) {
          try {
               const layers = await Layer.findAll({ order: [['order', 'ASC']] })
               return res.json(layers)
          } catch (e) {
               return next(ApiError.internal(e.message))
          }
     }

     async createLayer(req, res, next) {
          try {
               const { name, description, style, order } = req.body
               const layer = await Layer.create({
                    name,
                    description,
                    style: style || {},
                    order: order || 0,
                    createdBy: req.user?.id || null,
               })
               return res.status(201).json(layer)
          } catch (e) {
               return next(ApiError.internal(e.message))
          }
     }

     async updateLayer(req, res, next) {
          try {
               const { id } = req.params
               const layer = await Layer.findByPk(id)
               if (!layer) return next(ApiError.notFound('Слой не найден'))
               await layer.update(req.body)
               return res.json(layer)
          } catch (e) {
               return next(ApiError.internal(e.message))
          }
     }

     async deleteLayer(req, res, next) {
          try {
               const { id } = req.params
               const layer = await Layer.findByPk(id)
               if (!layer) return next(ApiError.notFound('Слой не найден'))
               await layer.destroy()
               return res.json({ message: 'Слой удалён' })
          } catch (e) {
               return next(ApiError.internal(e.message))
          }
     }

     // ----- Метки (точки) -----
     async getMarkers(req, res, next) {
          try {
               const { layerId, bbox } = req.query // bbox = "minLng,minLat,maxLng,maxLat"
               let where = {}
               if (layerId) where.layerId = layerId

               let markers
               if (bbox) {
                    const [minLng, minLat, maxLng, maxLat] = bbox.split(',').map(Number)
                    // Используем ST_Within или ST_Intersects для фильтрации по bounding box
                    const query = `
          SELECT id, name, description, layerId, "createdBy", properties,
                 ST_AsGeoJSON(geom)::json as geojson
          FROM markers
          WHERE layerId = $layerId OR $layerId IS NULL
            AND geom && ST_MakeEnvelope($minLng, $minLat, $maxLng, $maxLat, 4326)
        `
                    markers = await sequelize.query(query, {
                         bind: { layerId: layerId || null, minLng, minLat, maxLng, maxLat },
                         type: QueryTypes.SELECT,
                    })
               } else {
                    markers = await Marker.findAll({ where })
                    // Преобразовать geom в GeoJSON для каждого
                    markers = markers.map((m) => ({
                         ...m.toJSON(),
                         geojson: m.geom,
                    }))
               }
               return res.json(markers)
          } catch (e) {
               return next(ApiError.internal(e.message))
          }
     }

     async createMarker(req, res, next) {
          try {
               const { name, description, lng, lat, layerId, properties } = req.body
               if (!lng || !lat) return next(ApiError.badRequest('Не заданы координаты'))
               // Создаем точку как WKT или GeoJSON
               const geom = { type: 'Point', coordinates: [lng, lat] }
               const marker = await Marker.create({
                    name,
                    description,
                    geom,
                    layerId,
                    properties: properties || {},
                    createdBy: req.user?.id || null,
               })
               // Ответ с преобразованным geom
               const result = marker.toJSON()
               result.geojson = marker.geom
               return res.status(201).json(result)
          } catch (e) {
               return next(ApiError.internal(e.message))
          }
     }

     async updateMarker(req, res, next) {
          try {
               const { id } = req.params
               const marker = await Marker.findByPk(id)
               if (!marker) return next(ApiError.notFound('Метка не найдена'))
               let updateData = { ...req.body }
               if (req.body.lng && req.body.lat) {
                    updateData.geom = { type: 'Point', coordinates: [req.body.lng, req.body.lat] }
                    delete updateData.lng
                    delete updateData.lat
               }
               await marker.update(updateData)
               return res.json(marker)
          } catch (e) {
               return next(ApiError.internal(e.message))
          }
     }

     async deleteMarker(req, res, next) {
          try {
               const { id } = req.params
               const marker = await Marker.findByPk(id)
               if (!marker) return next(ApiError.notFound('Метка не найдена'))
               await marker.destroy()
               return res.json({ message: 'Метка удалена' })
          } catch (e) {
               return next(ApiError.internal(e.message))
          }
     }

     async getAllDrawings(req, res, next) {
          try {
               const { layerId } = req.query
               let where = {}
               if (layerId) where.layerId = layerId
               const drawings = await Drawing.findAll({ where })
               return res.json(drawings)
          } catch (e) {
               return next(ApiError.internal(e.message))
          }
     }

     async createDrawing(req, res, next) {
          try {
               const { name, description, type, coordinates, style, text, layerId } = req.body
               if (!layerId) return next(ApiError.badRequest('layerId обязателен'))
               const drawing = await Drawing.create({
                    name,
                    description,
                    type,
                    coordinates,
                    style: style || {},
                    text: text || null,
                    layerId,
                    createdBy: req.user?.id || null,
               })
               return res.status(201).json(drawing)
          } catch (e) {
               console.error('Ошибка создания рисунка:', e)
               return next(ApiError.internal(e.message))
          }
     }

     async updateDrawing(req, res, next) {
          try {
               const { id } = req.params
               const drawing = await Drawing.findByPk(id)
               if (!drawing) return next(ApiError.notFound('Рисунок не найден'))
               await drawing.update(req.body)
               return res.json(drawing)
          } catch (e) {
               return next(ApiError.internal(e.message))
          }
     }

     async deleteDrawing(req, res, next) {
          try {
               const { id } = req.params
               const drawing = await Drawing.findByPk(id)
               if (!drawing) return next(ApiError.notFound('Рисунок не найден'))
               await drawing.destroy()
               return res.json({ message: 'Рисунок удалён' })
          } catch (e) {
               return next(ApiError.internal(e.message))
          }
     }
}

module.exports = new MapController()
