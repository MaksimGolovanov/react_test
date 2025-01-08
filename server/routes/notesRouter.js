const Router = require('express');
const router = new Router();
const NoteController = require('../controllers/NoteController.js');





router.post('/', NoteController.create);
router.get('/', NoteController.getAllPosts);
router.get('/:id', NoteController.getOnePost);
router.delete('/:id',NoteController.deleteNote)
router.put('/:id',NoteController.updatePost)


module.exports = router;