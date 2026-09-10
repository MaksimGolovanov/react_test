const { spawn } = require('child_process');
const ApiError = require('../error/ApiError');

class AdController {
    async checkPasswordExpiry(req, res, next) {
        const { adminUsername, adminPassword, targetUsername } = req.body;

        if (!adminUsername || !adminPassword || !targetUsername) {
            return next(ApiError.badRequest('Необходимо указать логин, пароль администратора и целевого пользователя'));
        }

        const server = process.env.AD_SERVER || 'dc1-adm';

        const args = [
            '-U', `${adminUsername}%${adminPassword}`,
            '-c', `queryuser ${targetUsername}`,
            server
        ];

        const child = spawn('rpcclient', args);

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', (err) => {
            console.error('Ошибка запуска rpcclient:', err);
            return next(ApiError.internal('Не удалось запустить rpcclient. Убедитесь, что он установлен.'));
        });

        child.on('close', (code) => {
            if (code !== 0) {
                if (stderr.includes('NT_STATUS_LOGON_FAILURE')) {
                    return next(ApiError.unauthorized('Неверный логин или пароль администратора'));
                } else if (stderr.includes('NT_STATUS_NO_SUCH_USER')) {
                    return next(ApiError.badRequest(`Пользователь '${targetUsername}' не найден в домене`));
                } else {
                    return next(ApiError.internal('Ошибка выполнения запроса: ' + (stderr || 'неизвестная ошибка')));
                }
            }

            const result = {
                targetUser: targetUsername,
                fullName: '',
                passwordLastSet: null,
                passwordMustChange: null,
                raw: stdout,
            };

            const lines = stdout.split('\n');
            lines.forEach(line => {
                if (line.includes('User Name')) {
                    const parts = line.split(':');
                    if (parts.length > 1) result.fullName = parts[1].trim();
                }
                if (line.includes('Full Name')) {
                    const parts = line.split(':');
                    if (parts.length > 1) result.fullName = parts[1].trim();
                }
                if (line.includes('Password last set Time')) {
                    const parts = line.split(':');
                    if (parts.length > 1) {
                        const timeStr = parts.slice(1).join(':').trim();
                        const parsed = parseADDate(timeStr);
                        if (parsed) result.passwordLastSet = parsed.toISOString();
                    }
                }
                if (line.includes('Password must change Time')) {
                    const parts = line.split(':');
                    if (parts.length > 1) {
                        const timeStr = parts.slice(1).join(':').trim();
                        const parsed = parseADDate(timeStr);
                        if (parsed) result.passwordMustChange = parsed.toISOString();
                    }
                }
            });

            res.json(result);
        });
    }
}

// Исправленная функция парсинга дат
function parseADDate(dateStr) {
    const trimmed = dateStr.trim();
    const parts = trimmed.split(',');
    if (parts.length < 2) return null;
    const datePart = parts[1].trim(); // "12 мая 2026 10:22:46 MSK"
    const tokens = datePart.split(' ');
    if (tokens.length < 5) return null;
    const day = parseInt(tokens[0], 10);
    const monthName = tokens[1];
    const year = parseInt(tokens[2], 10);
    const time = tokens[3]; // "10:22:46"
    const months = {
        'янв': 0, 'фев': 1, 'мар': 2, 'апр': 3, 'мая': 4, 'июн': 5,
        'июл': 6, 'авг': 7, 'сен': 8, 'окт': 9, 'ноя': 10, 'дек': 11
    };
    const month = months[monthName.toLowerCase()];
    if (month === undefined) return null;
    const date = new Date(`${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}T${time}+03:00`);
    return isNaN(date) ? null : date;
}

module.exports = new AdController();