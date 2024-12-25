const { getAccountsService, getAccountService, createAccountService, updateAccountService, deleteAccountService
} = require('../services/AccountManagerService');
const { ApiError,
    HttpStatus } = require('../config/ApiError');

const getAccounts = async (req, res) => {
    try {
        const { search_keyword, pageIndex } = req.query;
        const response = await getAccountsService(search_keyword, pageIndex)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};


const getAccount = async (req, res) => {
    try {
        const { search_keyword } = req.query;
        const response = await getAccountService(search_keyword)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};
const createAccount = async (req, res) => {
    try {
        const { cccd, name, email, password, phoneNumber, roleId, age, address } = req.body;
        if (!cccd || !name || !email || !password || !phoneNumber || !roleId || !age || !address) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: ApiError.API_ERROR_000_RESQUEST_ERROR.status,
                message: ApiError.API_ERROR_000_RESQUEST_ERROR.message
            })
        }
        const response = await createAccountService(req.body);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};
const updateAccount = async (req, res) => {
    try {
        const { cccd, name, email, password, phoneNumber, roleId, age, address, isActive } = req.body;
        const response = await updateAccountService({
            cccd,
            name,
            email,
            password,
            phoneNumber,
            roleId,
            age,
            address,
            isActive
        })
        return res.status(200).json(response);
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}
const deleteAccount = async (req, res) => {
    try {
        const { cccd, confirmation } = req.body;
        const response = await deleteAccountService({ cccd, confirmation });
        return res.status(200).json(response);
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}
module.exports = {
    getAccounts, getAccount, updateAccount, deleteAccount, createAccount
};
