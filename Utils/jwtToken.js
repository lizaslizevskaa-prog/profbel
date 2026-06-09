'use strict'
// jwtHelper.js
const jwt = require('jsonwebtoken');
const ResponseHandler = require('./responseHandler');
const { Codes, Messages } = require('./httpCodesAndMessages');

// Secret key for signing tokens
const SECRET_KEY = process.env.JWT_SECRET || 'X~7W@**TsZ=@}XT/"Z<bo7oDY8gtD(';

class JWTHelper {
    /**
     * Create a new JWT token
     * @param {Object} payload - The payload to include in the token
     * @param {Object} options - Options for token creation, such as 'expiresIn'
     * @returns {String} - The created JWT token
     */
    static createToken(payload, options = {}) {
        const tokenOptions = {};
        if (options.expiresIn) {
            tokenOptions.expiresIn = options.expiresIn;
        }
        return jwt.sign(payload, SECRET_KEY, tokenOptions);
    }

    /**
     * Validate a JWT token
     * @param {String} token - The token to validate
     * @returns {Object} - The decoded token if valid, or an error if invalid
     */
    static validateToken(token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            return { valid: true, decoded };
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return { valid: false, error: 'Token has expired' };
            }
            return { valid: false, error: error.message };
        }
    }

    /**
     * Middleware to validate JWT token in requests
     * @param {Object} req - The request object
     * @param {Object} res - The response object
     * @param {Function} next - The next middleware function
     */
    static tokenMiddleware(req, res, next) {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return ResponseHandler.sendError(res, 'No token provided', Codes.UNAUTHORIZED, Messages.UNAUTHORIZED);
        }

        const { valid, decoded, error } = JWTHelper.validateToken(token);
        if (valid) {
            req.user = decoded; // Attach the decoded payload to the request object
            next();
        } else {
            if (error === 'Token has expired') {
                return ResponseHandler.sendError(res, 'Token has expired', Codes.UNAUTHORIZED, Messages.UNAUTHORIZED);
            }
            return ResponseHandler.sendError(res, 'Invalid token', Codes.UNAUTHORIZED, Messages.UNAUTHORIZED);
        }
    }
}

module.exports = JWTHelper;
            
            