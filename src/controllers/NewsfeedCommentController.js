const {
    getNewsfeedCommentsService,
    createNewsfeedCommentService,
    deleteNewsfeedCommentService,
} = require('../services/NewsfeedCommentService');
const { ApiError, HttpStatus } = require('../config/ApiError');

const getNewsfeedComments = async (req, res) => {
    try {
        const { search_keyword, pageIndex } = req.query;
        const response = await getNewsfeedCommentsService(search_keyword, pageIndex);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getContent:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const createNewsfeedComment = async (req, res) => {
    try {
        const data = req.body;
        const response = await createNewsfeedCommentService(data);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getContent:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const deleteNewsfeedComment = async (req, res) => {
    try {
        const data = req.body;
        const newsfeedCommentId = data.id;
        const response = await deleteNewsfeedCommentService(newsfeedCommentId);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getContent:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

module.exports = {
    getNewsfeedComments,
    createNewsfeedComment,
    deleteNewsfeedComment,
}