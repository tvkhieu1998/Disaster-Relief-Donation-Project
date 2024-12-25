'use strict'

const { ApiError, HttpStatus } = require('../config/ApiError');
const { getAllCharityOrgManagement,
    getCharityOrgManagementByKeyword, 
    createCharityOrgManagement,
    updateCharityOrgManagement,
    deleteCharityOrgManagement} =require('../services/CharityOrgManagementService');


// get all charity organizations management
const getCharityOrgManagements = async (req, res) => {
    try {
        const response = await getAllCharityOrgManagement();
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

// get charity organization management by keyword
const getCharityOrgManagement = async (req, res) => {
    try {
        const { keyword } = req.query;
        const response = await getCharityOrgManagementByKeyword(keyword);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

// create a new charity organization management
const createCharityOrgManagements = async (req, res) => {
    try {
        const data = req.body;
        const response = await createCharityOrgManagement(data);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const updateCharityOrgManagements = async (req, res) => {
    try {
        const { keyword } = req.query;
        const data = req.body;
        const response = await updateCharityOrgManagement(keyword, data);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

// delete a charity organization management
const deleteCharityOrgManagements = async (req, res) => {
    try {
        const { keyword } = req.query;
        console.log("keyword: ", keyword);
        const response = await deleteCharityOrgManagement(keyword);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
        
    }
};

module.exports = {
    getCharityOrgManagements,
    getCharityOrgManagement,
    createCharityOrgManagements,
    updateCharityOrgManagements,
    deleteCharityOrgManagements,
};