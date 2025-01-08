const uuid = require('uuid')
const path = require('path')
const { PrintsModel } = require('../models/models')
const ApiError = require('../error/ApiError')

class PrintModel {

    async create(req, res, next) {
        try {
            const { name, cartridge, paper_size, scanner } = req.body
            const { img1, img2, img3 } = req.files
            let filename1 = uuid.v4() + ".jpg"
            let filename2 = uuid.v4() + ".jpg"
            let filename3 = uuid.v4() + ".jpg"
            img1.mv(path.resolve(__dirname, '..', 'static', filename1))
            img2.mv(path.resolve(__dirname, '..', 'static', filename2))
            img3.mv(path.resolve(__dirname, '..', 'static', filename3))

            const print = await PrintsModel.create({ name, cartridge, paper_size, scanner, img1: filename1, img2: filename2, img3: filename3 })
            return res.json(print)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }


    }



    async delete(req, res, next) {
        try {
            const { id } = req.params
            if (!id) {
                return next(ApiError.badRequest('Не указан ID'))
            }

            // Находим модель
            const print = await PrintsModel.findOne({ where: { id } })
            if (!print) {
                return next(ApiError.notFound('Модель не найдена'))
            }

            // Удаляем файлы
            const staticPath = path.resolve(__dirname, '..', 'static')
            try {
                if (print.img1) {
                    fs.unlinkSync(path.join(staticPath, print.img1))
                }
                if (print.img2) {
                    fs.unlinkSync(path.join(staticPath, print.img2))
                }
                if (print.img3) {
                    fs.unlinkSync(path.join(staticPath, print.img3))
                }
            } catch (error) {
                console.error('Ошибка при удалении файлов:', error)
                // Продолжаем удаление записи даже если файлы не удалились
            }

            // Удаляем запись из базы
            await PrintsModel.destroy({ where: { id } })

            return res.json({ message: 'Модель успешно удалена' })
        } catch (e) {
            next(ApiError.internal('Ошибка при удалении модели'))
        }
    }



    async getAll(req, res) {
        const printsModels = await PrintsModel.findAll()
        return res.json(printsModels)

    }
    async getOne(req, res) {


    }




}
module.exports = new PrintModel()