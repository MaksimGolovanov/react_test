// server/models/documentModels.js
const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Модель типа обучения для документов
const DocTrainingType = sequelize.define('doc_training_type', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true 
    },
    code: { 
        type: DataTypes.STRING(50), 
        allowNull: false,
        unique: true 
    },
    description: { type: DataTypes.TEXT }
}, {
    tableName: 'doc_training_types',
    timestamps: false
});

// Модель категории документа
const DocCategory = sequelize.define('doc_category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true 
    },
    code: { 
        type: DataTypes.STRING(50), 
        allowNull: false,
        unique: true 
    },
    description: { type: DataTypes.TEXT }
}, {
    tableName: 'doc_categories',
    timestamps: false
});

// Модель статуса документа
const DocStatus = sequelize.define('doc_status', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { 
        type: DataTypes.STRING, 
        allowNull: false,
        unique: true 
    },
    code: { 
        type: DataTypes.STRING(50), 
        allowNull: false,
        unique: true 
    },
    description: { type: DataTypes.TEXT }
}, {
    tableName: 'doc_statuses',
    timestamps: false
});

// Модель документа
const Doc = sequelize.define('doc', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    
    // Основная информация
    title: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    description: { type: DataTypes.TEXT },
    
    // Внешние ключи
    training_type_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DocTrainingType,
            key: 'id'
        }
    },
    category_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DocCategory,
            key: 'id'
        }
    },
    status_id: { 
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: DocStatus,
            key: 'id'
        }
    },
    
    // Файловая информация
    file_name: { type: DataTypes.STRING },
    file_path: { type: DataTypes.STRING },
    file_url: { type: DataTypes.STRING },
    file_size: { type: DataTypes.STRING }, // Форматированный размер "2.4 МБ"
    
    // Версия
    version: { type: DataTypes.STRING, defaultValue: '1.0' },
    
    // Дата создания/обновления
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
    tableName: 'docs',
    timestamps: false,
    indexes: [
        { fields: ['training_type_id'] },
        { fields: ['category_id'] },
        { fields: ['status_id'] }
    ]
});

// Связи
DocTrainingType.hasMany(Doc, { foreignKey: 'training_type_id', as: 'docs' });
Doc.belongsTo(DocTrainingType, { foreignKey: 'training_type_id', as: 'training_type' });

DocCategory.hasMany(Doc, { foreignKey: 'category_id', as: 'docs' });
Doc.belongsTo(DocCategory, { foreignKey: 'category_id', as: 'category' });

DocStatus.hasMany(Doc, { foreignKey: 'status_id', as: 'docs' });
Doc.belongsTo(DocStatus, { foreignKey: 'status_id', as: 'status' });

module.exports = {
    DocTrainingType,
    DocCategory,
    DocStatus,
    Doc
};