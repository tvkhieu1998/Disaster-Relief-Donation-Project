'use strict';

const { ApiError, HtttpStatus } = require('../config/ApiError');
const {
    getAllUserManagement,
    getUserManagementByKeyword,
    createUserManagement,
    updateUserManagement,
    deleteUserManagement
} = require('../services/UserManagementService');

const getUserManagement = async (req, res) => {
    try {
        const response = await getAllUserManagement();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const getUserManagementByKey = async (req, res) => {
    try {
        const { keyword } = req.query;
        const response = await getUserManagementByKeyword(keyword);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const createNewUserManagement = async (req, res) => {
    try {
        const data = req.body;
        const response = await createUserManagement(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const updateUserManagementByKey = async (req, res) => {
    try {
        const data = req.body;
        const response = await updateUserManagement(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const deleteUserManagementByKey = async (req, res) => {
    try {
        const data = req.body;
        const response = await deleteUserManagement(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

module.exports = {
    getUserManagement,
    getUserManagementByKey,
    createNewUserManagement,
    updateUserManagementByKey,
    deleteUserManagementByKey
};