const { IP_addresses } = require('../models/models');
const ApiError = require('../error/ApiError');


class IpController {
    async getAll(req, res, next) {
        try {
            const ipAddresses = await IP_addresses.findAll();
            return res.json(ipAddresses);
        } catch (error) {
            return next(ApiError.internal('Ошибка при получении списка IP-адресов'));
        }
    }

    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('Ошибка валидации', errors.array()));
            }

            const { ip, device_type, network_segment, description, switch_port, switch: switchName } = req.body;
            
            // Проверка на существующий IP
            const existingIp = await IP_addresses.findOne({ where: { ip } });
            if (existingIp) {
                return next(ApiError.badRequest('IP-адрес уже существует'));
            }

            const ipAddress = await IP_addresses.create({
                ip, 
                device_type, 
                network_segment, 
                description,
                switch_port,
                switch: switchName
            });
            
            return res.json(ipAddress);
        } catch (error) {
            return next(ApiError.internal('Ошибка при создании IP-адреса'));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { ip, device_type, network_segment, description, switch_port, switch: switchName } = req.body;
            
            const ipAddress = await IP_addresses.findByPk(id);
            if (!ipAddress) {
                return next(ApiError.notFound('IP-адрес не найден'));
            }

            // Проверка на уникальность IP, если он изменен
            if (ip !== ipAddress.ip) {
                const existingIp = await IP_addresses.findOne({ where: { ip } });
                if (existingIp) {
                    return next(ApiError.badRequest('IP-адрес уже существует'));
                }
            }

            await ipAddress.update({
                ip, 
                device_type,
                switch_port,
                switch: switchName,
                network_segment, 
                description
            });
            
            return res.json(ipAddress);
        } catch (error) {
            return next(ApiError.internal('Ошибка при обновлении IP-адреса'));
        }
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const ipAddress = await IP_addresses.findByPk(id);
            if (!ipAddress) {
                return next(ApiError.notFound('IP-адрес не найден'));
            }

            await ipAddress.destroy();
            return res.json({ message: 'IP-адрес успешно удален' });
        } catch (error) {
            return next(ApiError.internal('Ошибка при удалении IP-адреса'));
        }
    }
}

module.exports = new IpController();