const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const Layer = sequelize.define('layer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  isVisible: { type: DataTypes.BOOLEAN, defaultValue: true },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
  // может быть цвет, стиль и т.д.
  style: { type: DataTypes.JSONB, defaultValue: {} },
  createdBy: { type: DataTypes.INTEGER }, // id пользователя
});

const Marker = sequelize.define('marker', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  // Geometry-поле: точка (долгота, широта) в SRID 4326
  geom: { type: DataTypes.GEOMETRY('POINT', 4326), allowNull: false },
  // дополнительные атрибуты (можно хранить как JSON)
  properties: { type: DataTypes.JSONB, defaultValue: {} },
  layerId: { type: DataTypes.INTEGER, allowNull: false }, // внешний ключ
  createdBy: { type: DataTypes.INTEGER },
});

const Drawing = sequelize.define('drawing', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  type: { type: DataTypes.STRING(20), allowNull: false }, // polyline, polygon, rectangle, circle, text
  coordinates: { type: DataTypes.JSONB, allowNull: false },
  style: { type: DataTypes.JSONB, defaultValue: {} },
  text: { type: DataTypes.TEXT, allowNull: true },        // текст для надписей
  layerId: { type: DataTypes.INTEGER, allowNull: false },
  createdBy: { type: DataTypes.INTEGER },
}, {
  timestamps: true, // createdAt, updatedAt автоматически
});

Layer.hasMany(Marker, { foreignKey: 'layerId', onDelete: 'CASCADE' });
Marker.belongsTo(Layer, { foreignKey: 'layerId' });

Layer.hasMany(Drawing, { foreignKey: 'layerId', onDelete: 'CASCADE' });
Drawing.belongsTo(Layer, { foreignKey: 'layerId' });

module.exports = { Layer, Marker, Drawing };