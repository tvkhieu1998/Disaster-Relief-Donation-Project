'use strict'

const models = require('../models');
const sequelize = require('sequelize');
const { Op } = sequelize;

//get all charity organizations management
const getAllCharityOrgManagement = async () => {
    try {
        const charityOrgManagement = await models.CharityOrgManagement.findAll({
            where: {
                orgId: {
                    [Op.ne]: null   // Lấy tất cả các bản ghi có orgId khác null
                }
            }
        });
        return {
            err: 0,
            message: 'Get all charity organizations management successfully',
            data: charityOrgManagement
        }

    } catch (error) {
        console.log("Error fetching data: ", error);
        return {
            err: 1,
            message: 'Error fetching data'
        }
    }
};

//get a charity organization management by keyword: orgId or cccdAdmin
const getCharityOrgManagementByKeyword = async (keyword) => {
    try {
        if (!keyword) {
            return {
                err: 1,
                message: 'Keyword is required',
                data: null
            };
        }

        const charityOrgManagement = await models.CharityOrgManagement.findAll({
            where: {
                [Op.or]: [
                    { orgId: keyword },
                    { cccdAdmin: keyword },
                    { approvalStatus: keyword }
                ]
            }
        });

        return charityOrgManagement;
    } catch (error) {
        console.log("Error fetching data get charity by keyword: ", error);
        return {
            err: 1,
            message: 'Error fetching data'
        }
    }
};

//create a new charity organization management
const createCharityOrgManagement = async (data) => {
    try {
        const { orgId, cccdAdmin, approvalStatus, approvalAt } = data;

        // Check if orgId is not existed on CharityOrganization table
        const charityOrg = await models.CharityOrganization.findOne({
            where: {
                orgId: orgId
            }
        });
        if (!charityOrg) {
            return {
                err: 1,
                message: 'orgId on CharityOrganization table is not existed.'
            }
        }

        // Check if cccdAdmin is not existed and roleId equal 1 (as Admin) on User table
        const user_cccd = await models.User.findOne({
            where: {
                cccd: cccdAdmin,
                roleId: 1
            }
        });

        if (!user_cccd) {
            return {
                err: 1,
                message: 'cccdAdmin on User table is not existed.'
            }
        }

        // Check if orgId or cccdAdmin or approvalStatus or approvalAt is null
        if (!orgId || !cccdAdmin || approvalStatus === undefined) {
            return {
                err: 1,
                message: 'orgId, cccdAdmin, approvalStatus, approvalAt are required',
                data: null
            }
        }

        // Check if orgId, cccdAdmin, approvalStatus, approvalAt are invalid
        if (typeof orgId !== 'string' || typeof cccdAdmin !== 'string' || typeof approvalStatus !== 'boolean') {
            return {
                err: 1,
                message: 'orgId, cccdAdmin, approvalStatus are invalid',
                data: null
            }
        }

        // Check if orgId and cccdAdmin are existed <=> orgId and cccdAdmin cannot be duplicated
        const existedCharity = await models.CharityOrgManagement.findOne({
            where: {
                orgId: orgId,
                cccdAdmin: cccdAdmin
            }
        });
        if (existedCharity) {
            return {
                err: 1,
                message: 'Charity organization management is already existed',
                data: existedCharity
                // data: null
            }
        }

        // create a new charity org management
        const newCharityOrgManagement = await models.CharityOrgManagement.create({
            orgId: orgId,
            cccdAdmin: cccdAdmin,
            approvalStatus: approvalStatus || false,    // Default value is false
            approvalAt: approvalAt || new Date()        // Default value is current date
        });

        return {
            err: 0,
            message: 'Create a new charity org management successfully',
            data: newCharityOrgManagement
        }
    } catch (error) {
        console.log("Cannot create a new charity org management: ", error);
        return {
            err: 1,
            message: 'Cannot create a new charity org management'
        }
    }
};
// update charity organization management by orgId & cccdAdmin
// do not update orgId & cccdAdmin
const updateCharityOrgManagement = async (keyword, data) => {
    try {
        // check if keyword is not existed
        const charityOrgManagementExist = await getCharityOrgManagementByKeyword(keyword);
        if (!charityOrgManagementExist) {
            return {
                err: 1,
                message: 'Charity Organization Management is not existed',
                data: null
            }
        }
        console.log(charityOrgManagementExist);

        const { approvalStatus, approvalAt } = data;
        // Check if orgId, cccdAdmin, approvalStatus, approvalAt are invalid
        if (typeof approvalStatus !== 'boolean') {
            return {
                err: 1,
                message: 'approvalStatus is invalid',
                data: null
            }
        }

        // update charity organization management
        const [charityOrgManagement] = await models.CharityOrgManagement.update({
            //approvalStatus: approvalStatus || charityOrgManagementExist.approvalStatus,    //Default value is the current value
            approvalStatus: approvalStatus !== undefined ? approvalStatus : charityOrgManagementExist.approvalStatus,
            approvalAt: approvalAt || charityOrgManagementExist.approvalAt                //Default value is the current value

        }, {
            where: {
                [Op.or]: [
                    { orgId: keyword },
                    { cccdAdmin: keyword }
                ],
            }
        });


        // check if charity organization management is not updated
        if (charityOrgManagement === 0) {
            return {
                err: 1,
                message: 'Charity Organization Management is not updated',
                data: null
            }
        }

        console.log(charityOrgManagement);

        const charityOrgManagementUpdated = await models.CharityOrgManagement.findOne({
            where: {
                [Op.or]: [
                    { orgId: keyword },
                    { cccdAdmin: keyword }
                ]
            }
        });

        return {
            err: 0,
            message: 'Charity Organization Management is updated successfully',
            data: charityOrgManagementUpdated
        }


    } catch (error) {
        console.log("Error while updating charity organization management:", error);
        return {
            err: 1,
            message: 'An error occurred while updating the Charity Organization Management.',
            data: error.message
        };
    }
};

//delete a charity organization management by orgId & cccdAdmin
const deleteCharityOrgManagement = async (keyword) => {
    try {
        // check if keyword is not existed
        const charityOrgManagementExist = await getCharityOrgManagementByKeyword(keyword);
        if (!charityOrgManagementExist) {
            return {
                err: 1,
                message: 'Charity Organization Management is not existed',
                data: null
            }
        }
        console.log(charityOrgManagementExist);

        // delete a charity organization management
        const charityOrgManagement = await models.CharityOrgManagement.destroy({
            where: {
                [Op.or]: [
                    { orgId: keyword },
                    // { cccdAdmin: keyword },
                ],
            }
        });

        // check if charity organization management is not deleted
        if (charityOrgManagement === 0) {
            return {
                err: 1,
                message: 'Charity Organization Management is not deleted',
                data: null
            }
        }

        return {
            err: 0,
            message: 'Charity Organization Management is deleted successfully',
            data: charityOrgManagement
        }

    } catch (error) {
        console.log("Error while deleting charity organization management:", error);
        return {
            err: 1,
            message: 'An error occurred while deleting the Charity Organization Management.',
            data: error.message
        };

    }
};



module.exports = {
    getAllCharityOrgManagement,
    getCharityOrgManagementByKeyword,
    createCharityOrgManagement,
    updateCharityOrgManagement,
    deleteCharityOrgManagement
};