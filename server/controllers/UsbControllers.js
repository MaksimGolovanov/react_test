const { Usb } = require('../models/models')
const ApiError = require('../error/ApiError')

class UsbController {
     async getAll(req, res, next) {
          try {
               const usb = await Usb.findAll()
               return res.json(usb)
          } catch (error) {
               return next(ApiError.internal('Ошибка при получении списка USB-накопителей'))
          }
     }

     async create(req, res, next) {
          try {
               

               const { num_form, ser_num, volume, data_uch, email, fio, department, data_prov, log } = req.body

               // Проверка на существующий USB с таким же номером
               const existingUsb = await Usb.findOne({ where: { num_form } })
               if (existingUsb) {
                    return next(ApiError.badRequest('USB с таким регистрационным номером уже существует'))
               }

               // Преобразование дат
               const formattedData = {
                    num_form,
                    ser_num,
                    volume,
                    email,
                    fio,
                    department,
                    log,
                    data_uch: data_uch ? new Date(data_uch) : null,
                    data_prov: data_prov ? new Date(data_prov) : null,
               }

               const usb = await Usb.create(formattedData)
               return res.json(usb)
          } catch (error) {
               return next(ApiError.internal('Ошибка при создании USB-накопителя: ' + error.message))
          }
     }

     async update(req, res, next) {
          try {
              

               const { id } = req.params
               const { num_form, ser_num, volume, data_uch, email, fio, department, data_prov, log } = req.body

               const usb = await Usb.findByPk(id)
               if (!usb) {
                    return next(ApiError.notFound('USB-накопитель не найден'))
               }

               // Проверка, что новый num_form не занят другим USB
               if (num_form && num_form !== usb.num_form) {
                    const existingUsb = await Usb.findOne({ where: { num_form } })
                    if (existingUsb) {
                         return next(ApiError.badRequest('USB с таким регистрационным номером уже существует'))
                    }
               }

               // Преобразование дат
               const updateData = {
                    num_form,
                    ser_num,
                    volume,
                    email,
                    fio,
                    department,
                    log,
                    data_uch: data_uch ? new Date(data_uch) : usb.data_uch,
                    data_prov: data_prov ? new Date(data_prov) : usb.data_prov,
               }

               await usb.update(updateData)
               return res.json(usb)
          } catch (error) {
               return next(ApiError.internal('Ошибка при обновлении USB-накопителя: ' + error.message))
          }
     }

     async delete(req, res, next) {
          try {
               const { id } = req.params
               const usb = await Usb.findByPk(id)
               if (!usb) {
                    return next(ApiError.notFound('USB-накопитель не найден'))
               }

               await usb.destroy()
               return res.json({ message: 'USB-накопитель успешно удален' })
          } catch (error) {
               return next(ApiError.internal('Ошибка при удалении USB-накопителя: ' + error.message))
          }
     }
     async sendReminders(req, res, next) {
          try {
               // Получаем все USB-накопители
               const usbs = await Usb.findAll()

               // Фильтруем те, которым нужно отправить уведомление
               const usbsToNotify = usbs.filter((usb) => {
                    if (!usb.data_prov || !usb.email || (usb.log && usb.log.toLowerCase() === 'нет')) return false

                    const nextCheckDate = new Date(usb.data_prov)
                    nextCheckDate.setDate(nextCheckDate.getDate() + 90)
                    const now = new Date()

                    // Отправляем уведомление, если до проверки осталось меньше 7 дней или она просрочена
                    const daysDiff = Math.floor((nextCheckDate - now) / (1000 * 60 * 60 * 24))
                    return daysDiff <= 7
               })

               if (usbsToNotify.length === 0) {
                    return res.json({ message: 'Нет USB-накопителей, требующих уведомления о проверке' })
               }

               // Настройка транспортера для отправки почты
               const transporter = nodemailer.createTransport({
                    host: process.env.EMAIL_SERVER_HOST,
                    port: process.env.EMAIL_SERVER_PORT,
                    secure: true,
                    auth: {
                         user: process.env.EMAIL_SERVER_USER,
                         pass: process.env.EMAIL_SERVER_PASSWORD,
                    },
               })

               // Функция для форматирования даты
               const formatDate = (dateString) => {
                    if (!dateString) return ''
                    const date = new Date(dateString)
                    if (isNaN(date.getTime())) return dateString

                    const day = date.getDate().toString().padStart(2, '0')
                    const month = (date.getMonth() + 1).toString().padStart(2, '0')
                    const year = date.getFullYear()

                    return `${day}.${month}.${year}`
               }

               // Отправка уведомлений
               const sendResults = await Promise.allSettled(
                    usbsToNotify.map(async (usb) => {
                         const nextCheckDate = new Date(usb.data_prov)
                         nextCheckDate.setDate(nextCheckDate.getDate() + 90)

                         const emailHtml = `
                        <h1>Уведомление о проверке USB-накопителя</h1>
                        <p>Уважаемый(ая) ${
                             usb.fio || 'пользователь'
                        }, срок проверки вашего USB-накопителя подходит к концу.</p>
                        
                        <h3>Информация о носителе:</h3>
                        <ul>
                            <li>Рег. номер: ${usb.num_form || 'не указан'}</li>
                            <li>Серийный номер: ${usb.ser_num || 'не указан'}</li>
                            <li>Объем: ${usb.volume || 'не указан'} ГБ</li>
                            <li>Дата последней проверки: ${formatDate(usb.data_prov) || 'не указана'}</li>
                            <li><strong>Дата следующей проверки: ${formatDate(nextCheckDate)}</strong></li>
                        </ul>
                        
                        <p>Пожалуйста, предоставьте ваш USB-накопитель для проверки в группу АСУ ПХД (Здание АБК).</p>
                        
                        <p><em>Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.</em></p>
                    `

                         await transporter.sendMail({
                              from: `"Группа АСУ ПХД" <${process.env.EMAIL_FROM}>`,
                              to: usb.email,
                              subject: 'Напоминание о проверке USB-накопителя',
                              html: emailHtml,
                         })

                         return { email: usb.email, status: 'success' }
                    })
               )

               const successful = sendResults.filter((r) => r.status === 'fulfilled').length
               const failed = sendResults.filter((r) => r.status === 'rejected').length

               return res.json({
                    message: `Уведомления отправлены`,
                    details: {
                         total: usbsToNotify.length,
                         successful,
                         failed,
                         failedEmails: sendResults
                              .filter((r) => r.status === 'rejected')
                              .map((r) => r.reason.config.to),
                    },
               })
          } catch (e) {
               next(ApiError.internal('Ошибка при отправке уведомлений'))
          }
     }
}

module.exports = new UsbController()
