// server/routes/knowledgeRoutes.js
const Router = require('express');
const router = new Router();
const KnowledgeController = require('../controllers/KnowledgeController');

// Статьи
router.get('/articles', KnowledgeController.getAllArticles);          // GET /api/knowledge/articles?category_id=&search=
router.get('/articles/:id', KnowledgeController.getOneArticle);       // GET /api/knowledge/articles/:id
router.post('/articles', KnowledgeController.createArticle);          // POST /api/knowledge/articles
router.put('/articles/:id', KnowledgeController.updateArticle);       // PUT /api/knowledge/articles/:id
router.delete('/articles/:id', KnowledgeController.deleteArticle);    // DELETE /api/knowledge/articles/:id

// Категории
router.get('/categories', KnowledgeController.getAllCategories);      // GET /api/knowledge/categories
router.post('/categories', KnowledgeController.createCategory);       // POST /api/knowledge/categories
router.put('/categories/:id', KnowledgeController.updateCategory);    // PUT /api/knowledge/categories/:id
router.delete('/categories/:id', KnowledgeController.deleteCategory); // DELETE /api/knowledge/categories/:id

// Поиск
router.get('/search', KnowledgeController.searchArticles);            // GET /api/knowledge/search?q=query

router.get('/tags', KnowledgeController.getAllTags)


module.exports = router;