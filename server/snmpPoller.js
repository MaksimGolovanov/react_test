require("dotenv").config();
const snmp = require("net-snmp"); // Изменили импорт
const { Prints, PrinterStatistics } = require("./models/models");
const { Op } = require("sequelize");

const PAGE_COUNT_OID = "1.3.6.1.2.1.43.10.2.1.4.1.1";

class SNMPPoller {
  constructor() {
    this.pollInterval = 4 * 60 * 60 * 1000; // 4 часа
  }

  async start() {
    
    await this.pollAllPrinters();
    setInterval(async () => {
      try {
        await this.pollAllPrinters();
      } catch (e) {
        console.error("Ошибка в периодическом опросе:", e);
      }
    }, this.pollInterval);
  }
  async pollAllPrinters() {
    const printers = await Prints.findAll({
      where: { ip: { [Op.not]: null } },
    });
    const results = await Promise.allSettled(
      printers.map((printer) => this.getPrinterPageCount(printer.ip)),
    );
    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (result.status === "fulfilled") {
        await this.savePrinterStats(printers[i].serial_number, result.value);
        
      } else {
        console.error(`Ошибка опроса ${printers[i].ip}:`, result.reason);
      }
    }
  }

  async getPrinterPageCount(ip, community = "public") {
    return new Promise((resolve, reject) => {
      const session = snmp.createSession(ip, community, {
        timeout: 5000,
        retries: 2,
      });
      session.get([PAGE_COUNT_OID], (error, varbinds) => {
        session.close();
        if (error) {
          reject(`SNMP error: ${error}`);
        } else if (!varbinds || varbinds.length === 0) {
          reject("No varbind returned");
        } else if (snmp.isVarbindError(varbinds[0])) {
          reject(snmp.varbindError(varbinds[0]));
        } else {
          resolve(varbinds[0].value);
        }
      });
    });
  }

  async savePrinterStats(itemid, value) {
    try {
      await PrinterStatistics.create({
        itemid,
        value,
        clock: Math.floor(Date.now() / 1000),
      });
    } catch (error) {
      //console.error('Ошибка при сохранении статистики:', error)
    }
  }
}

module.exports = new SNMPPoller();
