
const { Codes, Messages } = require('./httpCodesAndMessages');
class ResponseHandler {
    static sendSuccess(res, data, statusCode = Codes.OK , message = Messages.OK) {
        res.status(statusCode).json({
            success: true,
            status: statusCode,
            message: message,
            data: data,
        });
    }

    static sendError(res, error, statusCode = Codes.INTERNAL_SERVER_ERROR , message = Messages.INTERNAL_SERVER_ERROR) {
        res.status(statusCode).json({
            success: false,
            status: statusCode,
            message: message,
            error: error.message || error,
        });
    }
}

module.exports = ResponseHandler;
                
