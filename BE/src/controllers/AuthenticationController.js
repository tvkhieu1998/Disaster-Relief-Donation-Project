const { registerService, loginService,
} = require('../services/AuthenticationService');

const { ApiError,
    HttpStatus } = require('../config/ApiError');

const register = async (req, res) => {
    try {
        const { name, email, password, phone, role_id, age, address } = req.body
        if (!email || !password) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: ApiError.API_ERROR_000_RESQUEST_ERROR.status,
                message: ApiError.API_ERROR_000_RESQUEST_ERROR.message
            })
        }
        const response = await registerService(req.body)
        return res.status(200).json({
            response: response
        })

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: ApiError.API_ERROR_000_RESQUEST_ERROR.status,
                message: ApiError.API_ERROR_000_RESQUEST_ERROR.message
            })
        }
        const response = await loginService(req.body)
        return res.status(200).json(response)

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message,
            error_log: error
        });
    }
};
module.exports = {
    register, login,
};