'use strict'

const {
    getAllDisasters,
    getDisasterByKeyWord,
    createDisaster,
    updateDisasterByKeyWord,
    deleteDisasterByKeyWord
} = require('../services/DisasterService');
const { ApiError, HttpStatus } = require('../config/ApiError');

// get all disasters
const getDisasters = async (req, res) => {
    try {
        const response = await getAllDisasters();
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

// get disasters by keyword
const getDisasterByKey = async (req, res) => {
    try {
        const { search_keyword, pageIndex } = req.query;
        const response = await getDisasterByKeyWord(search_keyword, pageIndex);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

// create a new disaster
const createNewDisaster = async (req, res) => {
    try {
        const data = req.body;
        const response = await createDisaster(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

// update disaster by keyword
const updateDisaster = async (req, res) => {
    try {
        // const { keyword } = req.query;
        const data = req.body;
        const response = await updateDisasterByKeyWord(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

// delete a disaster by keyword
const deleteDisaster = async (req, res) => {
    try {
        // const { keyword } = req.query;
        const data = req.body;
        const response = await deleteDisasterByKeyWord(data);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

module.exports = {
    getDisasters,
    getDisasterByKey,
    createNewDisaster,
    updateDisaster,
    deleteDisaster
}

