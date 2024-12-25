const {
    getAllMeteorologicalAgency,
    getMeteorologicalAgencyByKeyword,
    createMeteorologicalAgency,
    updateMeteorologicalAgency,
    deleteMeteorologicalAgency
} = require('../services/MeteorologicalAgencyService');
const { ApiError, HttpStatus } = require('../config/ApiError');

// get all meteorological agencies
const getMeteorologicalAgencies = async (req, res) => {
    try {
        const response = await getAllMeteorologicalAgency();
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

// get meteorological agency by keyword
const getMeteorologicalAgencyByKey = async (req, res) => {
    try {
        const { keyword } = req.query;
        const response = await getMeteorologicalAgencyByKeyword(keyword);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

// create a new meteorological agency
const createMeteorologicalAgencies = async (req, res) => {
    try {
        const data = req.body;
        const response = await createMeteorologicalAgency(data);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

// update meteorological agency by agencyId & agencyName
const updateMeteorologicalAgencies = async (req, res) => {
    try {
        // const { keyword } = req.params;
        // console.log("keyword: ", keyword);
        const data = req.body;
        const response = await updateMeteorologicalAgency(data);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

// delete meteorological agency by agencyId & agencyName
const deleteMeteorologicalAgencies = async (req, res) => {
    try {
        // const { keyword } = req.query;
        const data = req.body;
        const response = await deleteMeteorologicalAgency(data);
        return res.status(200).json(response);
        
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}
module.exports = {
    getMeteorologicalAgencies,
    getMeteorologicalAgencyByKey,
    createMeteorologicalAgencies,
    updateMeteorologicalAgencies,
    deleteMeteorologicalAgencies
}