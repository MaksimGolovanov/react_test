const { Prints, PrintsModel, Department, Location, PrinterStatistics } = require('../models/models')
const ApiError = require('../error/ApiError')

class PrintController {

    async create(req, res, next) {
        try {
            console.log('Получены данные:', req.body); // Логируем входящие данные

            const {
                print_model,
                logical_name,
                ip,
                url,
                department,
                location,
                serial_number,
                status,
                description
            } = req.body;



            // Создаем новый принтер
            const printData = {
                print_model: print_model,
                logical_name: logical_name || null,
                ip: ip,
                url: url || null,
                department: department,
                location: location || null,
                serial_number: serial_number || null,
                status: Number(status) || null,
                description: description || null,
            };

            console.log('Данные для создания принтера:', printData); // Логируем данные перед созданием

            const print = await Prints.create(printData);

            console.log('Принтер создан:', print); // Логируем созданный принтер

            // Устанавливаем связь между принтером и моделью
            try {
                await print.addPrintsModel(printModel);
                console.log('Связь установлена успешно');
            } catch (error) {
                console.error('Ошибка при установке связи:', error);
                // Продолжаем выполнение, даже если связь не установилась
            }

            // Получаем обновленные данные
            const fullPrint = await Prints.findOne({
                where: { id: print.id },
                include: [{
                    model: PrintsModel,
                    through: { attributes: [] }
                }]
            });

            return res.json(fullPrint);

        } catch (error) {
            console.error('Ошибка при создании принтера:', error);
            return next(ApiError.internal(`Произошла ошибка при создании принтера: ${error.message}`));
        }
    }


    async delete(req, res) {
        const { id } = req.params
        await Location.destroy({ where: { id } })

        return res.json({ message: 'Модель успешно удалена' })
    }

    async deletePrint(req, res) {
        const { id } = req.params
        await Prints.destroy({ where: { id } })

        return res.json({ message: 'Модель успешно удалена' })
    }

    async getAllDepartment(req, res) {
        const department = await Department.findAll()
        return res.json(department)
    }
    async getAllLocation(req, res) {
        const department = await Location.findAll()
        return res.json(department)
    }
    async createLocation(req, res, next) {
        try {
            const { location } = req.body;
            console.log(location)
            const createdLocation = await Location.create({ location });
            return res.status(201).json(createdLocation);
        } catch (error) {
            console.error('Ошибка при создании локации:', error);
            return res.status(500).send(error.message);
        }
    }

    async update(req, res) {
        const printData = req.body;
        console.log(printData.status)
    
        try {
            const updatedPrinter = await Prints.update({
                print_model: printData.print_model,
                logical_name: printData.logical_name,
                ip: printData.ip,
                url: printData.url,
                department: printData.department,
                location: printData.location,
                serial_number: printData.serial_number,
                status: printData.status,
                description: printData.description
            }, {
                where: { id: printData.id }
            });
    
            if (updatedPrinter[0] === 0) {
                return res.status(404).json({ message: 'Принтер с таким идентификатором не найден' });
            }
    
            res.status(200).json({ message: 'Принтер успешно обновлён' });
        } catch (error) {
            console.error('Ошибка при обработке запроса:', error);
            res.status(500).send({ message: 'Произошла ошибка при обновлении принтера' });
        }
    }



    async getOne(req, res) {
        const { id } = req.params;
        console.log(id + ' PrintController')
        try {
            const printer = await Prints.findOne({ where: { id: id } })
            return res.json(printer);
        } catch (error) {
            console.error('Ошибка при получении списка принтеров:', error);
            return res.status(500).json({ message: 'Ошибка при получении списка принтеров' });
        }
    }

    async getAll(req, res) {
        try {
            const prints = await Prints.findAll({
                include: [{
                    model: PrintsModel,
                    through: { attributes: [] },
                    attributes: ['name', 'cartridge', 'paper_size', 'scanner', 'img1', 'img2', 'img3']
                }]
            });
            return res.json(prints);
        } catch (error) {
            console.error('Ошибка при получении списка принтеров:', error);
            return res.status(500).json({ message: 'Ошибка при получении списка принтеров' });
        }
    }

    async getStatistics(req, res) {
        const { itemid } = req.params;
        try {
            const printerStat = await PrinterStatistics.findAll({ where: { itemid } })
            return res.json(printerStat)
        } catch (error) {
            console.error('Ошибка при получении статистики:', error);
        }
    }

    async getPrinterPageCount(req, res) {
        const { id } = req.params;
        try {
            const printer = await Prints.findOne({ where: { id } });
            if (!printer) {
                return res.status(404).json({ message: 'Принтер не найден' });
            }
    
            const snmp = require('snmp');
            const PAGE_COUNT_OID = '1.3.6.1.2.1.43.10.2.1.4.1.1';
            
            const pageCount = await new Promise((resolve, reject) => {
                const session = new snmp.Session({ 
                    host: printer.ip, 
                    community: 'public' 
                });
                
                session.get({ oid: PAGE_COUNT_OID }, (error, varbind) => {
                    session.close();
                    if (error) {
                        reject(`SNMP error: ${error}`);
                    } else {
                        resolve(varbind.value);
                    }
                });
            });
    
            // Сохраняем результат в базу
            await PrinterStatistics.create({
                itemid: printer.serial_number,
                value: pageCount,
                clock: Math.floor(Date.now() / 1000)
            });
    
            return res.json({ 
                printerId: printer.id,
                pageCount,
                message: 'Данные успешно получены и сохранены'
            });
        } catch (error) {
            console.error('Ошибка при получении счетчика страниц:', error);
            return res.status(500).json({ 
                error: 'Ошибка при получении счетчика страниц',
                details: error.toString() 
            });
        }
    }

}

module.exports = new PrintController();