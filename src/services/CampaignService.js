'use strict';

const models = require('../models');
const sequelize = require('sequelize');
const { Op } = sequelize;

//get all campaigns
const getAllCampaigns = (search_keyword, pageIndex) => new Promise(async (resolve, reject) => {
    try {

        const pageLimit = 5;
        const offset = (pageIndex - 1) * pageLimit;

        const searchConditions = search_keyword
            ? {
                [Op.or]: [
                    { campaignId: { [Op.like]: `%${search_keyword}%` } },
                    { orgId: { [Op.like]: `%${search_keyword}%` } },
                    { status: { [Op.like]: `%${search_keyword}%` } },
                    { disasterId: { [Op.like]: `%${search_keyword}%` } }
                ]
            }
            : {};

        const response = await models.Campaign.findAll({
            where: searchConditions,
            limit: pageLimit,
            offset: offset,
        });
        resolve({
            error: 0,
            message: 'Get all campaigns successfully',
            data: response,
            CurrentPage: pageIndex
        });


    } catch (error) {
        reject({
            error: 1,
            message: 'Error fetching data',
            details: error
        });
    }
});

//get a campaign by keyword: campaignId or campaignName
const getCampaignByKeyword = async (keyword, pageIndex) => {
    try {
        const pageLimit = 5;
        const offset = (pageIndex - 1) * pageLimit;
        const whereCondition = keyword
            ? {
                [Op.or]: [
                    { campaignId: keyword },
                    { orgId: keyword },
                    { status: keyword }
                ]
            }
            : {};

        const campaigns = await models.Campaign.findAll({
            where: whereCondition,
            limit: pageLimit,
            offset: offset,
        });

        return {
            error: 0,
            message: 'Get all campaigns successfully',
            campaigns: campaigns,
            CurrentPage: pageIndex
        };
    } catch (error) {
        console.log("Error fetching data get campaign by keyword: ", error);
        return {
            error: 1,
            message: 'Error fetching data get campaign by keyword'
        }
    }
};

//create a new campaign
const createNewCampaign = async (data) => {
    try {
        const {
            campaignId,
            description,
            remaining,
            damages,
            budget,
            status,
            disasterId,
            orgId,
            startDate,
            endDate,

        } = data;
        //check if campaignId is already existed
        const campaign = await models.Campaign.findOne({
            where: {
                campaignId: campaignId
            }
        });
        if (campaign) {
            return {
                error: 1,
                message: 'Campaign is already existed',
                data: null
            }
        }

        // Check if disasterId is not existed on Disaster table
        const disaster = await models.Disaster.findOne({
            where: {
                disasterId: disasterId
            }
        });
        if (!disaster) {
            return {
                error: 1,
                message: 'disasterId on Disaster table is not existed.'
            }
        }

        // Check if orgId is not existed on CharityOrganization table
        const charityOrg = await models.CharityOrganization.findOne({
            where: {
                orgId: orgId
            }
        });
        if (!charityOrg) {
            return {
                error: 1,
                message: 'orgId on CharityOrganization table is not existed.'
            }
        }

        // Check if data is null
        if (!description || !status) {
            return {
                error: 1,
                message: 'Data is required'
            }
        }

        // Check if data is invalid
        if (typeof description !== 'string' || typeof remaining !== 'number' || typeof damages !== 'number' || typeof budget !== 'number' || typeof status !== 'string') {
            return {
                error: 1,
                message: 'Data is invalid'
            }
        }

        // Create new campaign

        const newCampaign = await models.Campaign.create({
            campaignId: campaignId,
            description: description,
            remaining: remaining,
            damages: damages,
            budget: budget,
            status: status,
            disasterId: disasterId,
            orgId: orgId,
            startDate: startDate || getDateTime(),
            endDate: endDate || getDateTime()
        });
        return {
            error: 0,
            message: 'Create new campaign successfully',
            data: newCampaign
        };
    } catch (error) {
        console.log("Error creating new campaign: ", error);
        return {
            error: 1,
            message: 'Error creating new campaign'
        }
    }
}

//update a campaign by campaignId
const updateCampaign = async (data) => {
    try {
        const {
            campaignId,
            description,
            remaining,
            damages,
            budget,
            status,
            disasterId,
            orgId,
            startDate,
            endDate,
        } = data;

        // Check if disasterId is not existed on Disaster table
        const disaster = await models.Disaster.findOne({
            where: {
                disasterId: disasterId
            }
        });
        if (!disaster) {
            return {
                error: 1,
                message: 'disasterId on Disaster table is not existed.'
            }
        }

        // Check if orgId is not existed on CharityOrganization table
        const charityOrg = await models.CharityOrganization.findOne({
            where: {
                orgId: orgId
            }
        });
        if (!charityOrg) {
            return {
                error: 1,
                message: 'orgId on CharityOrganization table is not existed.'
            }
        }

        // Check if data is null
        if (!description || !status) {
            return {
                error: 1,
                message: 'Data is required'
            }
        }

        // Check if data is invalid
        if (typeof description !== 'string' || typeof remaining !== 'number' || typeof damages !== 'number' || typeof budget !== 'number' || typeof status !== 'string') {
            return {
                error: 1,
                message: 'Data is invalid'
            }
        }

        // Update campaign
        const [updated] = await models.Campaign.update({
            description: description,
            remaining: remaining,
            damages: damages,
            budget: budget,
            status: status,
            disasterId: disasterId,
            startDate: startDate,
            endDate: endDate
        }, {
            where: {
                orgId: orgId
            }
        });

        if (updated === 0) {
            return {
                error: 1,
                message: 'No Campaign was updated.',
                data: null
            };
        }

        const campaignUpdated = await models.Campaign.findOne({
            where: {
                campaignId: campaignId
            }
        });

        return {
            error: 0,
            message: 'Update campaign successfully',
            data: campaignUpdated
        };

    } catch (error) {
        console.log("Error updating campaign: ", error);
        return {
            error: 1,
            message: 'Error updating campaign'
        }
    }
};

// delete a campaign by campaignId
const deleteCampaign = async (data) => {
    try {
        const { orgId } = data;

        const deleted = await models.Campaign.destroy({
            where: {
                orgId: orgId
            }
        });

        if (deleted === 0) {
            return {
                error: 1,
                message: 'No Campaign was deleted.',
                data: null
            };
        }

        return {
            error: 0,
            message: 'Delete campaign successfully'
        };

    } catch (error) {
        console.log("Error deleting campaign: ", error);
        return {
            error: 1,
            message: 'Error deleting campaign'
        }
    }
};

const updateRemainingFromDonation = (search_keyword) => new Promise(async (resolve, reject) => {
    try {
        const whereCondition = search_keyword
            ? { orgId: search_keyword }
            : {};

        const totalAmount = await models.Donation.sum('amount', {
            where: whereCondition,
        });

        //Find Campaign and update
        const campaign = await models.Campaign.findOne({
            where: { orgId: search_keyword },
        });
        if (campaign) {
            campaign.remaining = totalAmount || 0;
            await campaign.save();
        }

        resolve({
            error: 0,
            message: 'Lấy kết quả thành công',
            orgId: search_keyword,
            totalAmount: totalAmount || 0
        });

    } catch (error) {
        reject({
            error: 1,
            message: 'Đã xảy ra lỗi trong quá trình xử lý'
        })
    }
})



function getDateTime() {
    return new Date().toISOString();
}

module.exports = {
    getAllCampaigns,
    getCampaignByKeyword,
    createNewCampaign,
    updateCampaign,
    deleteCampaign,
    updateRemainingFromDonation,
};