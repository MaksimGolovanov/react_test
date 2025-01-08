const { Post } = require('../models/models')
const ApiError = require('../error/ApiError')

class NoteController {

    async create(req, res, next) {
        try {
            const { title, body } = req.body
           

            const post = await Post.create({title, body })
            return res.json(post)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }


    }

    async updatePost(req, res, next) {
        try {
          const { id } = req.params;
          const { title, body } = req.body;
      
          const post = await Post.findByPk(id); // Найти пост по ID
      
          if (!post) {
            return next(new Error('Пост не найден'));
          }
      
          await post.update({ title, body }); // Обновить данные поста
      
          return res.json(post);
        } catch (error) {
          console.error(error);
          next(error);
        }
      }

    async deleteNote(req, res, next) {
        const { id } = req.params;
        const staff = await Post.findByPk(id);
    
        if (!staff) {
          return res.status(404).json({ message: 'Запись не найдена.' });
        }
    
        try {
          await staff.destroy();
          return res.json({ message: 'Запись успешно удалена.' });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Произошла ошибка при удалении записи.' });
        }
      }

    async getAllPosts(req, res) {
        const posts = await Post.findAll()
        return res.json(posts)
    }
    async getOnePost(req, res) {
        const { id } = req.params;
        try {
            const post = await Post.findOne({ where: { id: id } })
            return res.json(post);
        } catch (error) {
            console.error('Ошибка при получении списка принтеров:', error);
            return res.status(500).json({ message: 'Ошибка при получении списка принтеров' });
        }
    }

}

module.exports = new NoteController();