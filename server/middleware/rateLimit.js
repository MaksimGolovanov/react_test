const rateLimit = require('express-rate-limit');
const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(format.timestamp(), format.json()),
    transports: [new transports.File({ filename: 'logs/auth.log' })],
});

module.exports = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 5, // максимум 5 попыток
    message: 'Слишком много попыток входа, попробуйте позже',
    handler: (req, res, next) => {
        logger.warn(`Too many login attempts for IP: ${req.ip}`);
        res.status(429).json({ message: 'Слишком много попыток входа, попробуйте позже' });
    },
});