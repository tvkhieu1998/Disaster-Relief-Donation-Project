'use strict'
const {
    getAllVictims,
    getVictimByKeyword,
    createVictim,
    updateVictim,
    deleteVictim
} = require('../services/VictimService');
const { ApiError, HttpStatus } = require('../config/ApiError');

//get all victims
const getVictims = async (req, res) => {
    try {
        const response = await getAllVictims();
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        }); 
    }
}

//get victim by keyword: cccd or name
const getVictimByKey = async (req, res) => {
    try {
        const { keyword } = req.query;
        const response = await getVictimByKeyword(keyword);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        }); 
    }
}

//create a new victim
const createNewVictim = async (req, res) => {
    try {
        const data = req.body;
        const response = await createVictim(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

//update victim by keyword: cccd or name
const updateVictimByKey = async (req, res) => {
    try {
        // const { keyword } = req.query;
        const data = req.body;
        const response = await updateVictim(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

//delete victim by keyword: cccd or name
const deleteVictimByKey = async (req, res) => {
    try {
        // const { keyword } = req.query;
        const data = req.body;
        const response = await deleteVictim(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

module.exports = {
    getVictims,
    getVictimByKey,
    createNewVictim,
    updateVictimByKey,
    deleteVictimByKey
}

