const { Usb } = require('../models/models')
const ApiError = require('../error/ApiError')
const nodemailer = require('nodemailer')

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
               console.log('🟡 Начало отправки уведомлений...')

               // ДОБАВЬТЕ ЭТУ ФУНКЦИЮ В КОНТРОЛЛЕР
               const formatDate = (dateString) => {
                    if (!dateString) return ''
                    const date = new Date(dateString)
                    if (isNaN(date.getTime())) return dateString

                    const day = date.getDate().toString().padStart(2, '0')
                    const month = (date.getMonth() + 1).toString().padStart(2, '0')
                    const year = date.getFullYear()

                    return `${day}.${month}.${year}`
               }

               // Получаем все USB-накопители
               const usbs = await Usb.findAll()
               console.log(`Всего USB в базе: ${usbs.length}`)

               // Фильтруем те, которым нужно отправить уведомление
               const usbsToNotify = usbs.filter((usb) => {
                    if (!usb.data_prov || !usb.email || (usb.log && usb.log.toLowerCase() === 'нет')) {
                         console.log(
                              `USB ${usb.id} исключен: data_prov=${usb.data_prov}, email=${usb.email}, log=${usb.log}`
                         )
                         return false
                    }

                    const nextCheckDate = new Date(usb.data_prov)
                    nextCheckDate.setDate(nextCheckDate.getDate() + 90)
                    const now = new Date()
                    const daysDiff = Math.floor((nextCheckDate - now) / (1000 * 60 * 60 * 24))

                    const shouldNotify = daysDiff <= 7
                    console.log(`USB ${usb.id}: daysDiff=${daysDiff}, notify=${shouldNotify}`)

                    return shouldNotify
               })

               console.log(`Найдено USB для уведомления: ${usbsToNotify.length}`)
               console.log(
                    'Список для уведомления:',
                    usbsToNotify.map((u) => ({ id: u.id, email: u.email, fio: u.fio }))
               )

               if (usbsToNotify.length === 0) {
                    console.log('🟠 Нет USB для уведомления')
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
                    tls: {
                         rejectUnauthorized: false,
                    },
               })

               // Отправка уведомлений
               const sendResults = await Promise.allSettled(
                    usbsToNotify.map(async (usb) => {
                         try {
                              console.log(`🟡 Отправка письма на: ${usb.email}`)

                              const nextCheckDate = new Date(usb.data_prov)
                              nextCheckDate.setDate(nextCheckDate.getDate() + 90)

                              // ИСПРАВЛЕННЫЙ HTML ШАБЛОН
                              const emailHtml = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <style>
                            body { font-family: Arial, sans-serif; color: #333; }
                            .header { background: #f8f9fa; padding: 20px; text-align: center; }
                            .content { padding: 20px; }
                            .info { background: #e9ecef; padding: 15px; border-radius: 5px; }
                            .footer { margin-top: 20px; padding: 15px; background: #f8f9fa; font-size: 12px; color: #6c757d; }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>Уведомление о проверке USB-накопителя</h1>
                        </div>
                        <div class="content">
                            <p>Уважаемый(ая) ${usb.fio || 'пользователь'},</p>
                            <p>Срок проверки вашего USB-накопителя подходит к концу.</p>
                            
                            <div class="info">
                                <h3>Информация о носителе:</h3>
                                <ul>
                                    <li><strong>Рег. номер:</strong> ${usb.num_form || 'не указан'}</li>
                                    <li><strong>Серийный номер:</strong> ${usb.ser_num || 'не указан'}</li>
                                    <li><strong>Объем:</strong> ${usb.volume || 'не указан'} ГБ</li>
                                    <li><strong>Дата последней проверки:</strong> ${
                                         formatDate(usb.data_prov) || 'не указана'
                                    }</li>
                                    <li><strong>Дата следующей проверки:</strong> ${formatDate(nextCheckDate)}</li>
                                </ul>
                            </div>
                            
                            <p><strong>Пожалуйста, предоставьте ваш USB-накопитель для проверки в группу АСУ ПХД (Здание АБК).</strong></p>
                        </div>
                        <div class="footer">
                            <p><em>Это автоматическое уведомление. Пожалуйста, не отвечайте на это письмо.</em></p>
                        </div>
                    </body>
                    </html>
                    `

                              const mailOptions = {
                                   from: `"Группа АСУ ПХД" <${process.env.EMAIL_FROM}>`,
                                   to: usb.email,
                                   subject: 'Напоминание о проверке USB-накопителя',
                                   html: emailHtml,
                              }

                              const result = await transporter.sendMail(mailOptions)
                              console.log(`✅ Письмо отправлено на: ${usb.email}, messageId: ${result.messageId}`)

                              return { email: usb.email, status: 'success', messageId: result.messageId }
                         } catch (emailError) {
                              console.error(`❌ Ошибка отправки на ${usb.email}:`, emailError.message)
                              return { email: usb.email, status: 'error', error: emailError.message }
                         }
                    })
               )

               const successful = sendResults.filter(
                    (r) => r.status === 'fulfilled' && r.value.status === 'success'
               ).length
               const failed = sendResults.filter(
                    (r) => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.status === 'error')
               ).length

               const failedEmails = sendResults
                    .filter((r) => r.status === 'rejected' || (r.status === 'fulfilled' && r.value.status === 'error'))
                    .map((r) => {
                         if (r.status === 'rejected') {
                              return r.reason?.value?.email || 'unknown'
                         }
                         return r.value.email
                    })

               console.log(`📊 Итоги отправки: успешно=${successful}, ошибок=${failed}`)

               if (failedEmails.length > 0) {
                    console.log('❌ Ошибки отправки:', failedEmails)
               }

               return res.json({
                    message: `Уведомления отправлены`,
                    details: {
                         total: usbsToNotify.length,
                         successful,
                         failed,
                         failedEmails,
                    },
               })
          } catch (e) {
               console.error('❌ Общая ошибка в sendReminders:', e)
               next(ApiError.internal('Ошибка при отправке уведомлений: ' + e.message))
          }
     }
}

module.exports = new UsbController()
