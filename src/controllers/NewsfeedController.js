const {
    scrapeTitleService,
    scrapeContentService,
    getNewsfeedService,
    getNewsfeedByPKService,
    createNewsfeedService,
    updateNewsfeedService,
    deleteNewsfeedService,
} = require('../services/NewsfeedService');
const { ApiError, HttpStatus } = require('../config/ApiError');


const getTitle = async (req, res) => {
    try {
        const data = req.body;
        const response = await scrapeTitleService(data);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getTitle:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const getContent = async (req, res) => {
    try {
        const data = req.body;
        const response = await scrapeContentService(data);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getContent:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const getNewsfeed = async (req, res) => {
    try {
        const { search_keyword, pageIndex } = req.query;
        const response = await getNewsfeedService(search_keyword, pageIndex);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getContent:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const getNewsfeedByPK = async (req, res) => {
    try {
        const { search_keyword } = req.query;
        const response = await getNewsfeedByPKService(search_keyword);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getContent:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const createNewsfeed = async (req, res) => {
    try {
        const data = req.body;
        const response = await createNewsfeedService(data);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getContent:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const updateNewsfeed = async (req, res) => {
    try {
        const data = req.body;
        const response = await updateNewsfeedService(data);
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getContent:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const deleteNewsfeed = async (req, res) => {
    try {
        const data = req.body;
        const newsfeed = data.id;
        const response = await deleteNewsfeedService(newsfeed);
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
    getTitle,
    getContent,
    getNewsfeed,
    getNewsfeedByPK,
    createNewsfeed,
    updateNewsfeed,
    deleteNewsfeed,
}