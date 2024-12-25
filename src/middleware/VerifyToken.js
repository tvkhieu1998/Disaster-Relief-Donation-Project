const jwt = require('jsonwebtoken');
require('dotenv').config();
const { ApiError,
    HttpStatus } = require('../config/ApiError');
const VerifyToken = (req, res, next) => {
    const token = req.headers.authorization
    if (!token) {
        return res.status(HttpStatus.BAD_REQUEST).json({
            code: ApiError.API_ERROR_001_REQUEST_TOKEN.status,
            message: ApiError.API_ERROR_001_REQUEST_TOKEN.message
        })
    }
    const accessToken = token.split(' ')[1]
    jwt.verify(accessToken, process.env.SERVER_JSWTOKEN, (err, user) => {
        if (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: ApiError.API_ERROR_002_INVALID_TOKEN.status,
                message: ApiError.API_ERROR_002_INVALID_TOKEN.message
            })
        }

        req.user = user
        next()
    })
}

const CheckRole = (requiredRoles) => {
    return (req, res, next) => {
        const userRole = req.user?.roleId;

        if (!userRole || !requiredRoles.includes(userRole)) {
            return res.status(HttpStatus.FORBIDDEN).json({
                code: ApiError.API_ERROR_000_RESQUEST_FORBIDDEN.status,
                message: ApiError.API_ERROR_000_RESQUEST_FORBIDDEN.message,
            });
        }

        next();
    };
};

module.exports = { VerifyToken, CheckRole }