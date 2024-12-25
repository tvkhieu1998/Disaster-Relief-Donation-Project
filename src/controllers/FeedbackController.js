const { createFeedbackService, deleteFeedbackService, getAllFeedbackService, getFeedbackStatisticService,
} = require('../services/FeedbackService');
const { ApiError,
    HttpStatus } = require('../config/ApiError');

const getFeedbackStatistic = async (req, res) => {
    try {
        const response = await getFeedbackStatisticService();
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getAllFeedback:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const getAllFeedback = async (req, res) => {
    try {
        const { search_keyword, pageIndex } = req.query;
        const response = await getAllFeedbackService(search_keyword, pageIndex);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getAllFeedback:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};



const createFeedback = async (req, res) => {
    try {
        const data = req.body;
        const response = await createFeedbackService(data);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const deleteFeedback = async (req, res) => {
    try {
        const data = req.body;
        const feedbackId = data.id;
        const response = await deleteFeedbackService(feedbackId);
        return res.status(200).json(response);
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};




module.exports = {
    createFeedback, deleteFeedback, getAllFeedback, getFeedbackStatistic,
};