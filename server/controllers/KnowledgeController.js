// server/controllers/KnowledgeController.js
const { Category, Article, Tag, ArticleTag } = require('../models/knowledgeModels')
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize')

class KnowledgeController {
     async getAllTags(req, res, next) {
          try {
               const tags = await Tag.findAll({ attributes: ['id', 'name', 'slug'] })
               return res.json(tags)
          } catch (e) {
               next(ApiError.badRequest(e.message))
          }
     }

     // ---------- Статьи ----------
     async getAllArticles(req, res, next) {
          try {
               const { category_id, search } = req.query
               const where = {}
               if (category_id) where.category_id = category_id

               let articles
               if (search) {
                    articles = await Article.findAll({
                         where: {
                              ...where,
                              [Op.or]: [
                                   { title: { [Op.iLike]: `%${search}%` } },
                                   { content: { [Op.iLike]: `%${search}%` } },
                                   { description: { [Op.iLike]: `%${search}%` } },
                              ],
                         },
                         include: [
                              { model: Category, attributes: ['id', 'name', 'slug'] },
                              { model: Tag, attributes: ['name'] },
                         ],
                    })
               } else {
                    articles = await Article.findAll({
                         where,
                         include: [
                              { model: Category, attributes: ['id', 'name', 'slug'] },
                              { model: Tag, attributes: ['name'] },
                         ],
                    })
               }

               // Преобразуем теги в массив строк
               const result = articles.map((article) => {
                    const a = article.toJSON()
                    // Поле с тегами может называться klm_tags, Tags или tags
                    const tagsArray = a.klm_tags || a.Tags || a.tags || []
                    a.tags = tagsArray.map((t) => t.name)
                    // Удаляем оригинальные поля с тегами, чтобы не мешали
                    delete a.klm_tags
                    delete a.Tags
                    delete a.klm_article_tag
                    return a
               })
               return res.json(result)
          } catch (e) {
               next(e)
          }
     }

     async getOneArticle(req, res, next) {
          try {
               const { id } = req.params
               const article = await Article.findByPk(id, {
                    include: [
                         {
                              model: Category,
                              attributes: ['id', 'name', 'slug', 'parent_id'],
                              include: [{ model: Category, as: 'parent', attributes: ['id', 'name', 'slug'] }],
                         },
                         { model: Tag, attributes: ['name'] },
                    ],
               })
               if (!article) {
                    return next(ApiError.badRequest('Статья не найдена'))
               }
               const a = article.toJSON()
               const tagsArray = a.klm_tags || a.Tags || a.tags || []
               a.tags = tagsArray.map((t) => t.name)
               delete a.klm_tags
               delete a.Tags
               delete a.klm_article_tag
               return res.json(a)
          } catch (e) {
               next(ApiError.badRequest(e.message))
          }
     }

     async createArticle(req, res, next) {
          try {
               const { title, content, description, category_id, content_type, tags } = req.body

               if (!title || title.trim() === '') {
                    return next(ApiError.badRequest('Заголовок не может быть пустым'))
               }
               if (!category_id) {
                    return next(ApiError.badRequest('Категория обязательна'))
               }
               const categoryExists = await Category.findByPk(category_id)
               if (!categoryExists) {
                    return next(ApiError.badRequest('Выбранная категория не существует'))
               }

               let baseSlug = title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')
               if (!baseSlug) baseSlug = 'article'
               let slug = baseSlug
               let counter = 1
               while (await Article.findOne({ where: { slug } })) {
                    slug = `${baseSlug}-${counter}`
                    counter++
               }

               const article = await Article.create({
                    title: title.trim(),
                    slug,
                    content: content || '',
                    description: description || '',
                    category_id,
                    content_type: content_type || 'Статья',
               })

               // Сохранение тегов и связей
               if (tags && Array.isArray(tags) && tags.length > 0) {
                    const tagInstances = []
                    for (const tagName of tags) {
                         let tag = await Tag.findOne({ where: { name: tagName } })
                         if (!tag) {
                              let tagSlug = tagName
                                   .toLowerCase()
                                   .replace(/[^a-z0-9]+/g, '-')
                                   .replace(/^-|-$/g, '')
                              if (!tagSlug) tagSlug = 'tag'
                              let existingTag = await Tag.findOne({ where: { slug: tagSlug } })
                              let tagCounter = 1
                              while (existingTag) {
                                   tagSlug = `${tagSlug}-${tagCounter}`
                                   existingTag = await Tag.findOne({ where: { slug: tagSlug } })
                                   tagCounter++
                              }
                              tag = await Tag.create({ name: tagName, slug: tagSlug })
                         }
                         tagInstances.push(tag)
                    }
                    const articleTagData = tagInstances.map((tag) => ({
                         article_id: article.id,
                         tag_id: tag.id,
                    }))
                    await ArticleTag.bulkCreate(articleTagData)
               }

               // Возвращаем созданную статью с тегами
               const created = await Article.findByPk(article.id, {
                    include: [
                         { model: Category, attributes: ['id', 'name', 'slug'] },
                         { model: Tag, attributes: ['name'] },
                    ],
               })
               const result = created.toJSON()
               const tagsArray = result.klm_tags || result.Tags || result.tags || []
               result.tags = tagsArray.map((t) => t.name)
               delete result.klm_tags
               delete result.Tags
               delete result.klm_article_tag
               return res.status(201).json(result)
          } catch (e) {
               console.error('Ошибка при создании статьи:', e)
               if (e.name === 'SequelizeUniqueConstraintError') {
                    return next(ApiError.badRequest('Статья с таким заголовком уже существует'))
               }
               next(ApiError.badRequest(e.message))
          }
     }

     async updateArticle(req, res, next) {
          try {
               const { id } = req.params
               const { title, content, description, category_id, content_type, tags } = req.body

               const article = await Article.findByPk(id)
               if (!article) {
                    return next(ApiError.badRequest('Статья не найдена'))
               }

               let updateData = { content, description, category_id, content_type }
               if (title && title.trim() !== '') {
                    updateData.title = title.trim()
                    let baseSlug = title
                         .toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/^-|-$/g, '')
                    if (!baseSlug) baseSlug = 'article'
                    let slug = baseSlug
                    let counter = 1
                    while (await Article.findOne({ where: { slug, id: { [Op.ne]: id } } })) {
                         slug = `${baseSlug}-${counter}`
                         counter++
                    }
                    updateData.slug = slug
               }
               await article.update(updateData)

               // Обновление тегов
               await ArticleTag.destroy({ where: { article_id: id } })
               if (tags && Array.isArray(tags) && tags.length > 0) {
                    const tagInstances = []
                    for (const tagName of tags) {
                         let tag = await Tag.findOne({ where: { name: tagName } })
                         if (!tag) {
                              let tagSlug = tagName
                                   .toLowerCase()
                                   .replace(/[^a-z0-9]+/g, '-')
                                   .replace(/^-|-$/g, '')
                              if (!tagSlug) tagSlug = 'tag'
                              let existingTag = await Tag.findOne({ where: { slug: tagSlug } })
                              let tagCounter = 1
                              while (existingTag) {
                                   tagSlug = `${tagSlug}-${tagCounter}`
                                   existingTag = await Tag.findOne({ where: { slug: tagSlug } })
                                   tagCounter++
                              }
                              tag = await Tag.create({ name: tagName, slug: tagSlug })
                         }
                         tagInstances.push(tag)
                    }
                    const articleTagData = tagInstances.map((tag) => ({
                         article_id: id,
                         tag_id: tag.id,
                    }))
                    await ArticleTag.bulkCreate(articleTagData)
               }

               const updated = await Article.findByPk(id, {
                    include: [
                         { model: Category, attributes: ['id', 'name', 'slug'] },
                         { model: Tag, attributes: ['name'] },
                    ],
               })
               const result = updated.toJSON()
               const tagsArray = result.klm_tags || result.Tags || result.tags || []
               result.tags = tagsArray.map((t) => t.name)
               delete result.klm_tags
               delete result.Tags
               delete result.klm_article_tag
               return res.json(result)
          } catch (e) {
               next(ApiError.badRequest(e.message))
          }
     }

     async deleteArticle(req, res, next) {
          try {
               const { id } = req.params
               const article = await Article.findByPk(id)
               if (!article) {
                    return next(ApiError.badRequest('Статья не найдена'))
               }
               await ArticleTag.destroy({ where: { article_id: id } })
               await article.destroy()
               return res.json({ message: 'Статья успешно удалена' })
          } catch (e) {
               next(ApiError.badRequest(e.message))
          }
     }

     // ---------- Категории ----------
     async getAllCategories(req, res, next) {
          try {
               const categories = await Category.findAll({
                    attributes: ['id', 'name', 'slug', 'description', 'parent_id', 'created_at', 'updated_at'],
               })
               return res.json(categories)
          } catch (e) {
               next(ApiError.badRequest(e.message))
          }
     }

     async createCategory(req, res, next) {
          try {
               const { name, description, parent_id } = req.body
               let slug = name
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-|-$/g, '')
               if (!slug) slug = 'category'
               let existing = await Category.findOne({ where: { slug } })
               let counter = 1
               while (existing) {
                    slug = `${slug}-${counter}`
                    existing = await Category.findOne({ where: { slug } })
                    counter++
               }
               const category = await Category.create({ name, slug, description, parent_id: parent_id || null })
               return res.json(category)
          } catch (e) {
               next(ApiError.badRequest(e.message))
          }
     }

     async updateCategory(req, res, next) {
          try {
               const { id } = req.params
               const { name, description, parent_id } = req.body
               const category = await Category.findByPk(id)
               if (!category) return next(ApiError.badRequest('Категория не найдена'))
               const updateData = { name, description, parent_id }
               if (name && name !== category.name) {
                    let slug = name
                         .toLowerCase()
                         .replace(/[^a-z0-9]+/g, '-')
                         .replace(/^-|-$/g, '')
                    if (!slug) slug = 'category'
                    let existing = await Category.findOne({ where: { slug, id: { [Op.ne]: id } } })
                    let counter = 1
                    while (existing) {
                         slug = `${slug}-${counter}`
                         existing = await Category.findOne({ where: { slug, id: { [Op.ne]: id } } })
                         counter++
                    }
                    updateData.slug = slug
               }
               await category.update(updateData)
               return res.json(category)
          } catch (e) {
               next(ApiError.badRequest(e.message))
          }
     }

     async deleteCategory(req, res, next) {
          try {
               const { id } = req.params
               const category = await Category.findByPk(id)
               if (!category) return next(ApiError.badRequest('Категория не найдена'))
               const childCount = await Category.count({ where: { parent_id: id } })
               const articleCount = await Article.count({ where: { category_id: id } })
               if (childCount > 0 || articleCount > 0) {
                    return next(ApiError.badRequest('Нельзя удалить категорию, у которой есть подкатегории или статьи'))
               }
               await category.destroy()
               return res.json({ message: 'Категория удалена' })
          } catch (e) {
               next(ApiError.badRequest(e.message))
          }
     }

     // ---------- Поиск ----------
     async searchArticles(req, res, next) {
          try {
               const { q } = req.query
               if (!q) return res.json([])
               const articles = await Article.findAll({
                    where: {
                         [Op.or]: [
                              { title: { [Op.iLike]: `%${q}%` } },
                              { content: { [Op.iLike]: `%${q}%` } },
                              { description: { [Op.iLike]: `%${q}%` } },
                         ],
                    },
                    include: [
                         { model: Category, attributes: ['id', 'name', 'slug'] },
                         { model: Tag, attributes: ['name'] },
                    ],
                    limit: 10,
               })
               const result = articles.map((article) => {
                    const a = article.toJSON()
                    const tagsArray = a.klm_tags || a.Tags || a.tags || []
                    a.tags = tagsArray.map((t) => t.name)
                    delete a.klm_tags
                    delete a.Tags
                    delete a.klm_article_tag
                    return a
               })
               return res.json(result)
          } catch (e) {
               next(ApiError.badRequest(e.message))
          }
     }
}

module.exports = new KnowledgeController()
