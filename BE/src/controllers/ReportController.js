const {
    getLatestReportService,
    getReportStatisticService,
    getReportsService,
    createNewReport,
    updateReport,
    deleteReport
} = require('../services/ReportService');
const { ApiError, HttpStatus } = require('../config/ApiError');

const getLatestReport = async (req, res) => {
    try {
        const response = await getLatestReportService();
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getAllFeedback:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const getReportStatistic = async (req, res) => {
    try {
        const response = await getReportStatisticService();
        return res.status(200).json(response);
    } catch (err) {
        console.error('Error in getAllFeedback:', err);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

// get report by keyword
const getReports = async (req, res) => {
    try {
        const { search_keyword, pageIndex } = req.query;
        const response = await getReportsService(search_keyword, pageIndex);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

// create a new report
const createReport = async (req, res) => {
    try {
        const data = req.body;
        const response = await createNewReport(data);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

// update report by orgId & cccdAmin
const updateReportByKey = async (req, res) => {
    try {
        const data = req.body;
        const response = await updateReport(data);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

// delete report by orgId & cccdAmin
const deleteReportByKey = async (req, res) => {
    try {
        const data = req.body;
        const response = await deleteReport(data);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

module.exports = {
    getLatestReport,
    getReportStatistic,
    getReports,
    createReport,
    updateReportByKey,
    deleteReportByKey
};