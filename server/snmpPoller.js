require('dotenv').config()
const snmp = require('net-snmp') // Изменили импорт
const { Prints, PrinterStatistics } = require('./models/models')
const { Op } = require('sequelize')

const PAGE_COUNT_OID = '1.3.6.1.2.1.43.10.2.1.4.1.1'

class SNMPPoller {
     constructor() {
          this.pollInterval = 4 * 60 * 60 * 1000 // 4 часа
     }

     async start() {
          console.log('SNMPPoller инициализирован')
          try {
               await this.pollAllPrinters()
               console.log('Первый опрос принтеров завершен')
               setInterval(() => {
                    console.log('Запуск периодического опроса принтеров')
                    this.pollAllPrinters().catch((e) => console.error('Ошибка в периодическом опросе:', e))
               }, this.pollInterval)
          } catch (e) {
               console.error('Ошибка при старте SNMPPoller:', e)
          }
     }
     async pollAllPrinters() {
          try {
               console.log('Начало опроса принтеров...')
               const printers = await Prints.findAll({
                    where: { ip: { [Op.not]: null } },
               })

               for (const printer of printers) {
                    try {
                         const pageCount = await this.getPrinterPageCount(printer.ip)
                         await this.savePrinterStats(printer.serial_number, pageCount)
                         console.log(`Принтер ${printer.ip} (${printer.serial_number}): ${pageCount} страниц`)
                    } catch (error) {
                         console.error(`Ошибка при опросе принтера ${printer.ip}:`, error)
                    }
               }
          } catch (error) {
               console.error('Ошибка в pollAllPrinters:', error)
          }
     }

     async getPrinterPageCount(ip, community = 'public') {
          return new Promise((resolve, reject) => {
               const session = snmp.createSession(ip, community) // Изменили создание сессии

               const oids = [PAGE_COUNT_OID]

               session.get(oids, (error, varbinds) => {
                    session.close()
                    if (error) {
                         reject(`SNMP error: ${error}`)
                    } else {
                         // Проверяем, что получили корректные данные
                         if (snmp.isVarbindError(varbinds[0])) {
                              reject(snmp.varbindError(varbinds[0]))
                         } else {
                              resolve(varbinds[0].value)
                         }
                    }
               })
          })
     }

     async savePrinterStats(itemid, value) {
          try {
               await PrinterStatistics.create({
                    itemid,
                    value,
                    clock: Math.floor(Date.now() / 1000),
               })
          } catch (error) {
               console.error('Ошибка при сохранении статистики:', error)
          }
     }
}

module.exports = new SNMPPoller()
