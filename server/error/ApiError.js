class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status;
        this.message = message;
    }
    static badRequest(message) {
        return new ApiError(400, message);   // ← 400 вместо 404
    }
    static internal(message) {
        return new ApiError(500, message);
    }
    static forbidden(message) {
        return new ApiError(403, message);
    }
}

module.exports = ApiError;