require('dotenv').config();
const snmp = require('snmp');
const { Prints, PrinterStatistics } = require('./models/models');
const { Op } = require('sequelize');

// OID для счетчика отпечатанных страниц (может отличаться для разных моделей)
const PAGE_COUNT_OID = '1.3.6.1.2.1.43.10.2.1.4.1.1';

class SNMPPoller {
    constructor() {
        this.pollInterval = 4 * 60 * 60 * 1000; // 4 часа
    }

    async start() {
        await this.pollAllPrinters();
        setInterval(() => this.pollAllPrinters(), this.pollInterval);
    }

    async pollAllPrinters() {
        try {
            console.log('Начало опроса принтеров...');
            const printers = await Prints.findAll({
                where: { ip: { [Op.not]: null } }
            });

            for (const printer of printers) {
                try {
                    const pageCount = await this.getPrinterPageCount(printer.ip);
                    await this.savePrinterStats(printer.serial_number, pageCount);
                    console.log(`Принтер ${printer.ip} (${printer.serial_number}): ${pageCount} страниц`);
                } catch (error) {
                    console.error(`Ошибка при опросе принтера ${printer.ip}:`, error);
                }
            }
        } catch (error) {
            console.error('Ошибка в pollAllPrinters:', error);
        }
    }

    async getPrinterPageCount(ip, community = 'public') {
        return new Promise((resolve, reject) => {
            const session = new snmp.Session({ host: ip, community });
            
            session.get({ oid: PAGE_COUNT_OID }, (error, varbind) => {
                session.close();
                if (error) {
                    reject(`SNMP error: ${error}`);
                } else {
                    resolve(varbind.value);
                }
            });
        });
    }

    async savePrinterStats(itemid, value) {
        try {
            await PrinterStatistics.create({
                itemid,
                value,
                clock: Math.floor(Date.now() / 1000) // Текущее время в Unix timestamp
            });
        } catch (error) {
            console.error('Ошибка при сохранении статистики:', error);
        }
    }
}

module.exports = new SNMPPoller();