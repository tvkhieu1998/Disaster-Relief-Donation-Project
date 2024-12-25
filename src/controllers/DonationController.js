const { createVNPayDonationService, vnPayReturnService, getTotalAmountOfDonationService, countDonationService, getDonationsService
} = require('../services/DonationService');
const { ApiError,
    HttpStatus } = require('../config/ApiError');


const createVNPayDonation = async (req, res) => {
    try {
        const PaymentUrl = await createVNPayDonationService(req);
        return res.status(200).json({ url: PaymentUrl });
    } catch (err) {
        console.error('Error in createPaymentUrl:', err.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_003_RESQUEST_VNPAY_FAILURE.status,
            message: err.message || ApiError.API_ERROR_003_RESQUEST_VNPAY_FAILURE.message,
        });
    }
};

const vnPayReturn = async (req, res) => {
    try {
        const PaymentUrl = await vnPayReturnService(req);
        return res.status(200).json({ url: PaymentUrl });
    } catch (err) {
        console.error('Error in createPaymentUrl:', err.message);
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_004_RETURN_VNPAY_FAILURE.status,
            message: err.message || ApiError.API_ERROR_004_RETURN_VNPAY_FAILURE.message,
        });
    }
};

const getTotalAmountOfDonation = async (req, res) => {
    try {
        const { search_keyword } = req.query;
        const response = await getTotalAmountOfDonationService(search_keyword)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const countDonation = async (req, res) => {
    try {
        const { search_keyword } = req.query;
        const response = await countDonationService(search_keyword)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

const getDonations = async (req, res) => {
    try {
        const { search_keyword, pageIndex } = req.query;
        const response = await getDonationsService(search_keyword, pageIndex)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};



module.exports = {
    createVNPayDonation, vnPayReturn, getTotalAmountOfDonation, countDonation, getDonations
};