const { StopRole } = require('../../models/IusPtModels');
const ApiError = require('../../error/ApiError');

class IusStopRolesController {

    async getAll(req, res, next) {
        try {
            const stopRole = await StopRole.findAll();
            return res.json(stopRole);
        } catch (err) {
            next(ApiError.internal(err.message));
        }
    }



}

module.exports = new IusStopRolesController();