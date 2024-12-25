const {
    getSeverityService,
} = require('../services/SeverityService');
const { ApiError, HttpStatus } = require('../config/ApiError');


const getSeverity = async (req, res) => {
    try {
        const { search_keyword } = req.query;
        const response = await getSeverityService(search_keyword);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getSeverity:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

module.exports = {
    getSeverity,
};