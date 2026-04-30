// server/models/knowledgeModels.js
const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Категории (иерархические)
const Category = sequelize.define('klm_category', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'klm_categories', key: 'id' }
    }
}, {
    tableName: 'klm_categories',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Статьи
const Article = sequelize.define('klm_article', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    description: { type: DataTypes.STRING(500) },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'klm_categories', key: 'id' }
    },
    content_type: { type: DataTypes.STRING, defaultValue: 'Статья' }
}, {
    tableName: 'klm_articles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Теги
const Tag = sequelize.define('klm_tag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
    tableName: 'klm_tags',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Связующая таблица
const ArticleTag = sequelize.define('klm_article_tag', {
    article_id: {
        type: DataTypes.INTEGER,
        references: { model: 'klm_articles', key: 'id' },
        primaryKey: true
    },
    tag_id: {
        type: DataTypes.INTEGER,
        references: { model: 'klm_tags', key: 'id' },
        primaryKey: true
    }
}, {
    tableName: 'klm_article_tags',
    timestamps: false
});

// Иерархия категорий
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parent_id' });
Category.hasMany(Category, { as: 'children', foreignKey: 'parent_id' });

// Связи статей с категориями
Category.hasMany(Article, { foreignKey: 'category_id' });
Article.belongsTo(Category, { foreignKey: 'category_id' });

// Связи статей с тегами (многие-ко-многим)
Article.belongsToMany(Tag, { through: ArticleTag, foreignKey: 'article_id', otherKey: 'tag_id' });
Tag.belongsToMany(Article, { through: ArticleTag, foreignKey: 'tag_id', otherKey: 'article_id' });

module.exports = { Category, Article, Tag, ArticleTag };