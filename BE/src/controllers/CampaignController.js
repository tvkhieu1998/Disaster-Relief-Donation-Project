'use strict';

const { getAllCampaigns,
    getCampaignByKeyword,
    createNewCampaign,
    updateCampaign,
    deleteCampaign,
    updateRemainingFromDonation } = require('../services/CampaignService');
const { ApiError, HttpStatus } = require('../config/ApiError');
// get all campaigns
const getCampaigns = async (req, res) => {
    try {
        const { search_keyword, pageIndex } = req.query;
        const response = await getAllCampaigns(search_keyword, pageIndex);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

// get campaign by keyword
const getCampaignByKey = async (req, res) => {
    try {
        const { search_keyword, pageIndex } = req.query;
        const response = await getCampaignByKeyword(search_keyword, pageIndex);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

//create a new campaign
const createCampaign = async (req, res) => {
    try {
        const data = req.body;
        const response = await createNewCampaign(data);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

//update campaign by campaignId 
const updateCampaignByKey = async (req, res) => {
    try {
        const data = req.body;
        const response = await updateCampaign(data);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
};

//delete campaign by campaignId
const deleteCampaignByKey = async (req, res) => {
    try {
        const data = req.body;
        const response = await deleteCampaign(data);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}

const updateCampaignRemaining = async (req, res) => {
    try {
        const { search_keyword } = req.query;
        const response = await updateRemainingFromDonation(search_keyword);
        return res.status(200).json(response)
    } catch (error) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            code: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.status,
            message: ApiError.API_ERROR_000_INTERNAL_SERVER_ERROR.message
        });
    }
}


module.exports = {
    getCampaigns,
    getCampaignByKey,
    createCampaign,
    updateCampaignByKey,
    deleteCampaignByKey,
    updateCampaignRemaining
}