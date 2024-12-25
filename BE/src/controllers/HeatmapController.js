const {
    getHeatmapService, getHeatmapByPKService, createHeatmapService, updateHeatmapService, deleteHeatmapService,
} = require('../services/HeatmapService');
const { ApiError, HttpStatus } = require('../config/ApiError');


const getHeatmap = async (req, res) => {
    try {
        const { search_keyword, pageIndex } = req.query;
        const response = await getHeatmapService(search_keyword, pageIndex);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getSeverity:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};
const getHeatmapByPK = async (req, res) => {
    try {
        const { search_keyword } = req.query;
        const response = await getHeatmapByPKService(search_keyword);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getSeverity:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const createHeatmap = async (req, res) => {
    try {
        const data = req.body;
        const response = await createHeatmapService(data);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const updateHeatmap = async (req, res) => {
    try {
        const data = req.body;
        const response = await updateHeatmapService(data);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const deleteHeatmap = async (req, res) => {
    try {
        const data = req.body;
        const heatmapId = data.id;
        const response = await deleteHeatmapService(heatmapId);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};


module.exports = {
    getHeatmap, getHeatmapByPK, createHeatmap, updateHeatmap, deleteHeatmap,
};